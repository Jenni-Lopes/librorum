import Image from "next/image";
import Link from "next/link";
import { Livro } from "@/services/book";

interface SearchBookCardProps {
  book: Livro;
}

export default function SearchBookCard({ book }: SearchBookCardProps) {
  return (
    <Link
      href={`/livro/${book.id}`}
      className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all flex flex-col group"
    >
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

      <h3 className="text-sm font-lexend font-semibold text-white mt-3 line-clamp-1 group-hover:text-[#8c52ff] transition-colors">
        {book.titulo}
      </h3>
      <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5 line-clamp-1">
        {book.autores?.join(", ") ?? "Autor desconhecido"}
      </p>
      <span className="mt-3 text-[11px] text-[#8c52ff] font-spartan font-semibold">
        Ver detalhes
      </span>
    </Link>
  );
}
