import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addUser,
  findUser,
  getSession,
  setSession,
  type Session,
  type UserRecord,
} from "../lib/storage";

type AuthContextValue = {
  user: Session | null;
  signIn: (email: string, password: string) => void;
  signUp: (name: string, email: string, password: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Session | null>(() => getSession());

  const signIn = useCallback((email: string, password: string) => {
    const u = findUser(email, password);
    if (!u) throw new Error("Invalid email or password.");
    const session: Session = { name: u.name, email: u.email };
    setSession(session);
    setUser(session);
  }, []);

  const signUp = useCallback((name: string, email: string, password: string) => {
    const rec: UserRecord = { name: name.trim(), email: email.trim(), password };
    addUser(rec);
    const session: Session = { name: rec.name, email: rec.email };
    setSession(session);
    setUser(session);
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, signIn, signUp, signOut }),
    [user, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
