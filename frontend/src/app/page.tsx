import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const emAltaBooks = [
  { id: "e-assim-que-acaba", title: "É assim que acaba", author: "Colleen Hoover", rating: "5.0", cover: "/imagens/éAssimQueAcaba.webp" },
  { id: "39gDEAAAQBAJ", title: "Verity", author: "Colleen Hoover", rating: "4.8", cover: "https://books.google.com/books/content?id=39gDEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" },
  { id: "W1l_DwAAQBAJ", title: "Todas as suas imperfeições", author: "Colleen Hoover", rating: "4.7", cover: "https://books.google.com/books/content?id=W1l_DwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" },
  { id: "1_G1DwAAQBAJ", title: "O lado feio do amor", author: "Colleen Hoover", rating: "4.6", cover: "https://books.google.com/books/content?id=1_G1DwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" },
  { id: "J8pFEAAAQBAJ", title: "É assim que começa", author: "Colleen Hoover", rating: "4.9", cover: "https://books.google.com/books/content?id=J8pFEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" }
];

const recomendadoBooks = [
  { id: "K1iEDwAAQBAJ", title: "A Paciente Silenciosa", author: "Alex Michaelides", rating: "4.7", cover: "https://books.google.com/books/content?id=K1iEDwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" },
  { id: "zFDtDwAAQBAJ", title: "A Biblioteca da Meia-Noite", author: "Matt Haig", rating: "4.8", cover: "https://books.google.com/books/content?id=zFDtDwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" },
  { id: "C0lGDwAAQBAJ", title: "O Homem de Giz", author: "C. J. Tudor", rating: "4.5", cover: "https://books.google.com/books/content?id=C0lGDwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" },
  { id: "u3hGDwAAQBAJ", title: "Flores para Algernon", author: "Daniel Keyes", rating: "4.9", cover: "https://books.google.com/books/content?id=u3hGDwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" },
  { id: "3R9CDAAAQBAJ", title: "Mentirosos", author: "E. Lockhart", rating: "4.4", cover: "https://books.google.com/books/content?id=3R9CDAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" }
];

export default function Home() {
  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#15131D] text-[#F5F3FF]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 p-8 overflow-y-auto h-full flex flex-col bg-[#15131D] no-scrollbar">
        
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
            {emAltaBooks.map((book) => (
              <Link 
                href={`/livro/${book.id}`} 
                key={book.id} 
                className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg flex flex-col group"
              >
                {/* Capa do Livro */}
                <div className="relative aspect-2/3 w-full max-w-40 mx-auto rounded-xl overflow-hidden border border-[#3b2d63]/50 shadow-md group-hover:scale-[1.02] transition-transform duration-200">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 200px"
                    className="object-cover"
                  />
                </div>
                
                {/* info */}
                <h3 className="text-base font-lexend font-medium text-white mt-3 line-clamp-1 group-hover:text-[#8c52ff] transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-[#A5A1B8] font-spartan mt-1">
                  {book.author}
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
                  <span className="text-base text-[#A5A1B8] font-lexend">{book.rating}</span>
                </div>
              </Link>
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

          {/* Cards Grid */}
          <div className="grid grid-cols-5 gap-6">
            {recomendadoBooks.map((book) => (
              <Link 
                href={`/livro/${book.id}`} 
                key={book.id} 
                className="bg-[#181424] border border-[#3b2d63] rounded-2xl p-4 hover:border-[#8c52ff] hover:bg-[#1f1a30] transition-all cursor-pointer shadow-lg flex flex-col group"
              >
                {/* Capa do Livro */}
                <div className="relative aspect-2/3 w-full max-w-40 mx-auto rounded-xl overflow-hidden border border-[#3b2d63]/50 shadow-md group-hover:scale-[1.02] transition-transform duration-200">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 200px"
                    className="object-cover"
                  />
                </div>
                
                {/* info */}
                <h3 className="text-base font-lexend font-medium text-white mt-3 line-clamp-1 group-hover:text-[#8c52ff] transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-[#A5A1B8] font-spartan mt-1">
                  {book.author}
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
                  <span className="text-base text-[#A5A1B8] font-lexend">{book.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
