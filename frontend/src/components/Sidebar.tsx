"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { listarBiblioteca, LivroBiblioteca } from "@/services/book";
import { buscarMetaAtual } from "@/services/goal";
import LogoutButton from "./sair";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [meta, setMeta] = useState<number | null>(null);
  const [biblioteca, setBiblioteca] = useState<LivroBiblioteca[]>([]);

  const buscaAtiva = pathname === "/" && searchParams.get("focus") === "busca";
  const livrosLidos = biblioteca.filter((livro) => livro.status === "FINISHED").length;
  const percentualMeta = meta && meta > 0 ? Math.min(100, Math.round((livrosLidos / meta) * 100)) : 0;

  useEffect(() => {
    async function carregarMeta() {
      try {
        const [livros, metaAtual] = await Promise.all([
          listarBiblioteca(),
          buscarMetaAtual(),
        ]);

        setBiblioteca(livros);
        setMeta(metaAtual.target);
      } catch (error) {
        console.error("Erro ao carregar meta da sidebar:", error);
      }
    }

    carregarMeta();
  }, []);

  useEffect(() => {
    function atualizarMeta(event: Event) {
      const metaAtualizada = event as CustomEvent<{ target?: number }>;

      if (typeof metaAtualizada.detail?.target === "number") {
        setMeta(metaAtualizada.detail.target);
      }
    }

    window.addEventListener("librorum:meta-atualizada", atualizarMeta);

    return () => {
      window.removeEventListener("librorum:meta-atualizada", atualizarMeta);
    };
  }, []);

  function itemMenuAtivo(ativo: boolean) {
    return ativo
      ? "bg-[#271E42] text-[#8c52ff] border border-[#3b2d63]"
      : "text-[#A5A1B8] hover:text-[#8c52ff] hover:bg-[#1c172d]/50";
  }

  return (
    <aside className="w-80 bg-[#0F0C18] border-r border-[#3b2d63] flex flex-col p-6 h-screen overflow-y-auto no-scrollbar shrink-0">
      <div className="flex items-center justify-center mb-8">
        <Image
          src="/imagens/iconLogo.png"
          alt="Logo Librorum"
          width={120}
          height={48}
          className="object-contain"
          priority
        />
      </div>

      <nav className="flex flex-col gap-2">
        <Link
          href="/"
          className={`${itemMenuAtivo(pathname === "/" && !buscaAtiva)} rounded-xl px-4 py-3 flex items-center gap-3 w-full text-left font-lexend font-medium transition-all cursor-pointer`}
        >
          <Image
            src="/imagens/iconCasa.png"
            alt="Início"
            width={20}
            height={20}
            className="w-5 h-5 object-contain filter brightness-110"
          />
          Início
        </Link>


        <Link
          href="/perfil"
          className={`${itemMenuAtivo(pathname === "/perfil")} rounded-xl px-4 py-3 flex items-center gap-3 w-full text-left font-lexend font-medium transition-all cursor-pointer`}
          aria-label="Ir para a tela de perfil"
        >
          <Image
            src="/imagens/iconUser.png"
            alt="Perfil"
            width={20}
            height={20}
            className="w-5 h-5 object-contain opacity-70 hover:opacity-100 transition-opacity"
          />
          Perfil
        </Link>
      </nav>

      <div className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 mt-6">
        <p className="text-xs text-[#A5A1B8] font-spartan font-semibold uppercase tracking-wider">Meta de leitura</p>
        <div className="flex justify-between items-baseline mt-2">
          <span className="text-lg font-bold text-white font-lexend">
            {livrosLidos}<span className="text-xs text-[#A5A1B8] font-normal">/{meta ?? "--"} livros</span>
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-full bg-[#271E42] rounded-full h-2 overflow-hidden">
            <div className="bg-linear-to-r from-[#00E5FF] to-[#8c52ff] h-full rounded-full" style={{ width: `${percentualMeta}%` }} />
          </div>
          <span className="text-xs text-[#A5A1B8] font-spartan font-semibold">{percentualMeta}%</span>
        </div>
      </div>

      <div className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 mt-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#A5A1B8] font-spartan font-semibold uppercase tracking-wider">Continue lendo</span>
          <a href="#" className="text-xs text-[#8c52ff] hover:underline font-spartan font-semibold">Ver todos</a>
        </div>

        <div className="flex gap-4">
          <div className="w-16 h-24 rounded-lg relative overflow-hidden shrink-0 border border-[#3b2d63] shadow-md">
            <Image
              src="/imagens/éAssimQueAcaba.webp"
              alt="É assim que acaba"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between grow">
            <div>
              <h4 className="text-sm font-semibold text-white font-lexend line-clamp-1">É assim que acaba</h4>
              <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5">Colleen Hoover</p>
            </div>
            <div className="mt-2">
              <p className="text-[10px] text-[#A5A1B8] font-spartan font-semibold">100% concluído</p>
              <div className="w-full bg-[#271E42] rounded-full h-1.5 mt-1 overflow-hidden">
                <div className="bg-linear-to-r from-[#00E5FF] to-[#8c52ff] h-full rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/livro/e-assim-que-acaba"
          className="w-full bg-[#8c52ff] hover:bg-[#7a44eb] text-white font-lexend font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-[0_4px_12px_rgba(140,82,255,0.25)] hover:shadow-[0_4px_16px_rgba(140,82,255,0.4)] cursor-pointer text-center"
        >
          Continuar leitura
        </Link>
      </div>

      <div className="mt-auto pt-6 flex justify-center">
        <LogoutButton />
      </div>
    </aside>
  );
}
