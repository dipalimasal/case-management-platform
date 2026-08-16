const STORAGE_KEY = 'cmp_case_overrides';
const AUDIT_STORAGE_KEY = 'cmp_audit_overrides';

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch {
    // ignore parse errors
  }
  return fallback;
}

export function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getCaseOverrides(): Record<string, Partial<import('../types/case').CaseRecord>> {
  return loadFromStorage(STORAGE_KEY, {});
}

export function setCaseOverride(caseId: string, override: Partial<import('../types/case').CaseRecord>): void {
  const overrides = getCaseOverrides();
  overrides[caseId] = { ...overrides[caseId], ...override };
  saveToStorage(STORAGE_KEY, overrides);
}

export function getAuditOverrides(): import('../types/screening').AuditEvent[] {
  return loadFromStorage(AUDIT_STORAGE_KEY, []);
}

export function addAuditOverride(event: import('../types/screening').AuditEvent): void {
  const events = getAuditOverrides();
  events.push(event);
  saveToStorage(AUDIT_STORAGE_KEY, events);
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}
