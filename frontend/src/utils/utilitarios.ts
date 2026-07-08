import { ReviewApi } from "@/services/review";

export interface Resenha {
  id: number;
  user: string;
  date: string;
  rating: number;
  text: string;
  useful: number;
  hasLiked: boolean;
}

export function formatarData(value: string): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

export function mapReview(review: ReviewApi): Resenha {
  return {
    id: review.id,
    user: review.user.nome,
    date: formatarData(review.updatedAt),
    rating: review.rating,
    text: review.text,
    useful: 0,
    hasLiked: false,
  };
}

export function formatLanguage(language?: string): string {
  if (!language) return "N/A";

  const languages: Record<string, string> = {
    pt: "Português",
    en: "Inglês",
    es: "Espanhol",
  };

  return languages[language] ?? language.toUpperCase();
}

export function removeHtml(value?: string): string {
  return value?.replace(/<[^>]*>/g, "") || "Sem descrição disponível para este livro.";
}
