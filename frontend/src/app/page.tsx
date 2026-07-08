"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SearchBookCard from "@/components/SearchBookCard";
import SecaoLivros from "@/components/SecaoLivros";
import { toast } from "sonner";
import { Bookmark, BookOpen, XCircle, CheckCircle } from "lucide-react";
import {
  buscarLivros,
  listarBiblioteca,
  removerLivroDaBiblioteca,
  Livro,
  LivroBiblioteca
} from "@/services/book";

export default function Biblioteca() {
  const [activeTab, setActiveTab] = useState<string>("livros");
  const [busca, setBusca] = useState<string>("");
  const [resultados, setResultados] = useState<Livro[]>([]);
  const [erro, setErro] = useState("");
  const [biblioteca, setBiblioteca] = useState<LivroBiblioteca[]>([]);

  // Carregar biblioteca do banco de dados ao iniciar
  useEffect(() => {
    async function loadLibrary() {
      try {
        const books = await listarBiblioteca();
        setBiblioteca(books);
      } catch (err) {
        console.error("Erro ao carregar biblioteca:", err);
      }
    }
    loadLibrary();
  }, []);

  async function pesquisarLivros() {
    const termo = busca.trim();

    if (!termo) {
      setResultados([]);
      setErro("");
      return;
    }

    try {
      setErro("");
      const livros = await buscarLivros(termo);
      setResultados(livros);
    } catch {
      setErro("Não foi possível buscar livros agora.");
      setResultados([]);
    }
  }

  const handleRemoveBook = async (id: number) => {
    try {
      await removerLivroDaBiblioteca(id);
      setBiblioteca((prev) => prev.filter((book) => book.id !== id));
      toast.success("Livro removido da biblioteca.");
    } catch (err: unknown) {
      const mensagem = err instanceof Error ? err.message : "Erro ao remover livro.";
      toast.error(mensagem);
    }
  };

  const tabs = [
    { id: "livros", label: "Livros", icon: "/imagens/iconBiblio.png" },
    { id: "quero-ler", label: "Quero ler", icon: "/imagens/iconQueroLer.png" },
    { id: "lendo", label: "Lendo", icon: "/imagens/iconBiblio.png" },
    { id: "lidos", label: "Lidos", icon: "/imagens/iconLidos.png" },
    { id: "abandonados", label: "Abandonados", icon: "/imagens/iconAbandonados.png" }
  ];

  const getTabIcon = (tabId: string, isActive: boolean) => {
    const className = `w-4 h-4 ${isActive ? "text-[#8c52ff]" : "text-[#A5A1B8] opacity-70"}`;
    switch (tabId) {
      case "quero-ler":
        return <Bookmark className={className} />;
      case "lidos":
        return <CheckCircle className={className} />;
      case "abandonados":
        return <XCircle className={className} />;
      case "lendo":
        return <BookOpen className={className} />;
      case "livros":
      default:
        return (
          <Image
            src="/imagens/iconBiblio.png"
            alt="Livros"
            width={16}
            height={16}
            className={`w-4 h-4 object-contain ${isActive ? "filter brightness-110" : "opacity-70"}`}
          />
        );
    }
  };

  // Filtrar os livros locais da biblioteca por status
  const queroLerList = biblioteca.filter((book) => book.status === "WANT_TO_READ");
  const lendoList = biblioteca.filter((book) => book.status === "READING");
  const lidosList = biblioteca.filter((book) => book.status === "FINISHED");
  const abandonadosList = biblioteca.filter((book) => book.status === "DROPPED");

  // Estado vazio
  const padraoEmptyState = (
    <div className="flex flex-col items-center justify-center py-10 bg-[#181424] border border-[#3b2d63] rounded-2xl text-center">
      <p className="text-sm text-[#A5A1B8] font-spartan">Nenhum livro nesta seção.</p>
    </div>
  );

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto h-full flex flex-col bg-[#15131D]">
        <Header busca={busca} setBusca={setBusca} pesquisarLivros={pesquisarLivros} />

        <section className="mb-6 shrink-0">
          <h1 className="text-3xl font-bold font-lexend text-[#F5F3FF]">Biblioteca</h1>
          <p className="text-sm text-[#A5A1B8] font-spartan mt-1">Organize e acompanhe suas leituras.</p>
        </section>

        {(erro || resultados.length > 0) && (
          <section className="mb-8 bg-[#181424]/30 border border-[#3b2d63]/50 rounded-3xl p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold font-lexend text-white uppercase tracking-wider">
                Resultado da busca
              </h2>
              {resultados.length > 0 && (
                <span className="text-xs text-[#A5A1B8] font-spartan">
                  {resultados.length} livros encontrados
                </span>
              )}
            </div>

            {erro && <p className="text-sm text-red-400 font-spartan py-2">{erro}</p>}

            {!erro && (
              <div className="grid grid-cols-4 gap-5">
                {resultados.map((book) => (
                  <SearchBookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </section>
        )}

        <div className="flex justify-between items-center border-b border-[#3b2d63]/40 pb-4 mb-8 shrink-0">
          <div className="flex gap-1.5 bg-[#181424] border border-[#3b2d63] rounded-2xl p-1.5 w-fit">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-spartan font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#271E42] text-white shadow-sm border border-[#3b2d63]"
                      : "text-[#A5A1B8] hover:text-white hover:bg-[#1c172d]/50"
                  }`}
                >
                  <span className={isActive ? "text-[#8c52ff]" : ""}>
                    {getTabIcon(tab.id, isActive)}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {/* Quero ler */}
          {(activeTab === "livros" || activeTab === "quero-ler") && (
            <SecaoLivros
              titulo="Quero ler"
              icone={<Bookmark className="w-5 h-5 text-[#8c52ff]" />}
              livros={queroLerList}
              onRemove={handleRemoveBook}
              emptyState={padraoEmptyState}
            />
          )}

          {/* Lendo */}
          {(activeTab === "livros" || activeTab === "lendo") && (
            <SecaoLivros
              titulo="Lendo"
              icone={<BookOpen className="w-5 h-5 text-[#8c52ff]" />}
              livros={lendoList}
              onRemove={handleRemoveBook}
              emptyState={padraoEmptyState}
            />
          )}

          {/* Lidos */}
          {(activeTab === "livros" || activeTab === "lidos") && (
            <SecaoLivros
              titulo="Lidos"
              icone={<CheckCircle className="w-5 h-5 text-[#8c52ff]" />}
              livros={lidosList}
              onRemove={handleRemoveBook}
              emptyState={padraoEmptyState}
            />
          )}

          {/* Abandonados */}
          {activeTab === "abandonados" && (
            <SecaoLivros
              titulo="Abandonados"
              icone={<XCircle className="w-5 h-5 text-[#8c52ff]" />}
              livros={abandonadosList}
              onRemove={handleRemoveBook}
              emptyState={
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#181424] border border-[#3b2d63] rounded-2xl text-center">
                  <XCircle className="w-12 h-12 text-[#3b2d63] opacity-40 mb-4" />
                  <h3 className="text-base font-lexend font-semibold text-white">Nenhum livro abandonado</h3>
                  <p className="text-xs text-[#A5A1B8] font-spartan mt-1 max-w-xs">
                    Muito bem! Você não abandonou nenhuma de suas leituras recentemente.
                  </p>
                </div>
              }
            />
          )}
        </div>
      </div>
    </main>
  );
}
