import { Star } from "lucide-react";

interface Review {
  id: number;
  user: string;
  date: string;
  rating: number;
  text: string;
  useful: number;
  hasLiked: boolean;
}

interface AvaliacoesProps {
  reviews: Review[];
}

export default function Avaliacoes({ reviews }: AvaliacoesProps) {
  return (
    <div className="bg-[#181424] border border-[#3b2d63] rounded-3xl p-6 mt-10 shadow-xl">
      
      {/* Header das avaliações */}
      <div className="flex justify-between items-center border-b border-[#3b2d63]/40 pb-5 mb-6">
        <h2 className="text-lg font-bold font-lexend text-white flex items-baseline gap-2">
          Avaliações dos leitores
          <span className="text-xs text-[#A5A1B8] font-normal font-spartan">
            {reviews.length} avaliações
          </span>
        </h2>
      </div>

      {/* Lista de Avaliações */}
      <div className="flex flex-col gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col border-b border-[#3b2d63]/20 pb-5 last:border-0 last:pb-0">
            
            {/* Info do usuário, data e estrelas */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Mock Avatar */}
                <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#3b2d63] to-[#8c52ff]/60 flex items-center justify-center text-white font-bold font-lexend text-xs">
                  {review.user[0].toUpperCase()}
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white font-lexend">{review.user}</h5>
                  <span className="text-[10px] text-[#A5A1B8] font-spartan">{review.date}</span>
                </div>
              </div>

              {/* Estrelas */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <Star 
                    key={starIdx} 
                    className={`w-3.5 h-3.5 ${
                      starIdx <= review.rating 
                        ? "fill-[#8c52ff] text-[#8c52ff]" 
                        : "text-[#3b2d63]"
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* Texto da avaliação */}
            <p className="text-sm text-[#A5A1B8] font-spartan leading-relaxed mt-3">
              {review.text}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
