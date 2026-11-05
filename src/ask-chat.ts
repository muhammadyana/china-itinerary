import { AskError, chat, isAbort, login, unreachableMessage } from './ask-api.ts';
import { renderMarkdown, safeHref } from './ask-markdown.ts';
import { limits, loadHistory, pageContext, requestMessages, saveHistory, setUnlocked, trimHistory, type Message, type Source } from './ask-state.ts';

export interface ChatOptions {
  // A chat request came back 401; the question is back in the composer and the login form is showing.
  onUnauthorized?: () => void;
}

export interface ChatController {
  showChat(): void;
  showLogin(message?: string): void;
  isLoginShown(): boolean;
  focus(): void;
  reset(): void;
  notify(message: string): void;
  refreshContext(): void;
}

export const expiredMessage = 'Sesi berakhir. Masukkan kata sandi lagi.';
const thinking = 'Sedang berpikir…';
const cutOff = 'Jawaban terputus sebelum selesai. Coba lagi.';
const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = ''): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function messageShell(role: Message['role']) {
  const wrapper = element('div', `ask-message ask-message-${role}`);
  const body = element('div', 'ask-bubble');
  wrapper.append(element('span', 'visually-hidden', role === 'user' ? 'Kamu: ' : 'Tanya AI: '), body);
  return { wrapper, body };
}

function userMessage(text: string) {
  const { wrapper, body } = messageShell('user');
  body.textContent = text;
  return wrapper;
}

const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, '');

function sourceList(items: Source[]) {
  const links = items.flatMap(item => {
    const href = safeHref(item.url);
    return href?.startsWith('https:') ? [{ href, title: item.title.trim() }] : [];
  });
  if (!links.length) return null;
  const section = element('div', 'ask-sources');
  const list = element('ul');
  list.setAttribute('role', 'list');
  for (const { href, title } of links) {
    // Without a title the hostname is the label, shown once.
    const anchor = element('a', '', title || hostname(href));
    anchor.href = href;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    if (title) anchor.append(element('span', 'ask-source-host', hostname(href)));
    anchor.append(element('span', 'visually-hidden', ' (buka tab baru)'));
    const item = element('li');
    item.append(anchor);
    list.append(item);
  }
  section.append(element('p', 'ask-sources-title', 'Sumber web'), list);
  return section;
}

function assistantMessage(message: Pick<Message, 'content' | 'sources'>) {
  const { wrapper, body } = messageShell('assistant');
  body.append(renderMarkdown(message.content));
  const sources = message.sources && sourceList(message.sources);
  if (sources) wrapper.append(sources);
  return wrapper;
}

const mergeSources = (current: Source[], added: Source[]) =>
  [...current, ...added.filter(item => !current.some(existing => existing.url === item.url))];

// Coalesces streamed chunks into at most one render per animation frame.
function perFrame(callback: () => void) {
  let frame = 0;
  return {
    schedule() { frame ||= requestAnimationFrame(() => { frame = 0; callback(); }); },
    flush() { cancelAnimationFrame(frame); frame = 0; callback(); },
  };
}

export function createChat(root: HTMLElement, options: ChatOptions = {}): ChatController {
  const find = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const scroller = find('[data-ask-scroll]');
  const log = find('[data-ask-log]');
  const empty = find('[data-ask-empty]');
  const status = find('[data-ask-status]');
  const composer = find<HTMLFormElement>('[data-ask-composer]');
  const input = find<HTMLTextAreaElement>('[data-ask-composer] textarea');
  const send = find<HTMLButtonElement>('.ask-send');
  const stop = find<HTMLButtonElement>('.ask-stop');
  const loginForm = find<HTMLFormElement>('[data-ask-login]');
  const password = find<HTMLInputElement>('[data-ask-login] input[type="password"]');
  const loginError = find('[data-ask-login-error]');
  const context = root.querySelector<HTMLElement>('[data-ask-context]');
  let history = loadHistory();
  let controller: AbortController | null = null;
  let failedTurn: { nodes: HTMLElement[]; question: string } | null = null;

  const distanceToEnd = () => scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
  // New text keeps the end in view only while the reader is there; any upward scroll stops that until they return.
  let following = true;
  let lastTop = 0;
  const scrollToEnd = () => { scroller.scrollTop = scroller.scrollHeight; following = true; };
  const setStatus = (text: string) => { status.textContent = text; status.classList.toggle('is-working', Boolean(text)); };
  const autosize = () => {
    input.style.height = 'auto';
    input.style.height = `${input.scrollHeight + input.offsetHeight - input.clientHeight}px`;
  };

  function renderHistory() {
    log.replaceChildren(...history.map(message => message.role === 'user' ? userMessage(message.content) : assistantMessage(message)));
    empty.hidden = history.length > 0;
    failedTurn = null;
    scrollToEnd();
  }

  function setState(state: 'chat' | 'login') {
    for (const node of root.querySelectorAll<HTMLElement>('[data-ask-when]')) node.hidden = node.dataset.askWhen !== state;
  }

  function setBusy(busy: boolean) {
    const active = document.activeElement;
    // Focus on <body> means the control that held it (a suggestion, "Coba lagi", Stop) just went away.
    const hadFocus = !active || active === document.body || (busy ? root.contains(active) : active === stop);
    input.disabled = busy;
    send.hidden = busy;
    stop.hidden = !busy;
    if (busy) log.setAttribute('aria-busy', 'true');
    else log.removeAttribute('aria-busy');
    if (!hadFocus) return;
    if (busy) stop.focus();
    // A keyboard user returns to the composer; on touch screens that would pop the keyboard over the answer.
    else (finePointer() ? input : send).focus({ preventScroll: true });
  }

  function errorBox(message: string, question: string) {
    const box = element('div', 'ask-error');
    box.setAttribute('role', 'alert');
    const retry = element('button', 'quiet-button', 'Coba lagi');
    retry.type = 'button';
    retry.addEventListener('click', () => {
      failedTurn?.nodes.forEach(node => node.remove());
      failedTurn = null;
      void ask(question);
    });
    box.append(element('p', '', message), retry);
    return box;
  }

  function restoreQuestion(question: string, nodes: HTMLElement[]) {
    nodes.forEach(node => node.remove());
    empty.hidden = history.length > 0;
    input.value = question;
    autosize();
  }

  async function ask(rawQuestion: string) {
    const question = rawQuestion.trim().slice(0, limits.user);
    if (!question || controller) return;
    failedTurn?.nodes.forEach(node => node.remove());
    failedTurn = null;
    refreshContext();
    const turnController = new AbortController();
    controller = turnController;
    const { wrapper: answer, body } = messageShell('assistant');
    const nodes = [userMessage(question), answer];
    empty.hidden = true;
    log.append(...nodes);
    scrollToEnd();
    setBusy(true);
    setStatus(thinking);
    let text = '';
    let sources: Source[] = [];
    let finished = false;
    let unauthorized = false;
    let failure = '';
    const paint = perFrame(() => {
      body.replaceChildren(renderMarkdown(text));
      if (following) scrollToEnd();
    });
    try {
      const page = pageContext();
      for await (const event of chat(requestMessages(history, question, page), page, turnController.signal)) {
        if (event.type === 'text') {
          text += event.text;
          setStatus('');
          paint.schedule();
        } else if (event.type === 'status') setStatus(event.text);
        else if (event.type === 'sources') sources = mergeSources(sources, event.items);
        else if (event.type === 'error') {
          // A refusal or failure mid-answer: the partial text is not an answer.
          failure = event.message;
          text = '';
        }
        else finished = true;
        if (finished || failure) break;
      }
      if (!finished && !failure) failure = cutOff;
    } catch (error) {
      if (error instanceof AskError && error.status === 401) unauthorized = true;
      else if (isAbort(error)) {
        // The Stop button: keep what already arrived.
        finished = Boolean(text.trim());
        if (!finished) failure = 'Jawaban dihentikan.';
      } else failure = error instanceof AskError ? error.message : text ? cutOff : unreachableMessage;
    }
    // A new conversation or the login form took over while this answer was running.
    if (controller !== turnController) return;
    controller = null;
    paint.flush();
    setStatus('');
    if (unauthorized) {
      setBusy(false);
      restoreQuestion(question, nodes);
      showLogin(expiredMessage);
      options.onUnauthorized?.();
      return;
    }
    if (finished && text.trim()) {
      const sourcesNode = sourceList(sources);
      if (sourcesNode) answer.append(sourcesNode);
      const reply: Message = { role: 'assistant', content: text.slice(0, limits.assistant) };
      history = trimHistory([...history, { role: 'user', content: question }, sources.length ? { ...reply, sources } : reply]);
      saveHistory(history);
    } else {
      answer.append(errorBox(failure || 'Jawaban kosong. Coba lagi.', question));
      failedTurn = { nodes, question };
    }
    setBusy(false);
    if (following || !text) scrollToEnd();
  }

  // Ends a running answer without keeping it, for a new conversation or the login form.
  function cancel() {
    if (!controller) return;
    controller.abort();
    controller = null;
    setBusy(false);
    setStatus('');
  }

  function showLogin(message = '') {
    cancel();
    setState('login');
    loginError.textContent = message;
  }

  function showChat() {
    setState('chat');
    loginError.textContent = '';
  }

  function refreshContext() {
    if (!context) return;
    const page = pageContext();
    context.textContent = `Konteks: ${page.detail || page.title}`;
  }

  function reset() {
    cancel();
    history = [];
    saveHistory(history);
    renderHistory();
    input.value = '';
    autosize();
    setStatus('');
  }

  scroller.addEventListener('wheel', event => { if (event.deltaY < 0) following = false; }, { passive: true });
  scroller.addEventListener('touchmove', () => { following = false; }, { passive: true });
  scroller.addEventListener('touchend', () => { following = distanceToEnd() < 8; }, { passive: true });
  // Scrollbar drags and keys: moving up away from the end stops following, coming back down to it resumes.
  scroller.addEventListener('scroll', () => {
    const top = scroller.scrollTop;
    if (top > lastTop && distanceToEnd() < 8) following = true;
    else if (top < lastTop && distanceToEnd() >= 8) following = false;
    lastTop = top;
  }, { passive: true });
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    composer.requestSubmit();
  });
  composer.addEventListener('submit', event => {
    event.preventDefault();
    if (!input.value.trim() || controller) return;
    const question = input.value;
    input.value = '';
    autosize();
    void ask(question);
  });
  stop.addEventListener('click', () => controller?.abort());
  root.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    const chip = target?.closest<HTMLButtonElement>('[data-ask-suggestion]');
    if (chip && !controller) {
      input.value = chip.textContent ?? '';
      composer.requestSubmit();
    }
    if (target?.closest('[data-ask="new"]')) {
      reset();
      input.focus();
    }
  });

  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    const button = loginForm.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    if (!password.value) {
      loginError.textContent = 'Masukkan kata sandi dulu.';
      password.focus();
      return;
    }
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    loginError.textContent = '';
    try {
      await login(password.value);
      password.value = '';
      setUnlocked(true);
      showChat();
      input.focus();
      autosize();
    } catch (error) {
      loginError.textContent = error instanceof AskError ? error.message : unreachableMessage;
      password.select();
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  });

  renderHistory();
  return {
    showChat,
    showLogin,
    isLoginShown: () => !loginForm.hidden,
    focus: () => (loginForm.hidden ? input : password).focus(),
    reset,
    notify: setStatus,
    refreshContext,
  };
}
