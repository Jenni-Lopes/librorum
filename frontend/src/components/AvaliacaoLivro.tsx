import React from "react";
import { Star } from "lucide-react";

interface AvaliacaoLivroProps {
  userRating: number;
  setUserRating: (val: number) => void;
  hoverRating: number;
  setHoverRating: (val: number) => void;
  showReviewForm: boolean;
  setShowReviewForm: (val: boolean) => void;
  newReviewRating: number;
  setNewReviewRating: (val: number) => void;
  newReviewText: string;
  setNewReviewText: (val: string) => void;
  onSubmitReview: (e: React.FormEvent) => void;
  onStarRatingToast: (rating: number) => void;
}

export default function AvaliacaoLivro({
  userRating,
  setUserRating,
  hoverRating,
  setHoverRating,
  showReviewForm,
  setShowReviewForm,
  newReviewRating,
  setNewReviewRating,
  newReviewText,
  setNewReviewText,
  onSubmitReview,
  onStarRatingToast
}: AvaliacaoLivroProps) {
  return (
    <div className="bg-[#181424] border border-[#3b2d63] rounded-3xl p-6 shadow-xl flex flex-col">
      <h4 className="text-base font-bold font-lexend text-white">Avaliar este livro</h4>
      <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5">Compartilhe sua opinião com outros leitores.</p>

      {/* Estrelas para Avaliar */}
      <div className="flex items-center justify-center gap-2.5 py-4 my-2">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = hoverRating ? starValue <= hoverRating : starValue <= userRating;
          return (
            <button
              key={starValue}
              onClick={() => {
                setUserRating(starValue);
                onStarRatingToast(starValue);
              }}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform active:scale-90 hover:scale-110 cursor-pointer"
            >
              <Star 
                className={`w-8 h-8 transition-colors ${
                  isFilled 
                    ? "fill-[#8c52ff] text-[#8c52ff]" 
                    : "text-[#3b2d63] hover:text-[#8c52ff]/60"
                }`} 
              />
            </button>
          );
        })}
      </div>

      {/* Botão de abrir para avaliação do livro */}
      <button 
        onClick={() => setShowReviewForm(!showReviewForm)}
        className="w-full bg-[#8c52ff] hover:bg-[#7a44eb] text-white font-lexend font-semibold text-xs py-3 px-4 rounded-2xl transition-all shadow-[0_4px_12px_rgba(140,82,255,0.25)] hover:shadow-[0_4px_16px_rgba(140,82,255,0.4)] cursor-pointer text-center"
      >
        Escrever uma avaliação
      </button>

      {/* Escrever Avaliação */}
      {showReviewForm && (
        <form onSubmit={onSubmitReview} className="mt-4 flex flex-col gap-3 pt-4 border-t border-[#3b2d63]/40">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[#A5A1B8] font-spartan font-semibold uppercase tracking-wider">Nota (Estrelas)</label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setNewReviewRating(val)}
                  className="cursor-pointer"
                >
                  <Star className={`w-4 h-4 ${val <= newReviewRating ? "fill-[#8c52ff] text-[#8c52ff]" : "text-[#3b2d63]"}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[#A5A1B8] font-spartan font-semibold uppercase tracking-wider">Sua Opinião</label>
            <textarea
              rows={3}
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder="O que achou do livro?"
              className="bg-[#15131D] border border-[#3b2d63] rounded-xl py-2 px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#8c52ff] font-spartan resize-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#1c172d] border border-[#8c52ff]/40 hover:bg-[#271e42] hover:border-[#8c52ff] text-white font-lexend font-semibold text-[11px] py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Publicar Avaliação
          </button>
        </form>
      )}
    </div>
  );
}
