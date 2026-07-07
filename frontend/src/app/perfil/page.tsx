"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  BookMarked,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Star,
  Target,
} from "lucide-react";

type Usuario = {
  nome: string;
  email: string;
};

type AbaPerfil = "visao" | "resenhas" | "metas";

type CartaoEstatisticaProps = {
  titulo: string;
  valor: string | number;
  icone: React.ElementType;
};

type EstadoVazioProps = {
  titulo: string;
  descricao: string;
  icone: React.ElementType;
};

const abas = [
  { id: "visao" as const, titulo: "Visão geral", icone: BookOpen },
  { id: "resenhas" as const, titulo: "Resenhas", icone: Star },
  { id: "metas" as const, titulo: "Metas", icone: Target },
];

const estadosVazios = {
  visao: {
    titulo: "Nenhum livro listado por aqui ainda.",
    descricao: "Quando a biblioteca for conectada ao backend, os livros salvos aparecerão nesta área.",
    icone: BookOpen,
    cabecalho: "Minha biblioteca",
  },
  resenhas: {
    titulo: "Nenhuma resenha publicada ainda.",
    descricao: "As resenhas feitas pelos leitores aparecerão aqui futuramente.",
    icone: Star,
    cabecalho: "Resenhas",
  },
};

function getUsuario(): Usuario | null {
  if (typeof window === "undefined") return null;

  const dadosUsuario = localStorage.getItem("librorum:user");
  return dadosUsuario ? JSON.parse(dadosUsuario) : null;
}

function CartaoEstatistica({ titulo, valor, icone: Icone }: CartaoEstatisticaProps) {
  return (
    <div className="bg-[#0F0C18] border border-[#3b2d63] rounded-lg p-3 text-center">
      <Icone size={18} className="text-[#8c52ff] mx-auto mb-1" />
      <p className="text-xl font-bold text-white">{valor}</p>
      <p className="text-[10px] text-[#A5A1B8]">{titulo}</p>
    </div>
  );
}

function EstadoVazio({ titulo, descricao, icone: Icone }: EstadoVazioProps) {
  return (
    <div className="border border-dashed border-[#3b2d63] rounded-xl p-6 text-center">
      <Icone size={32} className="text-[#8c52ff] mx-auto mb-3" />
      <p className="text-sm font-semibold text-white">{titulo}</p>
      <p className="text-xs text-[#A5A1B8] mt-2">{descricao}</p>
    </div>
  );
}

export default function PerfilPage() {
  const [usuario] = useState<Usuario | null>(getUsuario);
  const [abaAtiva, setAbaAtiva] = useState<AbaPerfil>("visao");
  const [meta, setMeta] = useState("12");

  const nome = usuario?.nome ?? "Usuário";
  const email = usuario?.email ?? "E-mail não informado";
  const estatisticas = [
    { titulo: "Total de Livros", valor: 0, icone: BookOpen },
    { titulo: "Lendo Agora", valor: 0, icone: BookMarked },
    { titulo: "Livros Lidos", valor: 0, icone: CheckCircle2 },
    { titulo: "Quero Ler", valor: 0, icone: Bookmark },
  ];

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto bg-[#15131D] no-scrollbar">
        <Header />

        <section className="bg-[#181424] border border-[#3b2d63] rounded-xl p-5 mb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border border-[#8c52ff] bg-[#271E42] flex items-center justify-center text-white font-bold text-2xl">
                {nome[0]?.toUpperCase()}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">{nome}</h1>
                <p className="text-sm text-[#A5A1B8] mt-1">{email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {estatisticas.map((estatistica) => (
                <CartaoEstatistica key={estatistica.titulo} {...estatistica} />
              ))}
            </div>
          </div>
        </section>

        <div className="flex gap-1 mb-6 bg-[#181424] border border-[#3b2d63] rounded-xl p-1 w-fit">
          {abas.map(({ id, titulo, icone: Icone }) => (
            <button
              key={id}
              onClick={() => setAbaAtiva(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer ${
                abaAtiva === id
                  ? "bg-[#271E42] text-white border border-[#3b2d63]"
                  : "text-[#A5A1B8] hover:text-white hover:bg-[#1c172d]/50"
              }`}
            >
              <Icone size={16} className={abaAtiva === id ? "text-[#8c52ff]" : ""} />
              {titulo}
            </button>
          ))}
        </div>

        {abaAtiva !== "metas" && (
          <section className="bg-[#181424] border border-[#3b2d63] rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-4">
              {estadosVazios[abaAtiva].cabecalho}
            </h2>
            <EstadoVazio {...estadosVazios[abaAtiva]} />
          </section>
        )}

        {abaAtiva === "metas" && (
          <section className="bg-[#181424] border border-[#3b2d63] rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-4">Meta anual de leitura</h2>

            <label className="text-sm text-[#A5A1B8]" htmlFor="meta">
              Quantos livros você quer ler este ano?
            </label>
            <div className="flex gap-3 mt-3">
              <input
                id="meta"
                type="number"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                className="w-28 bg-[#271E42] border border-[#3b2d63] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#6b6880] focus:outline-none focus:border-[#8c52ff]"
              />
              <span className="self-center text-sm text-[#A5A1B8]">livros</span>
            </div>

            <p className="text-xs text-[#6b6880] mt-4">
              A meta é demonstrativa nesta versão.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
