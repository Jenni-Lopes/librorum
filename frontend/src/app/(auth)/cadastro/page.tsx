import Image from "next/image";

export default function Cadastro() {
    return (
        <main className="fixed inset-0 flex items-center justify-center p-6 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl w-full items-center">
        
                {/* Esquerda */}
                <div className="flex flex-col items-center text-white text-center">
                    <h2 className="font-lexend text-5xl font-semibold text-[#F5F3FF] text-center mb-6">
                        CADASTRA-SE <br />AQUI
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
                    <form className="flex flex-col gap-5">

                    {/* E-mail */}
                    <div className="flex flex-col">
                        <label className="font-spartan block text-2xl font-regular text-[#F5F3FF] mb-1">
                            E-mail
                        </label>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {/* Ícone de Email */}
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <input 
                                type="email" 
                                placeholder="nome@gmail.com" 
                                className="w-full bg-[#181424] border border-[#3b2d63] rounded-md py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#8c52ff] focus:ring-1 focus:ring-[#8c52ff] shadow-[0_0_15px_rgba(140,82,255,0.1)] transition-all"
                            />
                        </div>
                    </div>

                    {/* Nome de usuário */}
                    <div className="flex flex-col">
                        <label className="font-spartan block text-2xl font-regular text-[#F5F3FF] mb-1">
                            Nome de usuário
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {/* Ícone de Usuário */}
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <input 
                        type="text" 
                        placeholder="Username" 
                        className="w-full bg-[#181424] border border-[#3b2d63] rounded-md py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#8c52ff] focus:ring-1 focus:ring-[#8c52ff] shadow-[0_0_15px_rgba(140,82,255,0.1)] transition-all"
                        />
                    </div>
                </div>

                {/* Senha */}
                <div className="flex flex-col">
                    <label className="font-spartan block text-2xl font-regular text-[#F5F3FF] mb-1">
                        Senha
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {/* Ícone de Cadeado */}
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                    <input 
                        type="password" 
                        placeholder="senha" 
                        className="w-full bg-[#181424] border border-[#3b2d63] rounded-md py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#8c52ff] focus:ring-1 focus:ring-[#8c52ff] shadow-[0_0_15px_rgba(140,82,255,0.1)] transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                        {/* Ícone de Olho */}
                        <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Confirmação de senha */}
            <div className="flex flex-col">
                <label className="font-spartan block text-2xl font-regular text-[#F5F3FF] mb-1">
                    Confirmação de senha
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {/* Ícone de Cadeado */}
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                    <input 
                    type="password" 
                    placeholder="senha" 
                    className="w-full bg-[#181424] border border-[#3b2d63] rounded-md py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#8c52ff] focus:ring-1 focus:ring-[#8c52ff] shadow-[0_0_15px_rgba(140,82,255,0.1)] transition-all"
                    />
                </div>
            </div>

            {/* Botão Cadastrar */}
            <button 
            type="button"
              className="w-full bg-[#8c52ff] hover:bg-[#7b40f2] text-[#F5F3FF] font-spartan block text-3xl tracking-wide py-2 px-4 rounded-md mt-4 transition-colors duration-200"
            >
              CADASTRAR
            </button>
        </form>
        </div>
        
      </div>
    </main>
  );
}