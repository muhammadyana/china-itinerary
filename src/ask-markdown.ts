// Renders the small markdown subset the assistant uses as DOM nodes. Model text only ever reaches textContent.

// Link URLs may hold one level of balanced parentheses, as in Wikipedia's ".../Lijiang_(city)".
const inlinePattern = /\*\*(.+?)\*\*|`([^`\n]+)`|\[([^\]\n]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)|(https:\/\/(?:[^\s<>()]|\([^\s<>()]*\))*(?:[^\s<>().,;:!?'"*]|\([^\s<>()]*\)))/g;
const bulletLine = /^\s*[-*•]\s+(.*)$/;
const numberedLine = /^\s*(\d+)[.)]\s+(.*)$/;
const headingLine = /^\s*#{1,6}\s+(.*)$/;
const ruleLine = /^\s*([-*_])(\s*\1){2,}\s*$/;

// Only https: links and paths on this site; the resolved origin check also rejects "//host" and "/\host".
export function safeHref(url: string): string | null {
  try {
    if (url.startsWith('/')) {
      const parsed = new URL(url, location.origin);
      return parsed.origin === location.origin ? `${parsed.pathname}${parsed.search}${parsed.hash}` : null;
    }
    const parsed = new URL(url);
    return parsed.protocol === 'https:' ? parsed.href : null;
  } catch {
    return null;
  }
}

function link(label: string, href: string): HTMLAnchorElement {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.textContent = label;
  if (!href.startsWith('/')) {
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    const note = document.createElement('span');
    note.className = 'visually-hidden';
    note.textContent = ' (buka tab baru)';
    anchor.append(note);
  }
  return anchor;
}

function appendInline(parent: HTMLElement, text: string): void {
  let last = 0;
  for (const match of text.matchAll(inlinePattern)) {
    const [whole, bold, code, label, url, bare] = match;
    parent.append(text.slice(last, match.index));
    last = match.index + whole.length;
    if (bold !== undefined) {
      const strong = document.createElement('strong');
      appendInline(strong, bold);
      parent.append(strong);
    } else if (code !== undefined) {
      const element = document.createElement('code');
      element.textContent = code;
      parent.append(element);
    } else {
      const href = safeHref(url ?? bare);
      parent.append(href ? link(label ?? bare, href) : (label ?? whole));
    }
  }
  parent.append(text.slice(last));
}

function listItem(list: HTMLElement, content: string): void {
  const item = document.createElement('li');
  appendInline(item, content);
  list.append(item);
}

export function renderMarkdown(text: string): DocumentFragment {
  const fragment = document.createDocumentFragment();
  let open = null as HTMLElement | null;
  for (const line of text.split(/\r?\n/)) {
    const bullet = line.match(bulletLine);
    const numbered = bullet ? null : line.match(numberedLine);
    const heading = line.match(headingLine);
    if (!line.trim() || ruleLine.test(line)) {
      open = null;
    } else if (bullet || numbered) {
      const tag = bullet ? 'UL' : 'OL';
      if (open?.tagName !== tag) {
        open = document.createElement(tag.toLowerCase());
        if (numbered && numbered[1] !== '1') open.setAttribute('start', numbered[1]);
        fragment.append(open);
      }
      listItem(open, bullet ? bullet[1] : numbered![2]);
    } else if (heading) {
      // Headings stay inside the chat's own outline: a bold paragraph, not h1-h6.
      const paragraph = document.createElement('p');
      const strong = document.createElement('strong');
      appendInline(strong, heading[1].replace(/\*\*/g, ''));
      paragraph.append(strong);
      fragment.append(paragraph);
      open = null;
    } else {
      if (open?.tagName === 'P') open.append(document.createElement('br'));
      else {
        open = document.createElement('p');
        fragment.append(open);
      }
      appendInline(open, line.trim());
    }
  }
  return fragment;
}
