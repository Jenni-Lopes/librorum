import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import { LivroBiblioteca } from "@/services/book";

interface BookCardProps {
  book: LivroBiblioteca;
  onRemove: (id: number) => void;
}

export default function BookCard({ book, onRemove }: BookCardProps) {
  return (
    <div className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg flex flex-col justify-between group">
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
          <span className="text-xs text-[#A5A1B8] font-lexend font-medium">
            {book.nota ? book.nota.toFixed(1) : "0.0"}
          </span>
        </div>

        {/* Progresso de leitura (apenas se o status for READING) */}
        {book.status === "READING" && (
          <div className="mt-3.5">
            <div className="flex justify-between items-center text-[10px] font-spartan font-semibold text-[#A5A1B8] mb-1">
              <span>{book.percentual}%</span>
              <span className="opacity-80">{book.percentual}% concluído</span>
            </div>
            <div className="w-full bg-[#271E42] rounded-full h-1.5 overflow-hidden">
              <div className="bg-linear-to-r from-[#00E5FF] to-[#8c52ff] h-full rounded-full" style={{ width: `${book.percentual}%` }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Botão Remover */}
      <button 
        onClick={() => onRemove(book.id)}
        className="flex items-center justify-center gap-2 mt-4 py-2 px-3 border border-[#3b2d63] hover:border-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl text-xs font-spartan font-medium text-[#A5A1B8] hover:text-[#ef4444] transition-all w-full cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Remover
      </button>
    </div>
  );
}
