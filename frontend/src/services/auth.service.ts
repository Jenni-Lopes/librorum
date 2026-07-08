import { CadastroDTO, LoginDTO, LoginResponse } from "@/types/auth";

const LEGACY_TOKEN_KEY = "librorum:token";
const USER_KEY = "librorum:user";

function getApiUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : "http://localhost:3001";
}

async function getErrorMessage(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  return data?.erro ?? fallback;
}

const API_URL = getApiUrl();

export async function login(dados: LoginDTO): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Usuário ou senha inválidos"));
  }

  const data: LoginResponse = await response.json();

  if (typeof window !== "undefined") {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    document.cookie = `${LEGACY_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }

  return data;
}

export async function cadastro(dados: CadastroDTO): Promise<void> {
  const response = await fetch(`${API_URL}/auth/cadastro`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Erro ao criar usuário"));
  }
}

export async function sair(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = `${LEGACY_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }

  const response = await fetch(`${API_URL}/auth/sair`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Erro ao sair"));
  }
}

export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(USER_KEY));
}
