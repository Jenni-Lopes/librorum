"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  BookOpen,
  BookMarked,
  Star,
  Target,
  Camera,
  Pencil,
  Check,
  X,
  ChevronRight,
  MoreHorizontal,
  Calendar,
} from "lucide-react";

const mockLivros = [
  {
    id: 1,
    titulo: "Quarta Asa",
    autor: "Rebecca Yarros",
    capa: "/imagens/éAssimQueAcaba.webp",
    status: "LIDO",
    nota: 5,
    dataLeitura: "10 de mai. 2026",
    resenha: "Uma história viciante do começo ao fim. Personagens incríveis e um mundo muito bem construído!",
  },
  {
    id: 2,
    titulo: "O Nome do Vento",
    autor: "Patrick Rothfuss",
    capa: "/imagens/éAssimQueAcaba.webp",
    status: "LIDO",
    nota: 4,
    dataLeitura: "2 de mai. 2026",
    resenha: "A escrita de Rothfuss é simplesmente impecável. Uma obra-prima da fantasia.",
  },
  {
    id: 3,
    titulo: "A Rainha Vermelha",
    autor: "Victoria Aveyard",
    capa: "/imagens/éAssimQueAcaba.webp",
    status: "LIDO",
    nota: 3,
    dataLeitura: "18 de abr. 2026",
    resenha: "Gostei bastante do universo e do conflito. O final me deixou curiosa para o próximo!",
  },
  {
    id: 4,
    titulo: "É Assim Que Acaba",
    autor: "Colleen Hoover",
    capa: "/imagens/éAssimQueAcaba.webp",
    status: "LENDO",
    nota: null,
    dataLeitura: null,
    resenha: null,
  },
  {
    id: 5,
    titulo: "Duna",
    autor: "Frank Herbert",
    capa: "/imagens/éAssimQueAcaba.webp",
    status: "QUERO_LER",
    nota: null,
    dataLeitura: null,
    resenha: null,
  },
];

function StarRating({ nota, max = 5 }: { nota: number | null; max?: number }) {
  if (nota === null) return null;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < nota
              ? "text-[#FFD700] fill-[#FFD700]"
              : "text-[#3b2d63] fill-[#3b2d63]"
          }
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    LENDO: { label: "Lendo", color: "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30" },
    LIDO: { label: "Lido", color: "bg-[#8c52ff]/10 text-[#8c52ff] border-[#8c52ff]/30" },
    QUERO_LER: { label: "Quero Ler", color: "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30" },
  };
  const s = map[status] ?? { label: status, color: "bg-white/10 text-white border-white/20" };
  return (
    <span className={`text-[10px] font-spartan font-semibold px-2 py-0.5 rounded-full border ${s.color}`}>
      {s.label}
    </span>
  );
}


function AbaVisaoGeral({
  livros,
  meta,
  setMeta,
}: {
  livros: typeof mockLivros;
  meta: number;
  setMeta: (v: number) => void;
}) {
  const lidos = livros.filter((l) => l.status === "LIDO").length;
  const [inputMeta, setInputMeta] = useState("");
  const resenhas = livros.filter((l) => l.nota !== null);
  const porcentagem = meta > 0 ? Math.min(Math.round((lidos / meta) * 100), 100) : 0;

  function salvarMeta() {
    const n = parseInt(inputMeta);
    if (!isNaN(n) && n > 0) {
      setMeta(n);
      setInputMeta("");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Meta Anual */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold font-lexend text-[#15131D] mb-4">
          Meta Anual de Leitura
        </h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[#6b6880] font-spartan">
            {lidos} de {meta > 0 ? meta : 0} livros lidos
          </span>
          <span className="text-sm font-bold font-lexend text-[#8c52ff]">
            {porcentagem}%
          </span>
        </div>
        <div className="w-full bg-[#f0ecff] rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8c52ff] to-[#00E5FF] transition-all duration-700"
            style={{ width: `${porcentagem}%` }}
          />
        </div>
        <div className="flex gap-3">
          <input
            type="number"
            value={inputMeta}
            onChange={(e) => setInputMeta(e.target.value)}
            placeholder={`Defina sua meta anual (ex: ${meta > 0 ? meta : 100})`}
            className="flex-1 bg-[#f5f3ff] border border-[#e2deff] rounded-xl px-4 py-2.5 text-sm text-[#15131D] placeholder-[#a5a1b8] focus:outline-none focus:border-[#8c52ff] font-spartan"
          />
          <button
            onClick={salvarMeta}
            className="bg-[#8c52ff] hover:bg-[#7a44eb] text-white font-lexend font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(140,82,255,0.25)] hover:shadow-[0_4px_16px_rgba(140,82,255,0.4)] cursor-pointer"
          >
            Atualizar Meta
          </button>
        </div>
      </div>

      {/* Resenhas recentes */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2 text-base font-bold font-lexend text-[#F5F3FF]">
            <BookMarked size={18} className="text-[#8c52ff]" />
            Minhas resenhas
          </h3>
          <button className="text-sm font-semibold text-[#8c52ff] hover:underline font-spartan flex items-center gap-1 cursor-pointer">
            Ver todas <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {resenhas.slice(0, 3).map((livro) => (
            <div
              key={livro.id}
              className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff]/60 transition-all"
            >
              <div className="flex gap-3 mb-3">
                <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-[#3b2d63] shadow-md">
                  <Image src={livro.capa} alt={livro.titulo} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold font-lexend text-white line-clamp-1">{livro.titulo}</p>
                  <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5">{livro.autor}</p>
                  <StarRating nota={livro.nota} />
                  {livro.dataLeitura && (
                    <p className="text-[10px] text-[#6b6880] font-spartan mt-1 flex items-center gap-1">
                      <Calendar size={10} />
                      {livro.dataLeitura}
                    </p>
                  )}
                </div>
                <button className="text-[#A5A1B8] hover:text-white transition-colors self-start">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              {livro.resenha && (
                <p className="text-xs text-[#A5A1B8] font-spartan leading-relaxed line-clamp-3">
                  {livro.resenha}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function AbaResenhas({ livros }: { livros: typeof mockLivros }) {
  const resenhas = livros.filter((l) => l.nota !== null);
  return (
    <div className="flex flex-col gap-4">
      {resenhas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Star size={40} className="text-[#3b2d63] mb-3" />
          <p className="text-[#A5A1B8] font-spartan">Nenhuma resenha escrita ainda.</p>
        </div>
      )}
      {resenhas.map((livro) => (
        <div
          key={livro.id}
          className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-5 hover:border-[#8c52ff]/60 transition-all"
        >
          <div className="flex gap-4">
            <div className="relative w-14 h-20 rounded-xl overflow-hidden shrink-0 border border-[#3b2d63] shadow-md">
              <Image src={livro.capa} alt={livro.titulo} fill sizes="56px" className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-bold font-lexend text-white">{livro.titulo}</h4>
                  <p className="text-sm text-[#A5A1B8] font-spartan">{livro.autor}</p>
                </div>
                <button className="text-[#A5A1B8] hover:text-white transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <StarRating nota={livro.nota} />
                {livro.dataLeitura && (
                  <span className="text-[11px] text-[#6b6880] font-spartan flex items-center gap-1">
                    <Calendar size={11} />
                    {livro.dataLeitura}
                  </span>
                )}
              </div>
              {livro.resenha && (
                <p className="text-sm text-[#A5A1B8] font-spartan leading-relaxed mt-3">
                  {livro.resenha}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AbaMetas({
  livros,
  meta,
  setMeta,
}: {
  livros: typeof mockLivros;
  meta: number;
  setMeta: (v: number) => void;
}) {
  const lidos = livros.filter((l) => l.status === "LIDO").length;
  const lendo = livros.filter((l) => l.status === "LENDO").length;
  const queroLer = livros.filter((l) => l.status === "QUERO_LER").length;
  const porcentagem = meta > 0 ? Math.min(Math.round((lidos / meta) * 100), 100) : 0;
  const [inputMeta, setInputMeta] = useState(meta > 0 ? String(meta) : "");

  function salvarMeta() {
    const n = parseInt(inputMeta);
    if (!isNaN(n) && n > 0) setMeta(n);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progresso */}
      <div className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target size={22} className="text-[#8c52ff]" />
          <h3 className="text-lg font-bold font-lexend text-white">Meta Anual de Leitura</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Meta", value: meta > 0 ? meta : "—", color: "text-white" },
            { label: "Lidos", value: lidos, color: "text-[#8c52ff]" },
            { label: "Faltam", value: meta > 0 ? Math.max(meta - lidos, 0) : "—", color: "text-[#00E5FF]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#271E42] rounded-xl p-4 text-center">
              <p className="text-xs text-[#A5A1B8] font-spartan font-semibold uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className={`text-2xl font-bold font-lexend ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="mb-2 flex justify-between text-sm font-spartan">
          <span className="text-[#A5A1B8]">{lidos} de {meta > 0 ? meta : 0} livros</span>
          <span className="text-[#8c52ff] font-bold">{porcentagem}%</span>
        </div>
        <div className="w-full bg-[#271E42] rounded-full h-4 overflow-hidden mb-6">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8c52ff] to-[#00E5FF] transition-all duration-700 shadow-[0_0_12px_rgba(140,82,255,0.5)]"
            style={{ width: `${porcentagem}%` }}
          />
        </div>

        <div className="flex gap-3">
          <input
            type="number"
            value={inputMeta}
            onChange={(e) => setInputMeta(e.target.value)}
            placeholder="Defina sua nova meta..."
            className="flex-1 bg-[#271E42] border border-[#3b2d63] rounded-xl px-4 py-3 text-sm text-white placeholder-[#6b6880] focus:outline-none focus:border-[#8c52ff] font-spartan"
          />
          <button
            onClick={salvarMeta}
            className="bg-[#8c52ff] hover:bg-[#7a44eb] text-white font-lexend font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(140,82,255,0.25)] hover:shadow-[0_4px_16px_rgba(140,82,255,0.4)] cursor-pointer"
          >
            Salvar Meta
          </button>
        </div>
      </div>

      {/* Estatísticas detalhadas */}
      <div className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-6">
        <h3 className="text-base font-bold font-lexend text-white mb-4">Distribuição da Biblioteca</h3>
        <div className="flex flex-col gap-3">
          {[
            { label: "Lidos", valor: lidos, total: livros.length, cor: "#8c52ff" },
            { label: "Lendo", valor: lendo, total: livros.length, cor: "#00E5FF" },
            { label: "Quero Ler", valor: queroLer, total: livros.length, cor: "#FFD700" },
          ].map(({ label, valor, total, cor }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#A5A1B8] font-spartan">{label}</span>
                <span className="font-bold font-lexend" style={{ color: cor }}>
                  {valor} livros
                </span>
              </div>
              <div className="w-full bg-[#271E42] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${total > 0 ? (valor / total) * 100 : 0}%`,
                    backgroundColor: cor,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  const [livros] = useState(mockLivros);
  const [abaAtiva, setAbaAtiva] = useState<"visao" | "resenhas" | "metas">("visao");
  const [meta, setMeta] = useState(0);

  // Bio editável
  const [bio, setBio] = useState("");
  const [editandoBio, setEditandoBio] = useState(false);
  const [bioTemp, setBioTemp] = useState("");
  const bioRef = useRef<HTMLTextAreaElement>(null);

  function iniciarEdicaoBio() {
    setBioTemp(bio);
    setEditandoBio(true);
    setTimeout(() => bioRef.current?.focus(), 50);
  }
  function salvarBio() {
    setBio(bioTemp.trim());
    setEditandoBio(false);
  }
  function cancelarBio() {
    setEditandoBio(false);
  }

  const total = livros.length;
  const lendo = livros.filter((l) => l.status === "LENDO").length;
  const lidos = livros.filter((l) => l.status === "LIDO").length;
  const queroLer = livros.filter((l) => l.status === "QUERO_LER").length;

  const abas = [
    { id: "visao" as const, label: "Visão geral", icon: <BookOpen size={16} /> },
    { id: "resenhas" as const, label: "Resenhas", icon: <Star size={16} /> },
    { id: "metas" as const, label: "Metas", icon: <Target size={16} /> },
  ];

  const statCards = [
    { label: "Total de Livros", value: total, color: "text-white", border: "border-[#3b2d63]", badge: null },
    { label: "Lendo Agora", value: lendo, color: "text-[#00E5FF]", border: "border-[#00E5FF]/30", badge: "bg-[#00E5FF]/10" },
    { label: "Livros Lidos", value: lidos, color: "text-[#8c52ff]", border: "border-[#8c52ff]/30", badge: "bg-[#8c52ff]/10" },
    { label: "Quero Ler", value: queroLer, color: "text-[#FFD700]", border: "border-[#FFD700]/30", badge: "bg-[#FFD700]/10" },
  ];

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto h-full flex flex-col bg-[#15131D] no-scrollbar">
        <Header />

        {/* ── Hero do Perfil ── */}
        <section className="relative bg-[#181424] border border-[#3b2d63] rounded-3xl p-6 mb-6">
          {/* Fundo gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8c52ff]/5 via-transparent to-[#00E5FF]/5 pointer-events-none rounded-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Avatar */}
            <div className="relative shrink-0 self-start">
              <div className="w-24 h-24 rounded-full border-4 border-[#8c52ff] bg-gradient-to-tr from-[#362A67] to-[#8c52ff] flex items-center justify-center text-white font-bold font-lexend text-3xl shadow-[0_0_20px_rgba(140,82,255,0.4)] overflow-hidden">
                Y
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#8c52ff] hover:bg-[#7a44eb] rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer border-2 border-[#181424]">
                <Camera size={12} className="text-white" />
              </button>
            </div>

            {/* Nome + Bio */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold font-lexend text-white mb-1">yasmin</h1>

              {editandoBio ? (
                <div className="flex flex-col gap-2 mt-1">
                  <textarea
                    ref={bioRef}
                    value={bioTemp}
                    onChange={(e) => setBioTemp(e.target.value)}
                    rows={2}
                    maxLength={160}
                    placeholder="Escreva sua bio aqui…"
                    className="w-full max-w-md bg-[#271E42] border border-[#8c52ff]/60 rounded-xl px-3 py-2 text-sm text-white placeholder-[#6b6880] resize-none focus:outline-none focus:ring-1 focus:ring-[#8c52ff] font-spartan"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={salvarBio}
                      className="flex items-center gap-1.5 bg-[#8c52ff] hover:bg-[#7a44eb] text-white text-xs font-spartan font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      <Check size={12} /> Salvar
                    </button>
                    <button
                      onClick={cancelarBio}
                      className="flex items-center gap-1.5 bg-[#271E42] hover:bg-[#3b2d63] text-[#A5A1B8] text-xs font-spartan font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      <X size={12} /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 group mt-1">
                  <p
                    className={`text-sm font-spartan ${bio ? "text-[#A5A1B8]" : "text-[#6b6880] italic"}`}
                  >
                    {bio || "Escreva sua bio aqui…"}
                  </p>
                  <button
                    onClick={iniciarEdicaoBio}
                    className="opacity-0 group-hover:opacity-100 text-[#6b6880] hover:text-[#8c52ff] transition-all cursor-pointer"
                    title="Editar bio"
                  >
                    <Pencil size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* Stat Cards */}
            <div className="flex gap-3 shrink-0">
              {statCards.map(({ label, value, color, border }) => (
                <div
                  key={label}
                  className={`bg-[#0F0C18] border ${border} rounded-xl p-3 text-center min-w-[90px]`}
                >
                  <p className="text-[10px] text-[#A5A1B8] font-spartan font-semibold uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <p className={`text-2xl font-bold font-lexend ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Abas ── */}
        <div className="flex gap-1 mb-6 bg-[#181424] border border-[#3b2d63] rounded-2xl p-1.5 w-fit">
          {abas.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-spartan font-semibold transition-all cursor-pointer ${
                abaAtiva === aba.id
                  ? "bg-[#271E42] text-white shadow-sm border border-[#3b2d63]"
                  : "text-[#A5A1B8] hover:text-white hover:bg-[#1c172d]/50"
              }`}
            >
              <span className={abaAtiva === aba.id ? "text-[#8c52ff]" : ""}>{aba.icon}</span>
              {aba.label}
            </button>
          ))}
        </div>

        {/* ── Conteúdo da Aba ── */}
        <div className="flex-1">
          {abaAtiva === "visao" && (
            <AbaVisaoGeral livros={livros} meta={meta} setMeta={setMeta} />
          )}

          {abaAtiva === "resenhas" && <AbaResenhas livros={livros} />}
          {abaAtiva === "metas" && (
            <AbaMetas livros={livros} meta={meta} setMeta={setMeta} />
          )}
        </div>
      </div>
    </main>
  );
}
