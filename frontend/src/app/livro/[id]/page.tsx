"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LibraryStatusCard from "@/components/LivroStatus";
import EvaluateBookCard from "@/components/AvaliacaoLivro";
import BookReviewsSection from "@/components/Avaliacoes";
import {
  adicionarLivroNaBiblioteca,
  buscarLivroPorId,
  listarBiblioteca,
  StatusLeitura,
} from "@/services/book";
import { listarAvaliacoes, ReviewApi, salvarAvaliacao } from "@/services/review";
import { ArrowLeft, Bookmark, Calendar, FileText, Globe } from "lucide-react";
import { toast } from "sonner";

interface BookData {
  title: string;
  authors: string;
  cover?: string;
  pages: number;
  publishedDate: string;
  language: string;
  category: string;
  description: string;
}

interface Review {
  id: number;
  user: string;
  date: string;
  rating: number;
  text: string;
  useful: number;
  hasLiked: boolean;
}

function formatarData(value: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

function mapReview(review: ReviewApi): Review {
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

function formatLanguage(language?: string) {
  if (!language) return "N/A";

  const languages: Record<string, string> = {
    pt: "Português",
    en: "Inglês",
    es: "Espanhol",
  };

  return languages[language] ?? language.toUpperCase();
}

function removeHtml(value?: string) {
  return value?.replace(/<[^>]*>/g, "") || "Sem descrição disponível para este livro.";
}

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookId } = use(params);

  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusLeitura>("WANT_TO_READ");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [mostrarDescricaoCompleta, setMostrarDescricaoCompleta] = useState(false);

  useEffect(() => {
    async function fetchBookData() {
      try {
        setLoading(true);
        setError("");

        const data = await buscarLivroPorId(bookId);

        setBookData({
          title: data.titulo || "Título indisponível",
          authors: data.autores || "Autor desconhecido",
          cover: data.imagem?.replace("http://", "https://"),
          pages: data.paginas || 0,
          publishedDate: data.publicadoEm?.split("-")[0] || "N/A",
          language: formatLanguage(data.idioma),
          category: data.categoria || "Categoria não informada",
          description: removeHtml(data.descricao),
        });

        const biblioteca = await listarBiblioteca();
        const livroSalvo = biblioteca.find((livro) => livro.googleBookId === bookId);

        if (livroSalvo) {
          setSelectedStatus(livroSalvo.status);

          if (livroSalvo.nota) {
            setUserRating(livroSalvo.nota);
            setNewReviewRating(livroSalvo.nota);
          }
        }

        const avaliacoes = await listarAvaliacoes(bookId);
        setReviews(avaliacoes.map(mapReview));
      } catch {
        setBookData(null);
        setError("Não foi possível carregar os dados deste livro.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookData();
  }, [bookId]);

  async function handleStatusChange(status: string, label: string) {
    const novoStatus = status as StatusLeitura;

    setSelectedStatus(novoStatus);

    try {
      await adicionarLivroNaBiblioteca(bookId, novoStatus);
      toast.success(`Livro salvo como "${label}"`);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "Erro ao adicionar livro.";
      toast.error(mensagem);
    }
  }

  async function handleRatingChange(rating: number) {
    setNewReviewRating(rating);

    try {
      await adicionarLivroNaBiblioteca(bookId, selectedStatus, rating);
      toast.success(`Voce avaliou este livro com ${rating} estrelas!`);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "Erro ao salvar avaliacao.";
      toast.error(mensagem);
    }
  }

  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();

    if (!newReviewText.trim()) {
      toast.error("Por favor, escreva o texto da avaliação.");
      return;
    }

    try {
      const reviewSalva = await salvarAvaliacao(bookId, newReviewRating, newReviewText);
      await adicionarLivroNaBiblioteca(bookId, selectedStatus, newReviewRating);

      setReviews((currentReviews) => {
        const outrasReviews = currentReviews.filter((review) => review.id !== reviewSalva.id);
        return [mapReview(reviewSalva), ...outrasReviews];
      });
      setNewReviewText("");
      setUserRating(newReviewRating);
      setShowReviewForm(false);
      toast.success("Avaliacao publicada com sucesso!");
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "Erro ao salvar avaliacao.";
      toast.error(mensagem);
    }
  }

  if (loading) {
    return (
      <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
        <Sidebar />
        <div className="flex-1 p-8 overflow-y-auto h-full flex flex-col justify-center items-center bg-[#15131D]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8c52ff]" />
          <p className="mt-4 font-lexend text-[#A5A1B8] text-sm">Carregando livro...</p>
        </div>
      </main>
    );
  }

  if (error || !bookData) {
    return (
      <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
        <Sidebar />
        <div className="flex-1 p-8 overflow-y-auto h-full flex flex-col bg-[#15131D]">
          <Header />
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#A5A1B8] hover:text-[#8c52ff] font-lexend font-medium transition-all w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Início
          </Link>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-bold font-lexend text-white">Livro não encontrado</h1>
            <p className="mt-2 text-sm text-[#A5A1B8] font-spartan">
              {error || "Não encontramos informações para este livro."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto h-full flex flex-col bg-[#15131D] no-scrollbar">
        <Header />

        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#A5A1B8] hover:text-[#8c52ff] font-lexend font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Início
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-3 flex justify-center xl:justify-start">
            <div className="relative w-64 aspect-[2/3] xl:w-full max-w-[280px] rounded-3xl overflow-hidden border border-[#3b2d63] shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all hover:scale-[1.02] hover:border-[#8c52ff]">
              {bookData.cover ? (
                <Image
                  src={bookData.cover}
                  alt={bookData.title}
                  fill
                  priority
                  sizes="(max-width: 1200px) 250px, 280px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[#A5A1B8] font-spartan bg-[#271E42]">
                  Sem capa
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-5 flex flex-col">
            <h1 className="text-4xl font-bold font-lexend text-white leading-tight">
              {bookData.title}
            </h1>
            <h3 className="text-lg text-[#8c52ff] font-spartan font-medium mt-1">
              {bookData.authors}
            </h3>

            <div className="flex flex-col gap-3.5 mt-8 border-y border-[#3b2d63]/40 py-6 text-sm text-[#A5A1B8] font-spartan">
              <div className="flex items-center gap-3.5">
                <Bookmark className="w-5 h-5 opacity-80" />
                <span>{bookData.category}</span>
              </div>
              <div className="flex items-center gap-3.5">
                <Calendar className="w-5 h-5 opacity-80" />
                <span>Publicado em {bookData.publishedDate}</span>
              </div>
              <div className="flex items-center gap-3.5">
                <FileText className="w-5 h-5 opacity-80" />
                <span>{bookData.pages} páginas</span>
              </div>
              <div className="flex items-center gap-3.5">
                <Globe className="w-5 h-5 opacity-80" />
                <span>Idioma: {bookData.language}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <p
                className={`text-sm text-[#A5A1B8] font-spartan leading-relaxed transition-all duration-300 ${
                  mostrarDescricaoCompleta ? "" : "line-clamp-4"
                }`}
              >
                {bookData.description}
              </p>
              <button
                type="button"
                onClick={() => setMostrarDescricaoCompleta((valorAtual) => !valorAtual)}
                className="text-xs text-[#8c52ff] font-semibold font-lexend text-left hover:underline cursor-pointer w-fit mt-1"
              >
                {mostrarDescricaoCompleta ? "Ver menos" : "Ver mais"}
              </button>
            </div>
          </div>

          <div className="xl:col-span-4 flex flex-col gap-6 w-full">
            <LibraryStatusCard
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />

            <EvaluateBookCard
              userRating={userRating}
              setUserRating={setUserRating}
              hoverRating={hoverRating}
              setHoverRating={setHoverRating}
              showReviewForm={showReviewForm}
              setShowReviewForm={setShowReviewForm}
              newReviewRating={newReviewRating}
              setNewReviewRating={setNewReviewRating}
              newReviewText={newReviewText}
              setNewReviewText={setNewReviewText}
              onSubmitReview={handleAddReview}
              onStarRatingToast={handleRatingChange}
            />
          </div>
        </div>

        <BookReviewsSection reviews={reviews} />
      </div>
    </main>
  );
}
