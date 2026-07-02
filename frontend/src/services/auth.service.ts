import { LoginDTO, LoginResponse } from "@/types/auth";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function login(dados: LoginDTO) : Promise<LoginResponse>
{
    const response = await fetch(`${API_URL}/auth/login`,{
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
    });

    if(!response.ok){
        throw new Error(
            "Usuário ou senha inválidas"
        );
    }

    return response.json();
}


export async function cadastro(dados: LoginDTO): Promise<void>
{
    
    const response = await fetch(`${API_URL}/auth/cadastro`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
    });

    if(!response.ok){
        throw new Error(
            "Error ao criar usuário(a)"
    );
    }

}

export async function sair(): Promise<void>
{
    const response = await fetch(`${API_URL}/auth/sair`,
        {
            method: "POST",
            credentials: "include"
        }
    );

    if(!response.ok){
        throw new Error(
            "Error ao sair"
        );
    }

}