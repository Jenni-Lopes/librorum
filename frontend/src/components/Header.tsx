"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type HeaderProps = {
  busca?: string;
  setBusca?: React.Dispatch<React.SetStateAction<string>>;
  pesquisarLivros?: () => void;
  focarBusca?: boolean;
};

type Usuario = {
  nome?: string;
};

function getInicialUsuario() {
  if (typeof window === "undefined") return "L";

  const dadosUsuario = localStorage.getItem("librorum:user");
  let usuario: Usuario | null = null;

  try {
    usuario = dadosUsuario ? JSON.parse(dadosUsuario) : null;
  } catch {
    localStorage.removeItem("librorum:user");
  }

  return usuario?.nome?.[0]?.toUpperCase() ?? "L";
}

export default function Header({
  busca = "",
  setBusca,
  pesquisarLivros,
  focarBusca = false,
}: HeaderProps) {
  const [inicial] = useState(getInicialUsuario);
  const inputBuscaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focarBusca) {
      inputBuscaRef.current?.focus();
    }
  }, [focarBusca]);

  return (
    <header className="flex justify-between items-center mb-8">
      <div className="relative w-full max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Image
            src="/imagens/iconLupa.png"
            alt="Buscar"
            width={20}
            height={20}
            className="w-5 h-5 object-contain opacity-70 hover:opacity-100 transition-opacity"
          />
        </span>

        <input
          ref={inputBuscaRef}
          type="text"
          value={busca}
          onChange={(e) => setBusca?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              pesquisarLivros?.();
            }
          }}
          placeholder="Buscar livro/gênero/autor"
          className="w-full bg-[#181424] border border-[#3b2d63] rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#8c52ff] focus:ring-1 focus:ring-[#8c52ff] shadow-[0_0_15px_rgba(140,82,255,0.05)] focus:shadow-[0_0_20px_rgba(140,82,255,0.2)] transition-all font-spartan"
        />
      </div>

      <div className="w-10 h-10 rounded-full border-2 border-[#8c52ff] bg-linear-to-tr from-[#362A67] to-[#8c52ff] flex items-center justify-center text-white font-bold font-lexend text-sm overflow-hidden cursor-pointer shadow-[0_0_10px_rgba(140,82,255,0.3)]">
        {inicial}
      </div>
    </header>
  );
}
