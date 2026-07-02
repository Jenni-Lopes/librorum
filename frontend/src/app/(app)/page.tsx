import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 p-8 overflow-y-auto h-full flex flex-col bg-[#15131D]">
        
        {/* Header */}
        <Header />

        <section className="mb-8">
          <h1 className="text-4xl font-bold font-lexend text-[#F5F3FF]">Oi, @Laura!</h1>
          <p className="text-base text-[#A5A1B8] font-spartan mt-1">Continue sua jornada literária.</p>
        </section>

        {/* Em Alta */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 text-lg font-bold font-lexend text-white uppercase tracking-wider">
              <Image
                src="/imagens/iconEmAlta.png"
                alt="Em alta"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
              Em alta
            </h2>
            <a href="#" className="text-sm font-semibold text-[#8c52ff] hover:underline font-spartan">Ver todos</a>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((cardId) => (
              <div key={cardId} className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg flex flex-col">
                {/* Capa do Livro */}
                <div className="relative aspect-2/3 w-full max-w-40 mx-auto rounded-xl overflow-hidden border border-[#3b2d63]/50 shadow-md">
                  <Image
                    src="/imagens/éAssimQueAcaba.webp"
                    alt="É assim que acaba"
                    fill
                    sizes="(max-width: 768px) 100vw, 200px"
                    className="object-cover"
                  />
                </div>
                
                {/* info */}
                <h3 className="text-base font-lexend font-medium text-white mt-3 line-clamp-1">
                  É assim que acaba
                </h3>
                <p className="text-sm text-[#A5A1B8] font-spartan mt-1">
                  Colleen Hoover
                </p>
                
                {/* avaliação */}
                <div className="flex items-center gap-2 mt-2">
                  <Image
                    src="/imagens/iconRecomendado.png"
                    alt="Estrela"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-base text-[#A5A1B8] font-lexend">5.0</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recomendado Para Você */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 text-lg font-bold font-lexend text-white uppercase tracking-wider">
              <Image
                src="/imagens/iconRecomendado.png"
                alt="Recomendado para você"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
              Recomendado para você
            </h2>
            <a href="#" className="text-sm font-semibold text-[#8c52ff] hover:underline font-spartan">Ver todos</a>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((cardId) => (
              <div key={cardId} className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg flex flex-col">
                {/* Capa do Livro */}
                <div className="relative aspect-2/3 w-full max-w-40 mx-auto rounded-xl overflow-hidden border border-[#3b2d63]/50 shadow-md">
                  <Image
                    src="/imagens/éAssimQueAcaba.webp"
                    alt="É assim que acaba"
                    fill
                    sizes="(max-width: 768px) 100vw, 200px"
                    className="object-cover"
                  />
                </div>
                
                {/* info */}
                <h3 className="text-base font-lexend font-medium text-white mt-3 line-clamp-1">
                  É assim que acaba
                </h3>
                <p className="text-sm text-[#A5A1B8] font-spartan mt-1">
                  Colleen Hoover
                </p>
                
                {/* avaliação */}
                <div className="flex items-center gap-2 mt-2">
                  <Image
                    src="/imagens/iconRecomendado.png"
                    alt="Estrela"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-base text-[#A5A1B8] font-lexend">5.0</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
