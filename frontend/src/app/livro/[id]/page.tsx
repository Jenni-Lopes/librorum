"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LivroStatus from "@/components/LivroStatus";
import AvaliacaoLivro from "@/components/AvaliacaoLivro";
import Avaliacoes from "@/components/Avaliacoes";
import InfoLivro, { DadosLivro } from "@/components/InfoLivro";
import {
  adicionarLivroNaBiblioteca,
  buscarLivroPorId,
  listarBiblioteca,
  StatusLeitura,
} from "@/services/book";
import { listarAvaliacoes, salvarAvaliacao } from "@/services/review";
import { mapReview, formatLanguage, removeHtml, Resenha } from "@/utils/utilitarios";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookId } = use(params);

  const [bookData, setBookData] = useState<DadosLivro | null>(null);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusLeitura>("WANT_TO_READ");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviews, setReviews] = useState<Resenha[]>([]);

  useEffect(() => {
    async function fetchBookData() {
      try {
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

  if (error) {
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
            <h1 className="text-2xl font-bold font-lexend text-white">Erro ao carregar livro</h1>
            <p className="mt-2 text-sm text-[#A5A1B8] font-spartan">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!bookData) {
    return null;
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto h-full flex flex-col bg-[#15131D]">
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

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Exibe capa, título, metadados e descrição do livro */}
          <InfoLivro bookData={bookData} />

          <div className="col-span-4 flex flex-col gap-6 w-full">
            <LivroStatus
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />

            <AvaliacaoLivro
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

        {/* Seção de avaliações */}
        <Avaliacoes reviews={reviews} />
      </div>
    </main>
  );
}
