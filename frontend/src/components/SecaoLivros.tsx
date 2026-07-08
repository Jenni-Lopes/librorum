"use client";

import React from "react";
import BookCard from "./BookCard";
import { LivroBiblioteca } from "@/services/book";

interface SecaoLivrosProps {
  titulo: string;
  icone: React.ReactNode;
  livros: LivroBiblioteca[];
  onRemove: (id: number) => Promise<void>;
  emptyState: React.ReactNode;
}

export default function SecaoLivros({
  titulo,
  icone,
  livros,
  onRemove,
  emptyState,
}: SecaoLivrosProps) {
  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex items-center gap-2.5 text-base font-bold font-lexend text-white uppercase tracking-wider">
          {icone}
          <span>{titulo}</span>
          <span className="text-xs text-[#A5A1B8] font-normal lowercase font-spartan ml-1.5">
            {livros.length} {livros.length === 1 ? "livro" : "livros"}
          </span>
        </h2>
      </div>

      {livros.length === 0 ? (
        emptyState
      ) : (
        <div className="grid grid-cols-4 gap-5">
          {livros.map((book) => (
            <BookCard key={book.id} book={book} onRemove={onRemove} />
          ))}
        </div>
      )}
    </section>
  );
}
