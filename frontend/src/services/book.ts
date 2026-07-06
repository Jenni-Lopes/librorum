
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

function getApiUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : "http://localhost:3001";
}

const API_URL = getApiUrl();

export async function buscarLivros(q: string): Promise<Livro[]> {
  const response = await fetch(
    `${API_URL}/books?q=${encodeURIComponent(q)}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar livros");
  }

  return response.json();
}

export async function buscarLivroPorId(id: string): Promise<LivroDetalhe> {
  const response = await fetch(`${API_URL}/books/${encodeURIComponent(id)}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar livro");
  }

  return response.json();
}

export async function listarBiblioteca(userId = 1): Promise<LivroBiblioteca[]> {
  const response = await fetch(`${API_URL}/library?userId=${userId}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar biblioteca");
  }

  return response.json();
}

export async function adicionarLivroNaBiblioteca(
  googleBookId: string,
  userId = 1
): Promise<LivroBiblioteca> {
  const response = await fetch(`${API_URL}/library`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ googleBookId, userId }),
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.erro ?? "Erro ao adicionar livro");
  }

  return response.json();
}
