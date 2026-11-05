import { days } from './itinerary.ts';

export interface Source { url: string; title: string }
export interface Message { role: 'user' | 'assistant'; content: string; sources?: Source[] }
export interface PageContext { path: string; title: string; detail?: string }

// Request limits of POST /api/ask/chat; the server rejects anything larger.
export const limits = { messages: 40, total: 60000, user: 4000, assistant: 20000, path: 300, title: 300, detail: 500 } as const;

const historyKey = 'ask-history';
const unlockedKey = 'ask-unlocked';

// Storage can be missing or throw (private mode, blocked site data); the chat still works for the current page.
function read(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function write(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Nothing to do: without storage the conversation lives only on this page.
  }
}

export const isUnlocked = () => read(unlockedKey) === '1';
export const setUnlocked = (unlocked: boolean) => write(unlockedKey, unlocked ? '1' : null);

// Sources are web pages the model searched: https only, whatever the stream or storage says.
export const isSource = (value: unknown): value is Source => {
  const item = value as Partial<Source> | null;
  return typeof item?.url === 'string' && item.url.startsWith('https://') && typeof item.title === 'string';
};

function entry(value: unknown, role: Message['role']): Message | null {
  const item = value as Partial<Message> | null;
  if (item?.role !== role || typeof item.content !== 'string' || !item.content.trim()) return null;
  const content = item.content.slice(0, role === 'user' ? limits.user : limits.assistant);
  const sources = Array.isArray(item.sources) ? item.sources.filter(isSource) : [];
  return sources.length ? { role, content, sources } : { role, content };
}

const characters = (messages: Message[]) => messages.reduce((sum, message) => sum + message.content.length, 0);

// Drops the oldest question/answer pairs until the history plus one maximum-length question fits the request limits.
export function trimHistory(history: Message[]): Message[] {
  let start = 0;
  while (history.length - start > limits.messages - 1 || characters(history.slice(start)) > limits.total - limits.user) start += 2;
  return history.slice(start);
}

// The stored history holds complete pairs only (user, then assistant); anything else is skipped.
export function loadHistory(): Message[] {
  let stored: unknown;
  try { stored = JSON.parse(read(historyKey) ?? '[]'); } catch { return []; }
  if (!Array.isArray(stored)) return [];
  const pairs: Message[] = [];
  for (let index = 0; index < stored.length; index++) {
    const question = entry(stored[index], 'user');
    const answer = question && entry(stored[index + 1], 'assistant');
    if (!question || !answer) continue;
    pairs.push(question, answer);
    index++;
  }
  return trimHistory(pairs);
}

export const saveHistory = (history: Message[]) => write(historyKey, history.length ? JSON.stringify(history) : null);

// The service also caps the body at 64 KB; Chinese names and JSON escapes make bytes outgrow characters.
const maxBodyBytes = 64 * 1024;
const bodyBytes = (value: unknown) => new TextEncoder().encode(JSON.stringify(value)).length;

export function requestMessages(history: Message[], question: string, page: PageContext) {
  let earlier = trimHistory(history);
  const build = () => [...earlier, { role: 'user' as const, content: question.slice(0, limits.user) }].map(({ role, content }) => ({ role, content }));
  while (earlier.length && bodyBytes({ messages: build(), page }) > maxBodyBytes) earlier = earlier.slice(2);
  return build();
}

const clip = (text: string, max: number) => text.replace(/\s+/g, ' ').trim().slice(0, max);

function homepageDay(): string {
  const date = document.querySelector('#day-view time[datetime]')?.getAttribute('datetime');
  const index = days.findIndex(day => day.date === date);
  return index < 0 ? '' : `Hari ${index + 1}, ${Number(days[index].date.slice(-2))} November: ${days[index].title}`;
}

// The route map and the calm option share the day strip; a day is selected only by tapping it on narrower screens.
function routeDay(): string {
  const entry = document.querySelector<HTMLElement>('[data-route-map] .route-entry.is-selected');
  if (!entry?.dataset.day) return '';
  const number = entry.querySelector('.route-entry-number')?.textContent?.trim();
  return `Hari ${number}, ${Number(entry.dataset.day.slice(-2))} November: ${entry.querySelector('h3')?.textContent ?? ''}`;
}

export function pageContext(): PageContext {
  const detail = clip(homepageDay() || routeDay() || document.querySelector('h1')?.textContent || '', limits.detail);
  const context: PageContext = { path: `${location.pathname}${location.hash}`.slice(0, limits.path), title: clip(document.title, limits.title) };
  return detail ? { ...context, detail } : context;
}
