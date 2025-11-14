import axios, { type InternalAxiosRequestConfig } from "axios";

/**
 * Resolve a baseURL de forma compatível com Vite, CRA e Next.
 * Ordem de precedência:
 * 1) Vite: import.meta.env.VITE_API_BASE_URL
 * 2) Next: process.env.NEXT_PUBLIC_API_BASE_URL
 * 3) CRA:  process.env.REACT_APP_API_BASE_URL
 * 4) Window global: (window as any).__API_BASE_URL__
 * 5) Fallback: http://localhost:3000
 */
function resolveBaseURL(): string {
  // 1) Vite
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env) {
      // @ts-ignore
      const viteUrl = import.meta.env.VITE_API_URL as string | undefined;
      if (viteUrl) return viteUrl;
    }
  } catch { }

  // 2/3) Next/CRA
  try {
    // @ts-ignore
    const env = typeof process !== "undefined" ? process.env : undefined;
    const nextUrl = env?.NEXT_PUBLIC_API_BASE_URL;
    const craUrl = env?.REACT_APP_API_BASE_URL;
    if (nextUrl) return nextUrl;
    if (craUrl) return craUrl;
  } catch { }

  // 4) Window global
  try {
    const winUrl =
      typeof window !== "undefined" ? (window as any).__API_BASE_URL__ : undefined;
    if (winUrl) return String(winUrl);
  } catch { }

  // 5) Fallback dev
  return "/api";
}

function readXsrfToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 30000,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

function resolveSanctumUrl(): string {
  let base = resolveBaseURL();
  try {
    base = base.replace(/\/+$/, "");
    base = base.replace(/\/api$/, "");
  } catch { /* noop */ }
  return base ? `${base}/sanctum/csrf-cookie` : "/sanctum/csrf-cookie";
}

let csrfPromise: Promise<void> | null = null;

export async function ensureCsrfCookie(force = false): Promise<void> {
  if (typeof document === "undefined") {
    return;
  }
  if (!force && document.cookie.includes("XSRF-TOKEN=")) {
    return;
  }
  if (!csrfPromise) {
    const url = resolveSanctumUrl();
    csrfPromise = axios.get(url, { withCredentials: true })
      .then(() => { csrfPromise = null; })
      .catch((error) => {
        csrfPromise = null;
        throw error;
      });
  }
  return csrfPromise;
}

function clearStoredToken() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  } catch { /* noop */ }
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  config.headers = config.headers ?? {};
  if (!(config.headers as any).Accept) {
    (config.headers as any).Accept = "application/json";
  }
  const xsrfHeaderName = api.defaults.xsrfHeaderName ?? "X-XSRF-TOKEN";
  if ((config.headers as any)[xsrfHeaderName] == null) {
    const xsrfValue = readXsrfToken();
    if (xsrfValue) {
      (config.headers as any)[xsrfHeaderName] = xsrfValue;
    }
  }
  // Força tratamento como requisição AJAX para respostas JSON de erro (evita redirect para login web)
  if (!(config.headers as any)["X-Requested-With"]) {
    (config.headers as any)["X-Requested-With"] = "XMLHttpRequest";
  }
  const method = (config.method || "get").toLowerCase();
  if ((method === "post" || method === "put" || method === "patch") && !(config.headers as any)["Content-Type"]) {
    (config.headers as any)["Content-Type"] = "application/json";
  }
  return config;
});

// Resposta: trata autenticação e autorização de forma centralizada
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const dataMsg: string | undefined = error?.response?.data?.message || error?.response?.data;
    const shouldRedirectToLogin = () => {
      if (typeof window === 'undefined') return false;
      const { pathname } = window.location;
      return pathname !== '/login' && pathname !== '/logout';
    };
    if (status === 401) {
      clearStoredToken();
      try { (window as any).__AUTH_EXPIRED = true; } catch { }
      if (shouldRedirectToLogin()) {
        window.location.href = '/login';
      }
    }
    // Sessão expirada CSRF/Sanctum
    if (status === 419) {
      clearStoredToken();
      try { (window as any).__AUTH_EXPIRED = true; } catch { }
      if (shouldRedirectToLogin()) {
        window.location.href = '/login';
      }
    }
    // Alguns ambientes podem responder 500 quando route(login) não existe — tratar como sessão expirada
    if (status === 500 && typeof dataMsg === 'string' && dataMsg.toLowerCase().includes('route [login] not defined')) {
      try { (window as any).__AUTH_EXPIRED = true; } catch { }
      if (shouldRedirectToLogin()) {
        window.location.href = '/login';
      }
    }
    if (status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/forbidden';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
