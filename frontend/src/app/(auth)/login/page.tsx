"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginSchema } from "@/schemas/login.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async(e: React.SyntheticEvent) => {
  
          e.preventDefault();
  
          const result = loginSchema.safeParse({
              email,
              senha,
          });
  
          if(!result.success){
              toast.error(result.error.issues[0].message);
              return;
          }
  
          try {
              await login({email,senha});
              toast.success("Login feito com sucesso");
              router.push("/");

              router.refresh();
  
          } catch (error) {
              const mensagem = error instanceof Error ? error.message : "Usuário ou senha inválidos";
              toast.error(mensagem);
          }
  
      }

  return (
    <div className="flex flex-col items-center w-full">
      <Image
        src="/icones/logoLogin.png"
        alt="Logo Librorum"
        width={360}
        height={310}
        priority
        className="mb-8"
      />

      <h2 className="font-lexend text-5xl font-semibold text-[#F5F3FF] text-center mb-6">
        LOGIN
      </h2>

      <form className="max-w-md w-full flex flex-col items-center space-y-4" onSubmit={handleSubmit}>
        <div className="w-full">
          <label className="font-spartan block text-3xl font-regular text-[#F5F3FF] mb-1">
            E-mail
          </label>
          <div className="relative flex items-center w-full">
            <Mail className="absolute left-6 text-[#A1A1AA] w-6 h-6 pointer-events-none" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@gmail.com"
              className="font-spartan text-lg w-full pl-14 pr-4 py-3 bg-transparent border-2 border-[#8B5CF6]/60 rounded-xl text-white placeholder-[#A1A1AA] outline-none transition-all duration-300 drop-shadow-[3px_3px_20px_rgba(124,58,237,0.3)] focus:border-[#a78bfa]"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="font-spartan block text-3xl font-regular text-[#F5F3FF] mb-1">
            Senha
          </label>
          <div className="relative flex items-center w-full">
            <Lock className="absolute left-6 text-[#A1A1AA] w-6 h-6 pointer-events-none" />

            <input
              type={showPassword ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="senha"
              className="font-spartan text-lg w-full pl-14 pr-12 py-3 bg-transparent border-2 border-[#8B5CF6]/60 rounded-xl text-white placeholder-[#A1A1AA] outline-none transition-all duration-300 drop-shadow-[3px_3px_20px_rgba(124,58,237,0.3)] focus:border-[#a78bfa]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-[#A1A1AA] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="font-spartan w-full mt-10 py-2.5 px-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#F5F3FF] text-4xl font-medium rounded-lg hover:shadow-lg transition-all duration-200 shadow-[0_0_30px_rgba(139,92,246,0.35)] "
        >
          ENTRAR
        </button>
      </form>

      <p className="mt-8 text-xl text-[#F5F3FF] text-center">
        Não tem conta?{" "}
        <a
          href="/cadastro"
          className="font-light text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
        >
          Crie agora
        </a>
      </p>
    </div>
  );
}
