"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sair } from "@/services/auth.service";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await sair();

      toast.success("Logout realizado");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Erro ao realizar logout");
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-[#A5A1B8] hover:text-[#8c52ff] p-3 rounded-xl hover:bg-[#1c172d] transition-all cursor-pointer"
      title="Sair"
    >
      <Image
        src="/imagens/iconSair.png"
        alt="Sair"
        width={40}
        height={40}
        className="w-8 h-8 object-contain opacity-70 hover:opacity-100 transition-opacity"
      />
    </button>
  );
}