"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LibraryStatusCard from "@/components/LivroStatus";
import EvaluateBookCard from "@/components/AvaliacaoLivro";
import BookReviewsSection from "@/components/Avaliacoes";
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  FileText, 
  Globe, 
  Bookmark
} from "lucide-react";
import { toast } from "sonner";

interface BookData {
  title: string;
  authors: string;
  cover: string;
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

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;

  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("LENDO");
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  
  // Controle do Formulário de Avaliação
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState("Laura");

  // Lista de avaliações do livro
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      user: "Mariana.S",
      date: "12 de mai, 2024",
      rating: 5,
      text: "Um dos livros mais emocionantes que já li. A história é pesada, mas necessária.",
      useful: 112,
      hasLiked: false
    },
    {
      id: 2,
      user: "LucasR",
      date: "10 de mai, 2024",
      rating: 5,
      text: "Colleen Hoover escreve de um jeito que prende do início ao fim. Simplesmente incrível!",
      useful: 85,
      hasLiked: false
    }
  ]);

  // Carregar dados da Google Books API ou usar fallback para "É assim que acaba"
  useEffect(() => {
    async function fetchBookData() {
      try {
        setLoading(true);
        if (bookId === "e-assim-que-acaba" || bookId === "1") {
          throw new Error("Use fallback");
        }

        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        if (!res.ok) throw new Error("Book not found");
        
        const data = await res.json();
        const volumeInfo = data.volumeInfo;

        setBookData({
          title: volumeInfo.title || "Título Indisponível",
          authors: volumeInfo.authors?.join(", ") || "Autor Desconhecido",
          cover: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || "/imagens/éAssimQueAcaba.webp",
          pages: volumeInfo.pageCount || 0,
          publishedDate: volumeInfo.publishedDate ? volumeInfo.publishedDate.split("-")[0] : "N/A",
          language: volumeInfo.language === "pt" ? "Português" : volumeInfo.language === "en" ? "Inglês" : volumeInfo.language.toUpperCase() || "N/A",
          category: volumeInfo.categories?.[0] || "Romance",
          description: volumeInfo.description ? volumeInfo.description.replace(/<[^>]*>/g, '') : "Sem descrição disponível para este livro."
        });
      } catch (err) {
        // Fallback completo com os dados da imagem
        setBookData({
          title: "É assim que acaba",
          authors: "Colleen Hoover",
          cover: "/imagens/éAssimQueAcaba.webp",
          pages: 336,
          publishedDate: "2016",
          language: "Português",
          category: "Romance",
          description: "Lily não esperava que Ryle fosse tão teimoso e sarcástico. Muito menos que fosse tão bonito. A relação dos dois é marcada por altos e baixos, até que o amor se transforma em algo doloroso e assustador."
        });
      } finally {
        setLoading(false);
      }
    }

    if (bookId) {
      fetchBookData();
    }
  }, [bookId]);

  // Função para mudar o status de leitura na biblioteca
  function handleStatusChange(status: string, label: string) {
    setSelectedStatus(status);
    toast.success(`Livro adicionado a "${label}"`);
  }

  // Função para lidar com clique na avaliação útil
  function handleUsefulClick(reviewId: number) {
    setReviews(prevReviews =>
      prevReviews.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            useful: review.hasLiked ? review.useful - 1 : review.useful + 1,
            hasLiked: !review.hasLiked
          };
        }
        return review;
      })
    );
  }

  // Função para denunciar avaliação
  function handleReport() {
    toast.success("Denúncia registrada. Obrigado pelo feedback!");
  }

  // Enviar nova avaliação
  function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!newReviewText.trim()) {
      toast.error("Por favor, escreva o texto da avaliação.");
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      user: newReviewName.trim() || "Anônimo",
      date: "Hoje",
      rating: newReviewRating,
      text: newReviewText,
      useful: 0,
      hasLiked: false
    };

    setReviews([newReview, ...reviews]);
    setNewReviewText("");
    setShowReviewForm(false);
    toast.success("Avaliação publicada com sucesso!");
  }

  if (loading) {
    return (
      <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
        <Sidebar />
        <div className="flex-1 p-8 overflow-y-auto h-full flex flex-col justify-center items-center bg-[#15131D]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8c52ff]"></div>
          <p className="mt-4 font-lexend text-[#A5A1B8] text-sm">Carregando livro...</p>
        </div>
      </main>
    );
  }

  if (!bookData) return null;

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto h-full flex flex-col bg-[#15131D] no-scrollbar">
        <Header />

        {/* Voltar para Início */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-[#A5A1B8] hover:text-[#8c52ff] font-lexend font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Início
          </Link>
        </div>

        {/* Grid de Detalhes do Livro */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Coluna 1: Capa do Livro (col-span-3) */}
          <div className="xl:col-span-3 flex justify-center xl:justify-start">
            <div className="relative w-64 aspect-[2/3] xl:w-full max-w-[280px] rounded-3xl overflow-hidden border border-[#3b2d63] shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all hover:scale-[1.02] hover:border-[#8c52ff]">
              <Image
                src={bookData.cover}
                alt={bookData.title}
                fill
                priority
                sizes="(max-width: 1200px) 250px, 280px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Coluna 2: Informações do Livro (col-span-5) */}
          <div className="xl:col-span-5 flex flex-col">
            <h1 className="text-4xl font-bold font-lexend text-white leading-tight">
              {bookData.title}
            </h1>
            <h3 className="text-lg text-[#8c52ff] font-spartan font-medium mt-1">
              {bookData.authors}
            </h3>

            {/* Avaliação Geral */}
            <div className="flex items-center gap-2 mt-4 text-[#A5A1B8] font-lexend text-sm">
              <Star className="w-5 h-5 fill-[#8c52ff] text-[#8c52ff]" />
              <span className="text-white font-semibold">5.0</span>
              <span>•</span>
              <span>28.742 avaliações</span>
            </div>

            {/* Ficha Técnica (Icons List) */}
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
              <div className="flex items-center gap-3.5">
                <span className="w-5 h-5 border border-[#A5A1B8] text-[10px] flex items-center justify-center rounded font-bold shrink-0 font-lexend">18+</span>
                <span>Classificação indicativa</span>
              </div>
            </div>

            {/* Descrição / Sinopse */}
            <div className="mt-6 flex flex-col gap-2">
              <p className="text-sm text-[#A5A1B8] font-spartan leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-300">
                {bookData.description}
              </p>
              <button className="text-xs text-[#8c52ff] font-semibold font-lexend text-left hover:underline cursor-pointer w-fit mt-1">
                Ver mais
              </button>
            </div>
          </div>

          {/* Coluna 3: Ações e Status (col-span-4) */}
          <div className="xl:col-span-4 flex flex-col gap-6 w-full">
            
            {/* Card: Adicionar à sua biblioteca */}
            <LibraryStatusCard 
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />

            {/* Card: Avaliar este livro */}
            <EvaluateBookCard 
              userRating={userRating}
              setUserRating={setUserRating}
              hoverRating={hoverRating}
              setHoverRating={setHoverRating}
              showReviewForm={showReviewForm}
              setShowReviewForm={setShowReviewForm}
              newReviewName={newReviewName}
              setNewReviewName={setNewReviewName}
              newReviewRating={newReviewRating}
              setNewReviewRating={setNewReviewRating}
              newReviewText={newReviewText}
              setNewReviewText={setNewReviewText}
              onSubmitReview={handleAddReview}
              onStarRatingToast={(rating) => toast.success(`Você avaliou este livro com ${rating} estrelas!`)}
            />

          </div>

        </div>

        {/* Seção: Avaliações dos Leitores */}
        <BookReviewsSection 
          reviews={reviews}
        />

      </div>
    </main>
  );
}
