# Librorum

O **Librorum** é uma plataforma web para organização e acompanhamento pessoal de leitura. Com ele, os usuários podem gerenciar sua própria biblioteca virtual, registrar o progresso de leitura de cada obra (páginas lidas e percentual), escrever resenhas/dar notas e definir metas de leitura anuais. A aplicação conta também com integração à API externa do Google Books para busca e detalhamento automatizado de obras.

Este projeto foi desenvolvido como o Trabalho Final para a disciplina **XDES03 – Programação Web** da **Universidade Federal de Itajubá (UNIFEI)**, sob a orientação do Prof. Phyllipe de Souza Lima Francisco.

---

## Demonstração (Screenshots do Sistema)

Adicione aqui as imagens do sistema para ilustrar o funcionamento da aplicação conforme os requisitos do trabalho:

### 1. Tela de Login e Cadastro de Usuário
*Interface para autenticação de usuários, contendo validações completas de campos vazios, formato de e-mail e tamanho mínimo de senha utilizando a biblioteca Zod.*


### 2. Biblioteca Virtual (Painel Principal)
*Exibição dos livros salvos na coleção do usuário, com indicador de progresso percentual, nota pessoal e status de leitura (Quero Ler, Lendo, Lido, Abandonado).*



### 3. Busca de Livros (Integração com API Externa)
*Tela de busca de livros que consome a API do Google Books para exibição rápida de títulos, autores, páginas e capas.*



### 4. Resenhas (Reviews) e Metas de Leitura
*Espaço para acompanhar as metas de leitura e gerenciar o CRUD de avaliações escritas de cada livro.*


---

## ⚙️ Critérios e Requisitos Técnicos Atendidos

* **Aplicação Web:** Executa diretamente no navegador com interface reativa.
* **Tela de Login e Cadastro de Usuário(a):** Validações com a biblioteca Zod (campos obrigatórios, e-mail válido, senhas com confirmação e mínimo de 4 caracteres).
* **Rotas Privadas:** Bloqueio de acesso forçado utilizando tokens de validação baseados em **JSON Web Tokens (JWT)**.
* **Framework Frontend:** Next.js (React).
* **Framework Backend:** Node.js com Express e TypeScript.
* **CRUD Completo:** Implementação de operações de Criar, Ler, Atualizar e Deletar (CRUD) de livros, metas e avaliações utilizando o banco de dados **SQLite** configurado através do **Prisma ORM**.
* **E-mail Único:** Validação no banco de dados e no servidor para garantir a unicidade de e-mail no cadastro de usuários.
* **Integração com API Externa:** Busca dinâmica de dados integrando-se com a API do **Google Books**.

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

### Pré-requisitos
Instale em seu computador:
1. [Node.js](https://nodejs.org/) 
2. O gerenciador de pacotes NPM (instalado por padrão com o Node.js).

---

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