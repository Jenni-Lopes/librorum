import { getAuthHeaders } from "./auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface MetaLeitura {
  year: number;
  target: number | null;
}

export async function buscarMetaAtual(): Promise<MetaLeitura> {
  const response = await fetch(`${API_URL}/goals/current`, {
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar meta");
  }

  return response.json();
}

export async function salvarMetaAtual(target: number): Promise<MetaLeitura> {
  const response = await fetch(`${API_URL}/goals/current`, {
    method: "PUT",
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ target }),
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.erro ?? "Erro ao salvar meta");
  }

  return response.json();
}
