"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Bookmark, Calendar, FileText, Globe } from "lucide-react";

export interface DadosLivro {
  title: string;
  authors: string;
  cover?: string;
  pages: number;
  publishedDate: string;
  language: string;
  category: string;
  description: string;
}

interface InfoLivroProps {
  bookData: DadosLivro;
}

export default function InfoLivro({ bookData }: InfoLivroProps) {
  const [mostrarDescricaoCompleta, setMostrarDescricaoCompleta] = useState(false);

  return (
    <>
      {/* Coluna da Capa */}
      <div className="col-span-3 flex justify-start">
        <div className="relative w-full aspect-[2/3] max-w-[280px] rounded-3xl overflow-hidden border border-[#3b2d63] shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all hover:scale-[1.02] hover:border-[#8c52ff]">
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

      {/* Coluna de Informações / Descrição */}
      <div className="col-span-5 flex flex-col">
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
    </>
  );
}
