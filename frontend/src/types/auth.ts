export interface LoginDTO
{
    email: string;
    senha: string;
}

export interface CadastroDTO extends LoginDTO {
  nome: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
  };
}
