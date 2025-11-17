import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  email: string | null;
  loading: boolean;
  error: string | null;
  login: (_email: string, _password: string) => Promise<boolean>;
  register: (_email: string, _password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      email: null,
      loading: false,
      error: null,
      async login(email, password) {
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            set({ error: j.error || 'Login failed', loading: false });
            return false;
          }
          set({ email, loading: false, error: null });
          return true;
        } catch (e) {
          set({ error: 'Network error', loading: false });
          return false;
        }
      },
      async register(email, password) {
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            set({ error: j.error || 'Register failed', loading: false });
            return false;
          }
          set({ email, loading: false, error: null });
          return true;
        } catch (e) {
          set({ error: 'Network error', loading: false });
          return false;
        }
      },
      async logout() {
        try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
        set({ email: null });
      },
    }),
    { name: 'winweb-auth' }
  )
);
