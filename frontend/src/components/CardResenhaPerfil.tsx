"use client";

import React from "react";
import { Star, Trash2 } from "lucide-react";
import { ReviewApi } from "@/services/review";
import { LivroBiblioteca } from "@/services/book";
import { formatarData } from "@/utils/utilitarios";

interface CardResenhaPerfilProps {
  resenha: ReviewApi;
  livro?: LivroBiblioteca;
  onDelete: (id: number) => void;
}

export default function CardResenhaPerfil({
  resenha,
  livro,
  onDelete,
}: CardResenhaPerfilProps) {
  return (
    <article className="border border-[#3b2d63] bg-[#0F0C18] rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">
            {livro?.titulo ?? "Livro avaliado"}
          </h3>
          <p className="text-[11px] text-[#A5A1B8] mt-1">
            {formatarData(resenha.updatedAt)}
          </p>
        </div>

        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((estrela) => (
            <Star
              key={estrela}
              className={`w-4 h-4 ${
                estrela <= resenha.rating
                  ? "fill-[#8c52ff] text-[#8c52ff]"
                  : "text-[#3b2d63]"
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-[#A5A1B8] leading-relaxed mt-3">
        {resenha.text}
      </p>

      <button
        type="button"
        onClick={() => onDelete(resenha.id)}
        className="mt-4 inline-flex items-center gap-2 text-xs text-[#A5A1B8] hover:text-[#ef4444] transition-colors cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Remover resenha
      </button>
    </article>
  );
}
