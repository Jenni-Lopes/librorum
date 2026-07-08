# Librorum

O **Librorum** é uma plataforma web para organização e acompanhamento pessoal de leitura. Com ele, os usuários podem gerenciar sua própria biblioteca virtual, escrever resenhas/dar notas e definir metas de leitura anuais. A aplicação conta também com integração à API externa do Google Books para busca e detalhamento automatizado de obras.

Este projeto foi desenvolvido como o Trabalho Final para a disciplina **XDES03 – Programação Web** da **Universidade Federal de Itajubá (UNIFEI)**, sob a orientação do Prof. Phyllipe de Souza Lima Francisco.

---

## Demonstração (Screenshots do Sistema)

### 1. Tela de Login e Cadastro de Usuário
*Interface para autenticação de usuários, contendo validações completas de campos vazios, formato de e-mail e tamanho mínimo de senha utilizando a biblioteca Zod.*

![Tela de cadastro](prints/loginPrint.png )
![Tela de login](prints/CadastresePrint.png)

### 2. Biblioteca Virtual (Painel Principal)
*Exibição dos livros salvos na coleção do usuário, com nota pessoal e status de leitura (Quero Ler, Lendo, Lido, Abandonado).*

![Biblioteca](prints/bibliotecaPrint.png)

### 3. Busca de Livros (Integração com API Externa)
*Tela de busca de livros que consome a API do Google Books para exibição rápida de títulos, autores, páginas e capas.*

![Tela de busca](prints/buscaPrint.png)
![Tela do livro](prints/livroPrint.png)

### 4. Perfil
*Espaço para acompanhar as metas de leitura e gerenciar o CRUD de avaliações escritas de cada livro.*
![Tela de perfil](prints/perfilPrint.png)
![Tela com resenha](prints/resenhaPrint.png)

---

## 📁 Estrutura do Projeto

```text
librorum/
├── frontend/   # Aplicação Next.js (Interface do usuário)
└── backend/    # API REST Express (Regras de negócio, autenticação e banco de dados SQLite)
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 16** (Framework Fullstack/React)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4** (Estilização responsiva)
- **Zod** (Validação estruturada de formulários)
- **Sonner** (Notificações toast de sucesso/erro)
- **Lucide React** (Pacote de ícones de interface)

### Backend
- **Node.js** (Ambiente de execução)
- **Express 5** (Roteador e middleware)
- **TypeScript** (Tipagem estática)
- **Prisma ORM 6** (Acesso e modelagem do banco de dados)
- **SQLite** (Banco de dados relacional leve baseado em arquivo)
- **JSON Web Tokens (JWT)** (Controle de sessões e autenticação)
- **Bcrypt** (Criptografia e hashing seguro de senhas)
- **Axios** (Requisições HTTP para a API externa do Google Books)
- **Cookie Parser** (Tratamento e leitura de cookies)

---

## 🚀 Como Executar o Projeto

Siga as instruções abaixo para preparar o ambiente e rodar o projeto localmente.


### Passo 1: Configurando o Backend

1. Entre no diretório do backend:
   ```bash
   cd backend
   ```

2. Instale todas as dependências do servidor:
   ```bash
   npm install
   ```

3. Configure o arquivo de variáveis de ambiente:
   Crie ou edite o arquivo `.env` na raiz da pasta `/backend` e adicione o seguinte conteúdo:
   ```env
   # URL de conexão com o banco de dados SQLite local
   DATABASE_URL="file:./app.db"

   # Chave secreta para assinatura dos tokens de sessão JWT
   JWT_SECRET="uma_chave_secreta_qualquer"

   # Chave de API opcional do Google Books (obtenha no Google Cloud Console se desejar)
   GOOGLE_BOOKS_API_KEY="AIzaSyDzdyUJsAaTGdO9TxIkxUimvtnbUs-raPs"
   ```

4. Prepare o Banco de Dados (Prisma):
   Gere o Prisma Client e rode as migrações/sincronizações para estruturar o banco de dados SQLite:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Inicie o servidor do backend em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   
---

### Passo 2: Configurando o Frontend

1. Abra outro terminal e vá para o diretório do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências da interface:
   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento do frontend:
   ```bash
   npm run dev
   ```
  
---

## 👥 Equipe

- **Jennifer Lopes** - [GitHub Profile](https://github.com/Jenni-Lopes)
- **Júlia Garcia** - [GitHub Profile](https://github.com/juliagarcias)
- **Yasmin Araújo** - [GitHub Profile](https://github.com/Y-Yasmin)

