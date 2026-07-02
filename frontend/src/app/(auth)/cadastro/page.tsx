"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, User, Lock, Eye, EyeOff } from "lucide-react";
import { cadastroSchema } from "@/schemas/cadastro.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cadastro } from "@/services/auth.service";

export default function Cadastro() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [confSenha, setConfSenha] = useState("");

    const handleSubmit = async(e: React.SyntheticEvent) => {

        const router = useRouter();
        e.preventDefault();

        const result = cadastroSchema.safeParse({
            email,
            senha,
            confSenha
        });

        if(!result.success){
            toast.error(result.error.issues[0].message);
            return;
        }

        try {
            await cadastro({email,senha});
            toast.success("Usuário criado com sucesso");
            router.push("/");

        } catch (error){
            toast.error("Usuário ou senha inválidos");
        }

    }

    return (
        <main className="fixed inset-0 flex items-center justify-center p-6 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl w-full items-center">

                {/* Esquerda */}
                <div className="flex flex-col items-center text-white text-center">
                    <h2 className="font-lexend text-5xl font-semibold text-[#F5F3FF] text-center mb-6">
                        CADASTRE-SE <br />AQUI
                    </h2>

                    <div className="flex flex-col items-center w-full">
                        <Image
                            src="/icones/logoCadastro.png"
                            alt="Logo Librorum"
                            width={380}
                            height={200}
                            priority
                            style={{ width: 'auto', height: 'auto' }}
                            className="mb-4"
                        />

                        <p className="font-spartan block text-3xl font-regular text-[#F5F3FF] mb-1">
                            Descubra histórias.<br />Compartilhe emoções.
                        </p>
                    </div>
                </div>

                {/* Direita */}
                <div className="w-full max-w-sm mx-auto">
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

                        {/* E-mail */}
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

                        {/* Nome de usuário */}
                        <div className="w-full">
                            <label className="font-spartan block text-3xl font-regular text-[#F5F3FF] mb-1">
                                Nome de usuário
                            </label>
                            <div className="relative flex items-center w-full">
                                <User className="absolute left-6 text-[#A1A1AA] w-6 h-6 pointer-events-none" />
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Username"
                                    className="font-spartan text-lg w-full pl-14 pr-4 py-3 bg-transparent border-2 border-[#8B5CF6]/60 rounded-xl text-white placeholder-[#A1A1AA] outline-none transition-all duration-300 drop-shadow-[3px_3px_20px_rgba(124,58,237,0.3)] focus:border-[#a78bfa]"
                                />
                            </div>
                        </div>

                        {/* Senha */}
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

                        {/* Confirmação de senha */}
                        <div className="w-full">
                            <label className="font-spartan block text-3xl font-regular text-[#F5F3FF] mb-1">
                                Confirmação de senha
                            </label>
                            <div className="relative flex items-center w-full">
                                <Lock className="absolute left-6 text-[#A1A1AA] w-6 h-6 pointer-events-none" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confSenha}
                                    onChange={(e) => setConfSenha(e.target.value)}
                                    placeholder="confirmar senha"
                                    className="font-spartan text-lg w-full pl-14 pr-12 py-3 bg-transparent border-2 border-[#8B5CF6]/60 rounded-xl text-white placeholder-[#A1A1AA] outline-none transition-all duration-300 drop-shadow-[3px_3px_20px_rgba(124,58,237,0.3)] focus:border-[#a78bfa]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 text-[#A1A1AA] hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>

                        {/* Botão Cadastrar */}
                        <button
                            type="submit"
                            className="font-spartan w-full mt-6 py-2.5 px-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#F5F3FF] text-4xl font-medium rounded-lg hover:shadow-lg transition-all duration-200 shadow-[0_0_30px_rgba(139,92,246,0.35)]"
                        >
                            CADASTRAR
                        </button>
                    </form>

                    <p className="mt-8 text-xl text-[#F5F3FF] text-center">
                        Já tem uma conta?{" "}
                        <a
                            href="/login"
                            className="font-light text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
                        >
                            Entre agora
                        </a>
                    </p>
                </div>

            </div>
        </main>
    );
}