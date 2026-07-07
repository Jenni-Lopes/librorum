import Image from "next/image";
import { Livro } from "@/services/book";

interface SearchBookCardProps {
  book: Livro;
  onAdd: (book: Livro, status: "WANT_TO_READ" | "READING" | "FINISHED" | "DROPPED") => void;
}

export default function SearchBookCard({ book, onAdd }: SearchBookCardProps) {
  return (
    <div className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all flex flex-col justify-between group relative">
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

      {/* Botões de Adicionar  */}
      <div className="mt-4 flex flex-col gap-1.5 pt-3 border-t border-[#3b2d63]/30">
        <p className="text-[9px] text-[#A5A1B8] font-spartan font-semibold uppercase tracking-wider text-center">
          Adicionar à Biblioteca:
        </p>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => onAdd(book, "WANT_TO_READ")}
            className="py-1 px-1 bg-[#271E42] hover:bg-[#8c52ff] text-white rounded-lg text-[9px] font-spartan font-semibold transition-all cursor-pointer text-center"
          >
            Quero ler
          </button>
          <button
            onClick={() => onAdd(book, "READING")}
            className="py-1 px-1 bg-[#271E42] hover:bg-[#8c52ff] text-white rounded-lg text-[9px] font-spartan font-semibold transition-all cursor-pointer text-center"
          >
            Lendo
          </button>
          <button
            onClick={() => onAdd(book, "FINISHED")}
            className="py-1 px-1 bg-[#271E42] hover:bg-[#8c52ff] text-white rounded-lg text-[9px] font-spartan font-semibold transition-all cursor-pointer text-center"
          >
            Lido
          </button>
          <button
            onClick={() => onAdd(book, "DROPPED")}
            className="py-1 px-1 bg-[#271E42] hover:bg-[#8c52ff] text-white rounded-lg text-[9px] font-spartan font-semibold transition-all cursor-pointer text-center"
          >
            Abandonado
          </button>
        </div>
      </div>
    </div>
  );
}
