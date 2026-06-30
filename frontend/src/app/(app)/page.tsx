import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
      {/* Sidebar */}
      <aside className="w-80 bg-[#0F0C18] border-r border-[#3b2d63] flex flex-col p-6 h-full flex-shrink-0">
        
        {/* Logo */}
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

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2">
          <button className="bg-[#271E42] text-[#8c52ff] border border-[#3b2d63] rounded-xl px-4 py-3 flex items-center gap-3 w-full text-left font-lexend font-medium transition-all cursor-pointer">
            <Image
              src="/imagens/iconCasa.png"
              alt="Início"
              width={20}
              height={20}
              className="w-5 h-5 object-contain filter brightness-110"
            />
            Início
          </button>
          
          <button className="text-[#A5A1B8] hover:text-[#8c52ff] hover:bg-[#1c172d]/50 rounded-xl px-4 py-3 flex items-center gap-3 w-full text-left font-lexend font-medium transition-all cursor-pointer">
            <Image
              src="/imagens/iconLupa.png"
              alt="Buscar"
              width={20}
              height={20}
              className="w-5 h-5 object-contain opacity-70 hover:opacity-100 transition-opacity"
            />
            Buscar
          </button>

          <button className="text-[#A5A1B8] hover:text-[#8c52ff] hover:bg-[#1c172d]/50 rounded-xl px-4 py-3 flex items-center gap-3 w-full text-left font-lexend font-medium transition-all cursor-pointer">
            <Image
              src="/imagens/iconBiblio.png"
              alt="Biblioteca"
              width={20}
              height={20}
              className="w-5 h-5 object-contain opacity-70 hover:opacity-100 transition-opacity"
            />
            Biblioteca
          </button>

          <button className="text-[#A5A1B8] hover:text-[#8c52ff] hover:bg-[#1c172d]/50 rounded-xl px-4 py-3 flex items-center gap-3 w-full text-left font-lexend font-medium transition-all cursor-pointer">
            <Image
              src="/imagens/iconUser.png"
              alt="Perfil"
              width={20}
              height={20}
              className="w-5 h-5 object-contain opacity-70 hover:opacity-100 transition-opacity"
            />
            Perfil
          </button>
        </nav>

        {/* Reading Goal (Meta de Leitura) */}
        <div className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 mt-6">
          <p className="text-xs text-[#A5A1B8] font-spartan font-semibold uppercase tracking-wider">Meta de leitura</p>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-lg font-bold text-white font-lexend">50<span className="text-xs text-[#A5A1B8] font-normal">/50 livros</span></span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-full bg-[#271E42] rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-[#00E5FF] to-[#8c52ff] h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
            <span className="text-xs text-[#A5A1B8] font-spartan font-semibold">100%</span>
          </div>
        </div>

        {/* Continue Reading (Continue lendo) */}
        <div className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 mt-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#A5A1B8] font-spartan font-semibold uppercase tracking-wider">Continue lendo</span>
            <a href="#" className="text-xs text-[#8c52ff] hover:underline font-spartan font-semibold">Ver todos</a>
          </div>
          
          <div className="flex gap-4">
            {/* Book Cover */}
            <div className="w-16 h-24 rounded-lg relative overflow-hidden flex-shrink-0 border border-[#3b2d63] shadow-md">
              <Image
                src="/imagens/éAssimQueAcaba.webp"
                alt="Capa - É assim que acaba"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h4 className="text-sm font-semibold text-white font-lexend line-clamp-1">É assim que acaba</h4>
                <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5">Colleen Hoover</p>
              </div>
              <div className="mt-2">
                <p className="text-[10px] text-[#A5A1B8] font-spartan font-semibold">100% concluído</p>
                <div className="w-full bg-[#271E42] rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#00E5FF] to-[#8c52ff] h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#8c52ff] hover:bg-[#7a44eb] text-white font-lexend font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-[0_4px_12px_rgba(140,82,255,0.25)] hover:shadow-[0_4px_16px_rgba(140,82,255,0.4)] cursor-pointer">
            Continuar leitura
          </button>
        </div>

        {/* Logout (Sair) */}
        <div className="mt-auto pt-6 flex justify-center">
          <button className="text-[#A5A1B8] hover:text-[#8c52ff] p-2 rounded-lg hover:bg-[#1c172d] transition-all cursor-pointer" title="Sair">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto h-full flex flex-col bg-[#15131D]">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Buscar livro/gênero/autor" 
              className="w-full bg-[#181424] border border-[#3b2d63] rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#8c52ff] focus:ring-1 focus:ring-[#8c52ff] shadow-[0_0_15px_rgba(140,82,255,0.05)] focus:shadow-[0_0_20px_rgba(140,82,255,0.2)] transition-all font-spartan"
            />
          </div>

          {/* User profile picture */}
          <div className="w-10 h-10 rounded-full border-2 border-[#8c52ff] bg-gradient-to-tr from-[#362A67] to-[#8c52ff] flex items-center justify-center text-white font-bold font-lexend text-sm overflow-hidden cursor-pointer shadow-[0_0_10px_rgba(140,82,255,0.3)]">
            L
          </div>
        </header>

        {/* User Greeting */}
        <section className="mb-8">
          <h1 className="text-4xl font-bold font-lexend text-[#F5F3FF]">Oi, @Laura!</h1>
          <p className="text-base text-[#A5A1B8] font-spartan mt-1">Continue sua jornada literária.</p>
        </section>

        {/* Em Alta Section */}
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
              <div key={cardId} className="bg-[#181424] border border-[#3b2d63] rounded-2xl h-72 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg">
              </div>
            ))}
          </div>
        </section>

        {/* Recomendado Para Você Section */}
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

          {/* Cards Grid */}
          <div className="grid grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((cardId) => (
              <div key={cardId} className="bg-[#181424] border border-[#3b2d63] rounded-2xl h-72 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg">
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
