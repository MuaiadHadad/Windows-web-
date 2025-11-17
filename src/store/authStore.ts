import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  email: string | null;
  loading: boolean;
  error: string | null;
  login: (_email: string, _password: string) => Promise<boolean>;
  register: (_email: string, _password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      email: null,
      loading: false,
      error: null,
      clearError: () => set({ error: null }),
      async login(email, password) {
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const body = await res.json().catch(() => ({}));
          if (!res.ok) {
            let msg = body.error || 'Login falhou';
            if (res.status === 401) msg = 'Credenciais inválidas ou utilizador não registado';
            if (msg === 'Database unavailable') msg = 'Base de dados indisponível. Tente novamente em instantes.';
            set({ error: msg, loading: false });
            return false;
          }
          set({ email, loading: false, error: null });
          return true;
        } catch (e) {
          set({ error: 'Erro de rede. Verifique a ligação.', loading: false });
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
          const body = await res.json().catch(() => ({}));
          if (!res.ok) {
            let msg = body.error || 'Registo falhou';
            if (res.status === 409) msg = 'Utilizador já existe';
            if (msg === 'Database unavailable') msg = 'Base de dados indisponível. Tente novamente.';
            set({ error: msg, loading: false });
            return false;
          }
          set({ email, loading: false, error: null });
          return true;
        } catch (e) {
          set({ error: 'Erro de rede. Verifique a ligação.', loading: false });
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
