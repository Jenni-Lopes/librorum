"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { toast } from "sonner";
import {
  Trash2,
  Bookmark,
  XCircle,
  CheckCircle,
  Star
} from "lucide-react";
import {
  buscarLivros,
  adicionarLivroNaBiblioteca,
  listarBiblioteca,
  removerLivroDaBiblioteca,
  Livro,
  LivroBiblioteca
} from "@/services/book";

export default function Biblioteca() {
  const [activeTab, setActiveTab] = useState<string>("livros");
  const [busca, setBusca] = useState<string>("");
  const [resultados, setResultados] = useState<Livro[]>([]);
  const [carregando, setCarregando] = useState(false);
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
      setCarregando(true);
      setErro("");
      const livros = await buscarLivros(termo);
      setResultados(livros);
    } catch {
      setErro("Não foi possível buscar livros agora.");
      setResultados([]);
    } finally {
      setCarregando(false);
    }
  }

  const handleAddBookToLibrary = async (book: Livro, status: "WANT_TO_READ" | "READING" | "FINISHED" | "DROPPED" = "WANT_TO_READ") => {
    try {
      // Copiar para o banco de dados via API
      const result = await adicionarLivroNaBiblioteca(book.id);
      
      // adicionar na biblioteca local com o status correto 
      const newBook: LivroBiblioteca = {
        id: result.id,
        googleBookId: book.id,
        titulo: book.titulo,
        autores: book.autores?.join(", ") ?? "Autor desconhecido",
        imagem: book.capa ?? null,
        paginas: null,
        paginaAtual: 0,
        percentual: 0,
        nota: null,
        status: status // usamos o status que o usuário selecionou
      };

      setBiblioteca((prev) => {
        if (prev.some((b) => b.googleBookId === book.id)) {
          return prev;
        }
        return [newBook, ...prev];
      });

      toast.success(`"${book.titulo}" adicionado à biblioteca!`);
    } catch (err: any) {
      const mensagem = err instanceof Error ? err.message : "Erro ao adicionar livro.";
      toast.error(mensagem);
    }
  };

  const handleRemoveBook = async (id: number) => {
    try {
      await removerLivroDaBiblioteca(id);
      setBiblioteca((prev) => prev.filter((book) => book.id !== id));
      toast.success("Livro removido da biblioteca.");
    } catch (err: any) {
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
      case "livros":
      case "lendo":
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

  
  const queroLerList = biblioteca.filter((book) => book.status === "WANT_TO_READ");
  const lendoList = biblioteca.filter((book) => book.status === "READING");
  const lidosList = biblioteca.filter((book) => book.status === "FINISHED");
  const abandonadosList = biblioteca.filter((book) => book.status === "DROPPED");

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto h-full flex flex-col bg-[#15131D] no-scrollbar">
        <Header busca={busca} setBusca={setBusca} pesquisarLivros={pesquisarLivros} />

        <section className="mb-6 shrink-0">
          <h1 className="text-3xl font-bold font-lexend text-[#F5F3FF]">Biblioteca</h1>
          <p className="text-sm text-[#A5A1B8] font-spartan mt-1">Organize e acompanhe suas leituras.</p>
        </section>

        {/* ── Seção de Resultados da Busca ── */}
        {(carregando || erro || resultados.length > 0) && (
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

            {carregando && (
              <div className="flex items-center gap-3 py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#8c52ff]" />
                <p className="text-sm text-[#A5A1B8] font-spartan">Buscando livros...</p>
              </div>
            )}

            {erro && (
              <p className="text-sm text-red-400 font-spartan py-2">{erro}</p>
            )}

            {!carregando && !erro && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {resultados.map((book) => (
                  <div
                    key={book.id}
                    className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all flex flex-col justify-between group relative"
                  >
                    <div>
                      {/* Capa do Livro */}
                      <div className="relative aspect-2/3 w-full max-w-40 mx-auto rounded-xl overflow-hidden border border-[#3b2d63]/50 shadow-md">
                        {book.capa ? (
                          <Image
                            src={book.capa.replace("http://", "https://")}
                            alt={book.titulo}
                            fill
                            sizes="(max-width: 768px) 100vw, 150px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[#271E42] text-[#A5A1B8] text-xs font-spartan text-center px-2">
                            Sem capa
                          </div>
                        )}
                      </div>

                      {/* Informações */}
                      <h3 className="text-sm font-lexend font-semibold text-white mt-3 line-clamp-1 group-hover:text-[#8c52ff] transition-colors">
                        {book.titulo}
                      </h3>
                      <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5 line-clamp-1">
                        {book.autores?.join(", ") ?? "Autor desconhecido"}
                      </p>
                    </div>

                    {/* Botões de Adicionar com Status */}
                    <div className="mt-4 flex flex-col gap-1.5 pt-3 border-t border-[#3b2d63]/30">
                      <p className="text-[9px] text-[#A5A1B8] font-spartan font-semibold uppercase tracking-wider text-center">Adicionar à Biblioteca:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          onClick={() => handleAddBookToLibrary(book, "WANT_TO_READ")}
                          className="py-1 px-1 bg-[#271E42] hover:bg-[#8c52ff] text-white rounded-lg text-[9px] font-spartan font-semibold transition-all cursor-pointer text-center"
                        >
                          Quero ler
                        </button>
                        <button
                          onClick={() => handleAddBookToLibrary(book, "READING")}
                          className="py-1 px-1 bg-[#271E42] hover:bg-[#8c52ff] text-white rounded-lg text-[9px] font-spartan font-semibold transition-all cursor-pointer text-center"
                        >
                          Lendo
                        </button>
                        <button
                          onClick={() => handleAddBookToLibrary(book, "FINISHED")}
                          className="py-1 px-1 bg-[#271E42] hover:bg-[#8c52ff] text-white rounded-lg text-[9px] font-spartan font-semibold transition-all cursor-pointer text-center"
                        >
                          Lido
                        </button>
                        <button
                          onClick={() => handleAddBookToLibrary(book, "DROPPED")}
                          className="py-1 px-1 bg-[#271E42] hover:bg-[#8c52ff] text-white rounded-lg text-[9px] font-spartan font-semibold transition-all cursor-pointer text-center"
                        >
                          Abandonado
                        </button>
                      </div>
                    </div>
                  </div>
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
          
          {/* Quero Ler */}
          {(activeTab === "livros" || activeTab === "quero-ler") && (
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center gap-2.5 text-base font-bold font-lexend text-white uppercase tracking-wider">
                  <Bookmark className="w-5 h-5 text-[#8c52ff]" />
                  Quero ler <span className="text-xs text-[#A5A1B8] font-normal lowercase font-spartan ml-1.5">{queroLerList.length} {queroLerList.length === 1 ? "livro" : "livros"}</span>
                </h2>
                <a href="#" className="text-xs font-semibold text-[#8c52ff] hover:underline font-spartan">Ver todos</a>
              </div>

              {queroLerList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-[#181424] border border-[#3b2d63] rounded-2xl text-center">
                  <p className="text-sm text-[#A5A1B8] font-spartan">Nenhum livro nesta seção.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {queroLerList.map((book) => (
                    <div key={book.id} className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg flex flex-col justify-between group">
                      <div>
                        {/* Capa do Livro */}
                        <div className="relative aspect-2/3 w-full max-w-40 mx-auto rounded-xl overflow-hidden border border-[#3b2d63]/50 shadow-md">
                          {book.imagem ? (
                            <Image
                              src={book.imagem}
                              alt={book.titulo}
                              fill
                              sizes="(max-width: 768px) 100vw, 150px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-[#271E42] text-[#A5A1B8] text-xs font-spartan text-center px-2">
                              Sem capa
                            </div>
                          )}
                        </div>
                        
                        {/* Informações */}
                        <h3 className="text-sm font-lexend font-semibold text-white mt-3.5 line-clamp-1">
                          {book.titulo}
                        </h3>
                        <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5 line-clamp-1">
                          {book.autores}
                        </p>
                        
                        {/* Avaliação */}
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                          <span className="text-xs text-[#A5A1B8] font-lexend font-medium">{book.nota ? book.nota.toFixed(1) : "0.0"}</span>
                        </div>
                      </div>

                      {/* Botão Remover */}
                      <button 
                        onClick={() => handleRemoveBook(book.id)}
                        className="flex items-center justify-center gap-2 mt-4 py-2 px-3 border border-[#3b2d63] hover:border-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl text-xs font-spartan font-medium text-[#A5A1B8] hover:text-[#ef4444] transition-all w-full cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/*  Lendo */}
          {(activeTab === "livros" || activeTab === "lendo") && (
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center gap-2.5 text-base font-bold font-lexend text-white uppercase tracking-wider">
                  <Image
                    src="/imagens/iconBiblio.png"
                    alt="Lendo"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                  Lendo <span className="text-xs text-[#A5A1B8] font-normal lowercase font-spartan ml-1.5">{lendoList.length} {lendoList.length === 1 ? "livro" : "livros"}</span>
                </h2>
                <a href="#" className="text-xs font-semibold text-[#8c52ff] hover:underline font-spartan">Ver todos</a>
              </div>

              {lendoList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-[#181424] border border-[#3b2d63] rounded-2xl text-center">
                  <p className="text-sm text-[#A5A1B8] font-spartan">Nenhum livro nesta seção.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {lendoList.map((book) => (
                    <div key={book.id} className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg flex flex-col justify-between group">
                      <div>
                        {/* Capa do Livro */}
                        <div className="relative aspect-2/3 w-full max-w-40 mx-auto rounded-xl overflow-hidden border border-[#3b2d63]/50 shadow-md">
                          {book.imagem ? (
                            <Image
                              src={book.imagem}
                              alt={book.titulo}
                              fill
                              sizes="(max-width: 768px) 100vw, 150px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-[#271E42] text-[#A5A1B8] text-xs font-spartan text-center px-2">
                              Sem capa
                            </div>
                          )}
                        </div>
                        
                        {/* Informações */}
                        <h3 className="text-sm font-lexend font-semibold text-white mt-3.5 line-clamp-1">
                          {book.titulo}
                        </h3>
                        <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5 line-clamp-1">
                          {book.autores}
                        </p>
                        
                        {/* Avaliação */}
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                          <span className="text-xs text-[#A5A1B8] font-lexend font-medium">{book.nota ? book.nota.toFixed(1) : "0.0"}</span>
                        </div>

                        {/* Progresso de leitura */}
                        <div className="mt-3.5">
                          <div className="flex justify-between items-center text-[10px] font-spartan font-semibold text-[#A5A1B8] mb-1">
                            <span>{book.percentual}%</span>
                            <span className="opacity-80">{book.percentual}% concluído</span>
                          </div>
                          <div className="w-full bg-[#271E42] rounded-full h-1.5 overflow-hidden">
                            <div className="bg-linear-to-r from-[#00E5FF] to-[#8c52ff] h-full rounded-full" style={{ width: `${book.percentual}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Botão Remover */}
                      <button 
                        onClick={() => handleRemoveBook(book.id)}
                        className="flex items-center justify-center gap-2 mt-4 py-2 px-3 border border-[#3b2d63] hover:border-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl text-xs font-spartan font-medium text-[#A5A1B8] hover:text-[#ef4444] transition-all w-full cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/*  Lidos */}
          {(activeTab === "livros" || activeTab === "lidos") && (
            <section className="mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center gap-2.5 text-base font-bold font-lexend text-white uppercase tracking-wider">
                  <CheckCircle className="w-5 h-5 text-[#8c52ff]" />
                  Lidos <span className="text-xs text-[#A5A1B8] font-normal lowercase font-spartan ml-1.5">{lidosList.length} {lidosList.length === 1 ? "livro" : "livros"}</span>
                </h2>
                <a href="#" className="text-xs font-semibold text-[#8c52ff] hover:underline font-spartan">Ver todos</a>
              </div>

              {lidosList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-[#181424] border border-[#3b2d63] rounded-2xl text-center">
                  <p className="text-sm text-[#A5A1B8] font-spartan">Nenhum livro nesta seção.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {lidosList.map((book) => (
                    <div key={book.id} className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg flex flex-col justify-between group">
                      <div>
                        {/* Capa do Livro */}
                        <div className="relative aspect-2/3 w-full max-w-40 mx-auto rounded-xl overflow-hidden border border-[#3b2d63]/50 shadow-md">
                          {book.imagem ? (
                            <Image
                              src={book.imagem}
                              alt={book.titulo}
                              fill
                              sizes="(max-width: 768px) 100vw, 150px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-[#271E42] text-[#A5A1B8] text-xs font-spartan text-center px-2">
                              Sem capa
                            </div>
                          )}
                        </div>
                        
                        {/* Informações */}
                        <h3 className="text-sm font-lexend font-semibold text-white mt-3.5 line-clamp-1">
                          {book.titulo}
                        </h3>
                        <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5 line-clamp-1">
                          {book.autores}
                        </p>
                        
                        {/* Avaliação */}
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                          <span className="text-xs text-[#A5A1B8] font-lexend font-medium">{book.nota ? book.nota.toFixed(1) : "0.0"}</span>
                        </div>
                      </div>

                      {/* Botão Remover */}
                      <button 
                        onClick={() => handleRemoveBook(book.id)}
                        className="flex items-center justify-center gap-2 mt-4 py-2 px-3 border border-[#3b2d63] hover:border-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl text-xs font-spartan font-medium text-[#A5A1B8] hover:text-[#ef4444] transition-all w-full cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Abandonados */}
          {(activeTab === "abandonados") && (
            <section className="mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center gap-2.5 text-base font-bold font-lexend text-white uppercase tracking-wider">
                  <XCircle className="w-5 h-5 text-[#8c52ff]" />
                  Abandonados <span className="text-xs text-[#A5A1B8] font-normal lowercase font-spartan ml-1.5">{abandonadosList.length} {abandonadosList.length === 1 ? "livro" : "livros"}</span>
                </h2>
              </div>

              {abandonadosList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#181424] border border-[#3b2d63] rounded-2xl text-center">
                  <XCircle className="w-12 h-12 text-[#3b2d63] opacity-40 mb-4" />
                  <h3 className="text-base font-lexend font-semibold text-white">Nenhum livro abandonado</h3>
                  <p className="text-xs text-[#A5A1B8] font-spartan mt-1 max-w-xs">Muito bem! Você não abandonou nenhuma de suas leituras recentemente.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {abandonadosList.map((book) => (
                    <div key={book.id} className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg flex flex-col justify-between group">
                      <div>
                        {/* Capa do Livro */}
                        <div className="relative aspect-2/3 w-full max-w-40 mx-auto rounded-xl overflow-hidden border border-[#3b2d63]/50 shadow-md">
                          {book.imagem ? (
                            <Image
                              src={book.imagem}
                              alt={book.titulo}
                              fill
                              sizes="(max-width: 768px) 100vw, 150px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-[#271E42] text-[#A5A1B8] text-xs font-spartan text-center px-2">
                              Sem capa
                            </div>
                          )}
                        </div>
                        
                        {/* Informações */}
                        <h3 className="text-sm font-lexend font-semibold text-white mt-3.5 line-clamp-1">{book.titulo}</h3>
                        <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5 line-clamp-1">{book.autores}</p>
                      </div>

                      {/* Botão Remover */}
                      <button 
                        onClick={() => handleRemoveBook(book.id)}
                        className="flex items-center justify-center gap-2 mt-4 py-2 px-3 border border-[#3b2d63] hover:border-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl text-xs font-spartan font-medium text-[#A5A1B8] hover:text-[#ef4444] transition-all w-full cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>
      </div>
    </main>
  );
}
