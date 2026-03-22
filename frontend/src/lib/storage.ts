export type UserRecord = { name: string; email: string; password: string };

export type PredictionRecord = {
  id: string;
  at: string;
  preview: string;
  threatFinal: string;
  sentimentLabel: string;
  models: Record<string, string>;
  sourceUrl: string | null;
};

export type ThreatStats = {
  noThreat: number;
  potential: number;
  high: number;
};

const USERS = "pst_users";
const SESSION = "pst_session";
const HISTORY = "pst_history";
const STATS = "pst_stats";

const DEFAULT_STATS: ThreatStats = {
  noThreat: 52,
  potential: 62,
  high: 18,
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers(): UserRecord[] {
  return readJson<UserRecord[]>(USERS, []);
}

export function addUser(user: UserRecord): void {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  users.push(user);
  writeJson(USERS, users);
}

export function findUser(email: string, password: string): UserRecord | null {
  const e = email.trim().toLowerCase();
  return getUsers().find((u) => u.email.toLowerCase() === e && u.password === password) ?? null;
}

export type Session = Pick<UserRecord, "name" | "email">;

export function getSession(): Session | null {
  return readJson<Session | null>(SESSION, null);
}

export function setSession(s: Session | null) {
  if (!s) localStorage.removeItem(SESSION);
  else writeJson(SESSION, s);
}

export function getStats(): ThreatStats {
  return readJson<ThreatStats>(STATS, { ...DEFAULT_STATS });
}

export function incrementStatForThreat(label: string) {
  const s = getStats();
  if (label.includes("High")) s.high += 1;
  else if (label.includes("Potential")) s.potential += 1;
  else s.noThreat += 1;
  writeJson(STATS, s);
  return s;
}

export function getHistory(): PredictionRecord[] {
  return readJson<PredictionRecord[]>(HISTORY, []);
}

export function prependHistory(entry: PredictionRecord) {
  const h = getHistory();
  h.unshift(entry);
  writeJson(HISTORY, h.slice(0, 200));
}

export function clearAppData() {
  localStorage.removeItem(HISTORY);
  localStorage.removeItem(STATS);
  localStorage.removeItem(USERS);
  localStorage.removeItem(SESSION);
}
