import { getAuthHeaders } from "./auth.service";

export interface Livro {
  id: string;
  titulo: string;
  autores?: string[];
  capa?: string;
  descricao?: string;
}

export interface LivroDetalhe {
  id: string;
  titulo: string;
  autores?: string;
  imagem?: string;
  paginas?: number;
  publicadoEm?: string;
  idioma?: string;
  categoria?: string;
  descricao?: string;
}

export interface LivroBiblioteca {
  id: number;
  googleBookId: string;
  titulo: string;
  autores?: string | null;
  imagem?: string | null;
  paginas?: number | null;
  paginaAtual: number;
  percentual: number;
  nota?: number | null;
  status: "WANT_TO_READ" | "READING" | "FINISHED" | "DROPPED";
}

export interface CreateLivroBibliotecaDTO {
  googleBookId: string;
  userId?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function getLivros(
  busca: string,
  cookieHeader?: string
): Promise<Livro[]> {
  const response = await fetch(
    `${API_URL}/books?q=${encodeURIComponent(busca)}`,
    {
      headers: {
        ...getAuthHeaders(),
        Cookie: cookieHeader ?? "",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar livros");
  }

  const dados = await response.json();

  return dados;
}

export async function getLivro(
  id: string,
  cookieHeader?: string
): Promise<LivroDetalhe> {
  const response = await fetch(`${API_URL}/books/${encodeURIComponent(id)}`, {
    headers: {
      ...getAuthHeaders(),
      Cookie: cookieHeader ?? "",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar livro");
  }

  return response.json();
}

export async function getBiblioteca(
  userId?: number,
  cookieHeader?: string
): Promise<LivroBiblioteca[]> {
  const url = userId ? `${API_URL}/library?userId=${userId}` : `${API_URL}/library`;

  const response = await fetch(url, {
    headers: {
      ...getAuthHeaders(),
      Cookie: cookieHeader ?? "",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar biblioteca");
  }

  const dados = await response.json();

  return dados;
}

export async function createLivroBiblioteca(
  livro: CreateLivroBibliotecaDTO
): Promise<LivroBiblioteca> {
  const response = await fetch(`${API_URL}/library`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      googleBookId: livro.googleBookId,
      userId: livro.userId,
    }),
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.erro ?? "Erro ao adicionar livro");
  }

  return response.json();
}

export async function deleteLivroBiblioteca(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/library/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erro ao remover livro");
  }
}

export const buscarLivros = getLivros;
export const buscarLivroPorId = getLivro;
export const listarBiblioteca = getBiblioteca;

export async function adicionarLivroNaBiblioteca(
  googleBookId: string,
  userId?: number
): Promise<LivroBiblioteca> {
  return createLivroBiblioteca({ googleBookId, userId });
}

export const removerLivroDaBiblioteca = deleteLivroBiblioteca;
