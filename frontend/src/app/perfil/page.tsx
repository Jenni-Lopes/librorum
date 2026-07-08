"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CardResenhaPerfil from "@/components/CardResenhaPerfil";
import { buscarMetaAtual, salvarMetaAtual } from "@/services/goal";
import { listarBiblioteca, LivroBiblioteca } from "@/services/book";
import { deletarAvaliacao, listarMinhasAvaliacoes, ReviewApi } from "@/services/review";
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

type AbaPerfil = "metas" | "resenhas";

type CartaoEstatisticaProps = {
  titulo: string;
  valor: string | number;
  icone: React.ElementType;
};

const abas = [
  { id: "metas" as const, titulo: "Metas", icone: Target },
  { id: "resenhas" as const, titulo: "Resenhas", icone: Star },
];

function getUsuario(): Usuario | null {
  if (typeof window === "undefined") return null;

  const dadosUsuario = localStorage.getItem("librorum:user");

  try {
    return dadosUsuario ? JSON.parse(dadosUsuario) : null;
  } catch {
    localStorage.removeItem("librorum:user");
    return null;
  }
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

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<AbaPerfil>("metas");
  const [meta, setMeta] = useState("");
  const [biblioteca, setBiblioteca] = useState<LivroBiblioteca[]>([]);
  const [resenhas, setResenhas] = useState<ReviewApi[]>([]);

  useEffect(() => {
    const user = getUsuario();
    if (user) {
      setUsuario(user);
    }

    async function carregarDadosPerfil() {
      try {
        const [livros, avaliacoes, metaAtual] = await Promise.all([
          listarBiblioteca(),
          listarMinhasAvaliacoes(),
          buscarMetaAtual(),
        ]);

        setBiblioteca(livros);
        setResenhas(avaliacoes);
        setMeta(metaAtual.target ? String(metaAtual.target) : "");
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      }
    }

    carregarDadosPerfil();
  }, []);

  const nome = usuario?.nome ?? "Usuario";
  const email = usuario?.email ?? "E-mail nao informado";
  const totalLivros = biblioteca.length;
  const lendoAgora = biblioteca.filter((livro) => livro.status === "READING").length;
  const livrosLidos = biblioteca.filter((livro) => livro.status === "FINISHED").length;
  const queroLer = biblioteca.filter((livro) => livro.status === "WANT_TO_READ").length;
  const metaNumerica = Number(meta) || 0;
  const percentualMeta =
    metaNumerica > 0 ? Math.min(100, Math.round((livrosLidos / metaNumerica) * 100)) : 0;

  const estatisticas = [
    { titulo: "Total de Livros", valor: totalLivros, icone: BookOpen },
    { titulo: "Lendo Agora", valor: lendoAgora, icone: BookMarked },
    { titulo: "Livros Lidos", valor: livrosLidos, icone: CheckCircle2 },
    { titulo: "Quero Ler", valor: queroLer, icone: Bookmark },
  ];

  async function handleDeletarResenha(id: number) {
    try {
      await deletarAvaliacao(id);
      setResenhas((resenhasAtuais) =>
        resenhasAtuais.filter((resenha) => resenha.id !== id)
      );
    } catch (error) {
      console.error("Erro ao remover resenha:", error);
    }
  }

  async function handleSalvarMeta() {
    const valorMeta = Number(meta);

    if (!Number.isInteger(valorMeta) || valorMeta < 1) {
      return;
    }

    try {
      const metaSalva = await salvarMetaAtual(valorMeta);
      setMeta(String(metaSalva.target));
      
     
      window.dispatchEvent(
        new CustomEvent("librorum:meta-atualizada", {
          detail: { target: metaSalva.target },
        })
      );
    } catch (error) {
      console.error("Erro ao salvar meta:", error);
    }
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto bg-[#15131D] no-scrollbar">
        <Header />

        <section className="bg-[#181424] border border-[#3b2d63] rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center gap-5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border border-[#8c52ff] bg-[#271E42] flex items-center justify-center text-white font-bold text-2xl">
                {nome[0]?.toUpperCase()}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">{nome}</h1>
                <p className="text-sm text-[#A5A1B8] mt-1">{email}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {estatisticas.map((estatistica) => (
                <CartaoEstatistica
                  key={estatistica.titulo}
                  {...estatistica}
                  valor={estatistica.valor}
                />
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

        {abaAtiva === "metas" && (
          <section className="bg-[#181424] border border-[#3b2d63] rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-4">Meta anual de leitura</h2>

            <label className="text-sm text-[#A5A1B8]" htmlFor="meta">
              Quantos livros voce quer ler este ano?
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
              <button
                type="button"
                onClick={handleSalvarMeta}
                className="bg-[#8c52ff] hover:bg-[#7a44eb] text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Salvar
              </button>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-xs text-[#A5A1B8] mb-2">
                <span>{livrosLidos} livros lidos</span>
                <span>{percentualMeta}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#271E42] overflow-hidden">
                <div
                  className="h-full bg-[#8c52ff] rounded-full transition-all"
                  style={{ width: `${percentualMeta}%` }}
                />
              </div>
            </div>
          </section>
        )}

        {abaAtiva === "resenhas" && (
          <section className="bg-[#181424] border border-[#3b2d63] rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-4">Minhas resenhas</h2>

            {resenhas.length === 0 && (
              <div className="border border-dashed border-[#3b2d63] rounded-xl p-6 text-center">
                <Star size={32} className="text-[#8c52ff] mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">Nenhuma resenha publicada ainda.</p>
                <p className="text-xs text-[#A5A1B8] mt-2">
                  As resenhas que voce escrever na pagina dos livros aparecem aqui.
                </p>
              </div>
            )}

            {resenhas.length > 0 && (
              <div className="flex flex-col gap-4">
                {resenhas.map((resenha) => {
                  const livro = biblioteca.find(
                    (item) => item.googleBookId === resenha.googleBookId
                  );

                  return (
                    <CardResenhaPerfil
                      key={resenha.id}
                      resenha={resenha}
                      livro={livro}
                      onDelete={handleDeletarResenha}
                    />
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
