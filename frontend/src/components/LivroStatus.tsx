import { Bookmark, BookOpen, CheckCircle2, XCircle, Check } from "lucide-react";

interface LivroStatusProps {
  selectedStatus: string;
  onStatusChange: (status: string, label: string) => void;
}

export default function LivroStatus({ selectedStatus, onStatusChange }: LivroStatusProps) {
  const statuses = [
    { value: "QUERO_LER", label: "Quero ler", icon: Bookmark },
    { value: "LENDO", label: "Lendo", icon: BookOpen },
    { value: "LIDO", label: "Lido", icon: CheckCircle2 },
    { value: "ABANDONADO", label: "Abandonado", icon: XCircle }
  ];

  return (
    <div className="bg-[#181424] border border-[#3b2d63] rounded-3xl p-6 shadow-xl flex flex-col">
      <h4 className="text-base font-bold font-lexend text-white">Adicionar à sua biblioteca</h4>
      <p className="text-xs text-[#A5A1B8] font-spartan mt-0.5">Organize sua leitura como quiser.</p>

      <div className="flex flex-col gap-2.5 mt-5">
        {statuses.map(({ value, label, icon: Icon }) => {
          const isSelected = selectedStatus === value;
          return (
            <button 
              key={value}
              onClick={() => onStatusChange(value, label)}
              className={`w-full border rounded-2xl px-4 py-3 flex items-center justify-between font-lexend font-medium text-xs transition-all cursor-pointer ${
                isSelected 
                  ? "border-[#8c52ff] bg-[#1c172d]/50 text-white shadow-[0_0_15px_rgba(140,82,255,0.15)]" 
                  : "border-[#3b2d63] text-[#A5A1B8] hover:text-white hover:border-[#8c52ff] hover:bg-[#1c172d]/25"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isSelected ? "text-[#8c52ff]" : ""}`} />
                <span>{label}</span>
              </div>
              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-[#8c52ff] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-[#181424] stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

