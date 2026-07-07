import { getAuthHeaders } from "./auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface ReviewApi {
  id: number;
  googleBookId: string;
  userId: number;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  user: {
    nome: string;
  };
}

export async function listarMinhasAvaliacoes(): Promise<ReviewApi[]> {
  const response = await fetch(`${API_URL}/reviews/me`, {
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar suas avaliacoes");
  }

  return response.json();
}

export async function listarAvaliacoes(googleBookId: string): Promise<ReviewApi[]> {
  const response = await fetch(`${API_URL}/reviews/${encodeURIComponent(googleBookId)}`, {
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar avaliacoes");
  }

  return response.json();
}

export async function salvarAvaliacao(
  googleBookId: string,
  rating: number,
  text: string
): Promise<ReviewApi> {
  const response = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      googleBookId,
      rating,
      text,
    }),
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.erro ?? "Erro ao salvar avaliacao");
  }

  return response.json();
}

export async function deletarAvaliacao(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.erro ?? "Erro ao remover avaliacao");
  }
}
