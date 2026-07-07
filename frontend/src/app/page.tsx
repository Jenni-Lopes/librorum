"use client";

import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  Trash2,
  Bookmark,
  XCircle,
  CheckCircle,
  Star
} from "lucide-react";

export default function Biblioteca() {
  const [activeTab, setActiveTab] = useState<string>("livros");
  const [busca, setBusca] = useState<string>("");

  const [queroLerList, setQueroLerList] = useState([
    { id: "ql-1", title: "É assim que acaba", author: "Colleen Hoover", rating: "5.0" },
    { id: "ql-2", title: "O Nome do Vento", author: "Patrick Rothfuss", rating: "4.8" },
    { id: "ql-3", title: "A Rainha Vermelha", author: "Victoria Aveyard", rating: "4.6" },
    { id: "ql-4", title: "A Garota do Lago", author: "Charlie Donlea", rating: "4.2" },
    { id: "ql-5", title: "Verity", author: "Colleen Hoover", rating: "4.7" },
    { id: "ql-6", title: "Quarta Asa", author: "Rebecca Yarros", rating: "4.9" },
  ]);

  const [lendoList, setLendoList] = useState([
    { id: "le-1", title: "Crescent City", author: "Sarah J. Maas", rating: "4.6", progress: 42 },
    { id: "le-2", title: "É assim que começa", author: "Colleen Hoover", rating: "5.0", progress: 45 },
    { id: "le-3", title: "O Assassino do Rei", author: "Robin Hobb", rating: "4.8", progress: 15 },
  ]);

  const [lidosList, setLidosList] = useState([
    { id: "li-1", title: "O Hobbit", author: "J.R.R. Tolkien", rating: "4.9" },
    { id: "li-2", title: "1984", author: "George Orwell", rating: "4.8" },
    { id: "li-3", title: "Hábitos Atômicos", author: "James Clear", rating: "4.7" },
    { id: "li-4", title: "A Cinco Passos de Você", author: "Rachael Lippincott", rating: "4.5" },
    { id: "li-5", title: "O Sol Também é Uma Estrela", author: "Nicola Yoon", rating: "4.6" },
    { id: "li-6", title: "O Morro dos Ventos Uivantes", author: "Emily Brontë", rating: "4.4" },
    { id: "li-7", title: "Dom Quixote", author: "Miguel de Cervantes", rating: "4.3" },
  ]);

  const [abandonadosList, setAbandonadosList] = useState<any[]>([]);

  const handleRemoveBook = (listType: "quero-ler" | "lendo" | "lidos" | "abandonados", id: string) => {
    if (listType === "quero-ler") {
      setQueroLerList(queroLerList.filter((book) => book.id !== id));
    } else if (listType === "lendo") {
      setLendoList(lendoList.filter((book) => book.id !== id));
    } else if (listType === "lidos") {
      setLidosList(lidosList.filter((book) => book.id !== id));
    } else if (listType === "abandonados") {
      setAbandonadosList(abandonadosList.filter((book) => book.id !== id));
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

  const searchFilter = (list: any[]) => {
    if (!busca) return list;
    return list.filter(
      (book) =>
        book.title.toLowerCase().includes(busca.toLowerCase()) ||
        book.author.toLowerCase().includes(busca.toLowerCase())
    );
  };

  const filteredQueroLer = searchFilter(queroLerList);
  const filteredLendo = searchFilter(lendoList);
  const filteredLidos = searchFilter(lidosList);
  const filteredAbandonados = searchFilter(abandonadosList);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto h-full flex flex-col bg-[#15131D] no-scrollbar">
        <Header busca={busca} setBusca={setBusca} />

        <section className="mb-6 shrink-0">
          <h1 className="text-3xl font-bold font-lexend text-[#F5F3FF]">Biblioteca</h1>
          <p className="text-sm text-[#A5A1B8] font-spartan mt-1">Organize e acompanhe suas leituras.</p>
        </section>

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

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-[#181424] border border-[#3b2d63] rounded-xl px-4 py-2.5 text-xs font-spartan font-semibold text-[#A5A1B8] hover:text-white hover:border-[#8c52ff] transition-all cursor-pointer">
              Ordenar por
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="flex items-center gap-1.5 bg-[#181424] border border-[#3b2d63] rounded-xl p-1">
              <button className="p-1.5 rounded-lg bg-[#271E42] text-[#8c52ff] border border-[#3b2d63]/50 cursor-pointer" title="Visualização em grade">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          
          {/*  Quero Ler */}
          {(activeTab === "livros" || activeTab === "quero-ler") && (
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center gap-2.5 text-base font-bold font-lexend text-white uppercase tracking-wider">
                  <Bookmark className="w-5 h-5 text-[#8c52ff]" />
                  Quero ler <span className="text-xs text-[#A5A1B8] font-normal lowercase font-spartan ml-1.5">{filteredQueroLer.length} {filteredQueroLer.length === 1 ? "livro" : "livros"}</span>
                </h2>
                <a href="#" className="text-xs font-semibold text-[#8c52ff] hover:underline font-spartan">Ver todos</a>
              </div>

              {filteredQueroLer.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-[#181424] border border-[#3b2d63] rounded-2xl text-center">
                  <p className="text-sm text-[#A5A1B8] font-spartan">{busca ? "Nenhum livro encontrado nesta busca." : "Nenhum livro nesta seção."}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {filteredQueroLer.map((book) => (
                    <div key={book.id} className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg flex flex-col justify-between group">
                      <div>
                        {/* Capa do Livro */}
                        <div className="relative aspect-2/3 w-full max-w-40 mx-auto rounded-xl overflow-hidden border border-[#3b2d63]/50 shadow-md">
                          <Image
                            src="/imagens/éAssimQueAcaba.webp"
                            alt={book.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 150px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Informações */}
                        <h3 className="text-sm font-lexend font-semibold text-white mt-3.5 line-clamp-1">
                          {book.title}
                        </h3>
                        <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5 line-clamp-1">
                          {book.author}
                        </p>
                        
                        {/* Avaliação */}
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                          <span className="text-xs text-[#A5A1B8] font-lexend font-medium">{book.rating}</span>
                        </div>
                      </div>

                      {/* Botão Remover */}
                      <button 
                        onClick={() => handleRemoveBook("quero-ler", book.id)}
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

          {/* Lendo */}
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
                  Lendo <span className="text-xs text-[#A5A1B8] font-normal lowercase font-spartan ml-1.5">{filteredLendo.length} {filteredLendo.length === 1 ? "livro" : "livros"}</span>
                </h2>
                <a href="#" className="text-xs font-semibold text-[#8c52ff] hover:underline font-spartan">Ver todos</a>
              </div>

              {filteredLendo.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-[#181424] border border-[#3b2d63] rounded-2xl text-center">
                  <p className="text-sm text-[#A5A1B8] font-spartan">{busca ? "Nenhum livro encontrado nesta busca." : "Nenhum livro nesta seção."}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {filteredLendo.map((book) => (
                    <div key={book.id} className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg flex flex-col justify-between group">
                      <div>
                        {/* Capa do Livro */}
                        <div className="relative aspect-2/3 w-full max-w-40 mx-auto rounded-xl overflow-hidden border border-[#3b2d63]/50 shadow-md">
                          <Image
                            src="/imagens/éAssimQueAcaba.webp"
                            alt={book.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 150px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Informações */}
                        <h3 className="text-sm font-lexend font-semibold text-white mt-3.5 line-clamp-1">
                          {book.title}
                        </h3>
                        <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5 line-clamp-1">
                          {book.author}
                        </p>
                        
                        {/* Avaliação */}
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                          <span className="text-xs text-[#A5A1B8] font-lexend font-medium">{book.rating}</span>
                        </div>

                        {/* Progresso de leitura */}
                        <div className="mt-3.5">
                          <div className="flex justify-between items-center text-[10px] font-spartan font-semibold text-[#A5A1B8] mb-1">
                            <span>{book.progress}%</span>
                            <span className="opacity-80">{book.progress}% concluído</span>
                          </div>
                          <div className="w-full bg-[#271E42] rounded-full h-1.5 overflow-hidden">
                            <div className="bg-linear-to-r from-[#00E5FF] to-[#8c52ff] h-full rounded-full" style={{ width: `${book.progress}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Botão Remover */}
                      <button 
                        onClick={() => handleRemoveBook("lendo", book.id)}
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
                  Lidos <span className="text-xs text-[#A5A1B8] font-normal lowercase font-spartan ml-1.5">{filteredLidos.length} {filteredLidos.length === 1 ? "livro" : "livros"}</span>
                </h2>
                <a href="#" className="text-xs font-semibold text-[#8c52ff] hover:underline font-spartan">Ver todos</a>
              </div>

              {filteredLidos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-[#181424] border border-[#3b2d63] rounded-2xl text-center">
                  <p className="text-sm text-[#A5A1B8] font-spartan">{busca ? "Nenhum livro encontrado nesta busca." : "Nenhum livro nesta seção."}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {filteredLidos.map((book) => (
                    <div key={book.id} className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg flex flex-col justify-between group">
                      <div>
                        {/* Capa do Livro */}
                        <div className="relative aspect-2/3 w-full max-w-40 mx-auto rounded-xl overflow-hidden border border-[#3b2d63]/50 shadow-md">
                          <Image
                            src="/imagens/éAssimQueAcaba.webp"
                            alt={book.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 150px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Informações */}
                        <h3 className="text-sm font-lexend font-semibold text-white mt-3.5 line-clamp-1">
                          {book.title}
                        </h3>
                        <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5 line-clamp-1">
                          {book.author}
                        </p>
                        
                        {/* Avaliação */}
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                          <span className="text-xs text-[#A5A1B8] font-lexend font-medium">{book.rating}</span>
                        </div>
                      </div>

                      {/* Botão Remover */}
                      <button 
                        onClick={() => handleRemoveBook("lidos", book.id)}
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

          {/*  Abandonados */}
          {(activeTab === "abandonados") && (
            <section className="mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center gap-2.5 text-base font-bold font-lexend text-white uppercase tracking-wider">
                  <XCircle className="w-5 h-5 text-[#8c52ff]" />
                  Abandonados <span className="text-xs text-[#A5A1B8] font-normal lowercase font-spartan ml-1.5">{filteredAbandonados.length} {filteredAbandonados.length === 1 ? "livro" : "livros"}</span>
                </h2>
              </div>

              {filteredAbandonados.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#181424] border border-[#3b2d63] rounded-2xl text-center">
                  <XCircle className="w-12 h-12 text-[#3b2d63] opacity-40 mb-4" />
                  <h3 className="text-base font-lexend font-semibold text-white">Nenhum livro abandonado</h3>
                  <p className="text-xs text-[#A5A1B8] font-spartan mt-1 max-w-xs">{busca ? "Nenhum livro encontrado nesta busca." : "Muito bem! Você não abandonou nenhuma de suas leituras recentemente."}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {filteredAbandonados.map((book) => (
                    <div key={book.id} className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg flex flex-col justify-between group">
                      <div>
                        {/* Capa do Livro */}
                        <div className="relative aspect-2/3 w-full max-w-40 mx-auto rounded-xl overflow-hidden border border-[#3b2d63]/50 shadow-md">
                          <Image
                            src="/imagens/éAssimQueAcaba.webp"
                            alt={book.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 150px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Informações */}
                        <h3 className="text-sm font-lexend font-semibold text-white mt-3.5 line-clamp-1">{book.title}</h3>
                        <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5 line-clamp-1">{book.author}</p>
                      </div>

                      {/* Botão Remover */}
                      <button 
                        onClick={() => handleRemoveBook("abandonados", book.id)}
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
