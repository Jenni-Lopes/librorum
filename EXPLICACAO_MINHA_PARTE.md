# Explicacao da minha parte - Frontend: Perfil e Tela do Livro

Este documento explica a minha parte do trabalho no Librorum, com foco no frontend das telas:

- Tela de Perfil: `frontend/src/app/perfil/page.tsx`
- Tela de Livro: `frontend/src/app/livro/[id]/page.tsx`

Tambem explica o fluxo completo das funcionalidades dessas telas: de onde a requisicao parte no frontend, onde ela chega no backend, como passa pela autenticacao, onde e tratada, como acessa o banco de dados e como os dados voltam para a interface.

---

## 1. Visao geral do projeto

O projeto e dividido em duas partes principais:

- `frontend/`: interface do usuario feita com Next.js, React e TypeScript.
- `backend/`: API REST feita com Express, TypeScript, Prisma e SQLite.

O frontend nao acessa o banco de dados diretamente. Sempre que precisa buscar, salvar, atualizar ou remover alguma informacao, ele chama uma rota do backend usando `fetch`.

O backend recebe a requisicao, valida os dados, verifica autenticacao quando necessario, chama um service e o service usa o Prisma para acessar o banco SQLite.

Fluxo geral:

```text
Usuario clica/interage na tela
-> componente React chama uma funcao
-> funcao chama um service do frontend
-> service faz fetch para a API
-> backend recebe em uma rota Express
-> middleware de autenticacao valida o token
-> controller valida entrada e organiza resposta
-> service do backend executa regra de negocio
-> Prisma acessa o banco SQLite ou Google Books
-> resposta volta para o frontend
-> estado React e atualizado
-> tela renderiza os dados atualizados
```

---

## 2. Roteamento de paginas no frontend

O projeto usa o App Router do Next.js. Nesse modelo, a estrutura de pastas dentro de `frontend/src/app` define as rotas da aplicacao.

Rotas principais:

- `frontend/src/app/page.tsx` vira a rota `/`.
- `frontend/src/app/perfil/page.tsx` vira a rota `/perfil`.
- `frontend/src/app/livro/[id]/page.tsx` vira uma rota dinamica `/livro/:id`.
- `frontend/src/app/(auth)/login/page.tsx` vira `/login`.
- `frontend/src/app/(auth)/cadastro/page.tsx` vira `/cadastro`.

A pasta `[id]` indica parametro dinamico. Entao, se o usuario acessa:

```text
/livro/abc123
```

o valor `abc123` e recebido pela pagina do livro como `id`.

Na tela do livro, isso acontece em:

```ts
export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookId } = use(params);
}
```

O `bookId` e o identificador do livro vindo do Google Books. Ele e usado para buscar detalhes, avaliacoes e salvar o livro na biblioteca.

---

## 3. Autenticacao e rotas protegidas

### Onde e feita a autenticacao no frontend?

A autenticacao do frontend fica principalmente em:

- `frontend/src/services/auth.service.ts`
- `frontend/src/middleware.ts`

Quando o usuario faz login, a funcao `login` envia email e senha para o backend:

```ts
fetch(`${API_URL}/auth/login`, {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(dados),
});
```

Se o backend retorna sucesso, o frontend salva:

- o token em `localStorage`, com a chave `librorum:token`;
- os dados do usuario em `localStorage`, com a chave `librorum:user`;
- o token tambem em cookie, com a chave `librorum:token`.

Isso esta em:

```ts
localStorage.setItem(TOKEN_KEY, data.token);
localStorage.setItem(USER_KEY, JSON.stringify(data.user));
document.cookie = `${TOKEN_KEY}=${data.token}; path=/; max-age=${TOKEN_MAX_AGE_SECONDS}; SameSite=Lax`;
```

### Como o cliente acessa uma rota protegida?

Existem duas protecoes diferentes:

1. Protecao de paginas no frontend.
2. Protecao de rotas da API no backend.

No frontend, o arquivo `frontend/src/middleware.ts` protege as paginas:

```ts
const privateRoutes = ["/", "/livro", "/perfil"];
const authRoutes = ["/login", "/cadastro"];
```

Se o usuario tentar acessar `/`, `/livro/...` ou `/perfil` sem token no cookie, ele e redirecionado para `/login`.

```ts
if (isPrivateRoute && !token) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

Se o usuario ja estiver logado e tentar acessar `/login` ou `/cadastro`, ele e redirecionado para `/`.

```ts
if (isAuthRoute && token) {
  return NextResponse.redirect(new URL("/", request.url));
}
```

### Como o token entra na requisicao?

Nos services do frontend, existe a funcao `getAuthHeaders`, em:

```text
frontend/src/services/auth.service.ts
```

Ela pega o token salvo no `localStorage`:

```ts
const token = localStorage.getItem("librorum:token");
```

Depois monta o cabecalho:

```ts
Authorization: `Bearer ${token}`
```

Assim, quando uma tela chama uma rota protegida, o frontend manda:

```text
Authorization: Bearer <token>
```

Exemplo em `goal.ts`:

```ts
fetch(`${API_URL}/goals/current`, {
  credentials: "include",
  headers: getAuthHeaders(),
});
```

Exemplo em `review.ts`:

```ts
fetch(`${API_URL}/reviews`, {
  method: "POST",
  credentials: "include",
  headers: {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ googleBookId, rating, text }),
});
```

### Onde o backend valida esse token?

No backend, a validacao do token fica em:

```text
backend/src/middlewares/auth.middleware.ts
```

O middleware tenta encontrar o token de duas formas:

- em `req.cookies.token`;
- no header `Authorization: Bearer <token>`.

```ts
let token = req.cookies.token;

if (!token && req.headers.authorization) {
  const parts = req.headers.authorization.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    token = parts[1];
  }
}
```

Depois ele valida com JWT:

```ts
const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
res.locals.user = payload;
next();
```

O `res.locals.user` guarda os dados do usuario autenticado para os controllers usarem depois.

### Quais rotas do backend sao protegidas?

Em `backend/src/app.ts`:

```ts
app.use("/auth", userRoutes);
app.use("/books", authMiddleware, bookRoutes);
app.use("/library", authMiddleware, libraryRoutes);
app.use("/reviews", authMiddleware, reviewRoutes);
app.use("/goals", authMiddleware, goalRoutes);
```

Ou seja:

- `/auth` nao usa `authMiddleware`, porque login e cadastro precisam ser acessiveis sem login.
- `/books`, `/library`, `/reviews` e `/goals` usam `authMiddleware`, entao precisam de token valido.

---

## 4. Tela de Perfil

Arquivo principal:

```text
frontend/src/app/perfil/page.tsx
```

A tela de perfil mostra:

- dados do usuario logado;
- estatisticas da biblioteca;
- meta anual de leitura;
- progresso da meta;
- lista de resenhas feitas pelo usuario;
- botao para remover resenha.

Ela usa tambem:

- `frontend/src/components/Sidebar.tsx`
- `frontend/src/components/Header.tsx`
- `frontend/src/components/CardResenhaPerfil.tsx`
- `frontend/src/services/goal.ts`
- `frontend/src/services/book.ts`
- `frontend/src/services/review.ts`

### 4.1 Estados da tela de Perfil

Na tela de perfil existem alguns estados principais:

```ts
const [usuario] = useState<Usuario | null>(getUsuario);
const [abaAtiva, setAbaAtiva] = useState<AbaPerfil>("metas");
const [meta, setMeta] = useState("");
const [biblioteca, setBiblioteca] = useState<LivroBiblioteca[]>([]);
const [resenhas, setResenhas] = useState<ReviewApi[]>([]);
```

O que cada estado guarda:

- `usuario`: nome e email do usuario logado, lidos do `localStorage`.
- `abaAtiva`: controla se a tela mostra a aba "Metas" ou "Resenhas".
- `meta`: valor digitado ou carregado da meta anual.
- `biblioteca`: livros que o usuario salvou na biblioteca.
- `resenhas`: avaliacoes/resenhas que o usuario escreveu.

### 4.2 De onde vem o nome e email do usuario?

A funcao `getUsuario` le os dados do usuario no navegador:

```ts
const dadosUsuario = localStorage.getItem("librorum:user");
```

Esses dados foram salvos no login, em `auth.service.ts`.

Se o JSON estiver valido, a funcao retorna o usuario. Se estiver quebrado, remove o item do `localStorage`.

```ts
try {
  return dadosUsuario ? JSON.parse(dadosUsuario) : null;
} catch {
  localStorage.removeItem("librorum:user");
  return null;
}
```

Na tela, se nao tiver usuario, aparecem valores padrao:

```ts
const nome = usuario?.nome ?? "Usuario";
const email = usuario?.email ?? "E-mail nao informado";
```

### 4.3 O que acontece quando a tela de Perfil abre?

Quando a tela carrega, o `useEffect` executa a funcao `carregarDadosPerfil`.

```ts
useEffect(() => {
  async function carregarDadosPerfil() {
    const [livros, avaliacoes, metaAtual] = await Promise.all([
      listarBiblioteca(),
      listarMinhasAvaliacoes(),
      buscarMetaAtual(),
    ]);

    setBiblioteca(livros);
    setResenhas(avaliacoes);
    setMeta(metaAtual.target ? String(metaAtual.target) : "");
  }

  carregarDadosPerfil();
}, []);
```

O `Promise.all` faz tres requisicoes ao mesmo tempo:

- `listarBiblioteca()`: busca os livros salvos do usuario.
- `listarMinhasAvaliacoes()`: busca as resenhas feitas pelo usuario.
- `buscarMetaAtual()`: busca a meta anual do usuario.

Depois a tela atualiza seus estados com `setBiblioteca`, `setResenhas` e `setMeta`.

### 4.4 Fluxo: carregar biblioteca no Perfil

Frontend:

```text
perfil/page.tsx
-> listarBiblioteca()
-> frontend/src/services/book.ts
-> GET /library
```

Service do frontend:

```ts
export const listarBiblioteca = getBiblioteca;
```

`getBiblioteca` chama:

```ts
fetch(`${API_URL}/library`, {
  credentials: "include",
  headers: getHeaders(cookieHeader),
});
```

Backend:

```text
backend/src/app.ts
-> /library passa pelo authMiddleware
-> backend/src/routes/library.route.ts
-> router.get("/", minhaBiblioteca)
-> backend/src/controllers/library.controller.ts
-> minhaBiblioteca()
-> backend/src/services/library.service.ts
-> listarBibliotecaService(userId)
-> Prisma consulta a tabela Library
```

O controller pega o usuario logado:

```ts
const usuario = res.locals.user as AuthPayload | undefined;
return usuario?.id;
```

O service consulta apenas os livros desse usuario:

```ts
return await prisma.library.findMany({
  where: {
    userId,
  },
  orderBy: {
    createdAt: "desc",
  },
});
```

Isso garante que um usuario nao ve a biblioteca do outro.

### 4.5 Como as estatisticas do Perfil sao calculadas?

As estatisticas nao vem prontas do backend. Elas sao calculadas no frontend usando o array `biblioteca`.

```ts
const totalLivros = biblioteca.length;
const lendoAgora = biblioteca.filter((livro) => livro.status === "READING").length;
const livrosLidos = biblioteca.filter((livro) => livro.status === "FINISHED").length;
const queroLer = biblioteca.filter((livro) => livro.status === "WANT_TO_READ").length;
```

Status possiveis:

- `WANT_TO_READ`: quero ler.
- `READING`: lendo.
- `FINISHED`: lido.
- `DROPPED`: abandonado.

Esses status existem tambem no Prisma:

```prisma
enum ReadingStatus {
  WANT_TO_READ
  READING
  FINISHED
  DROPPED
}
```

Os cards sao montados no array `estatisticas`:

```ts
const estatisticas = [
  { titulo: "Total de Livros", valor: totalLivros, icone: BookOpen },
  { titulo: "Lendo Agora", valor: lendoAgora, icone: BookMarked },
  { titulo: "Livros Lidos", valor: livrosLidos, icone: CheckCircle2 },
  { titulo: "Quero Ler", valor: queroLer, icone: Bookmark },
];
```

Depois a tela faz `map` nesse array para renderizar os cards.

### 4.6 Funcionalidade: meta anual de leitura

A aba de metas permite informar quantos livros o usuario quer ler no ano.

O input controla o estado `meta`:

```ts
<input
  id="meta"
  type="number"
  value={meta}
  onChange={(e) => setMeta(e.target.value)}
/>
```

Quando clica em "Salvar", chama:

```ts
onClick={handleSalvarMeta}
```

### 4.7 Fluxo: salvar meta

Na tela:

```ts
async function handleSalvarMeta() {
  const valorMeta = Number(meta);

  if (!Number.isInteger(valorMeta) || valorMeta < 1) {
    return;
  }

  const metaSalva = await salvarMetaAtual(valorMeta);
  setMeta(String(metaSalva.target));
}
```

Primeiro converte o texto do input para numero. Se nao for inteiro ou for menor que 1, nao salva.

Depois chama o service:

```text
frontend/src/services/goal.ts
-> salvarMetaAtual(target)
-> PUT /goals/current
```

O body enviado:

```json
{
  "target": 12
}
```

No backend:

```text
backend/src/app.ts
-> /goals passa pelo authMiddleware
-> backend/src/routes/goal.route.ts
-> router.put("/current", salvarMetaAtual)
-> backend/src/controllers/goal.controller.ts
-> salvarMetaAtual()
-> backend/src/services/goal.service.ts
-> salvarMetaAtualService(userId, year, target)
-> Prisma faz upsert na tabela Goal
```

O controller valida:

```ts
if (!Number.isInteger(target) || target < 1 || target > 999) {
  return res.status(400).json({
    erro: "Meta invalida.",
  });
}
```

O service persiste com `upsert`:

```ts
return await prisma.goal.upsert({
  where: {
    userId_year: {
      userId,
      year,
    },
  },
  update: {
    target,
  },
  create: {
    userId,
    year,
    target,
  },
});
```

`upsert` significa:

- se ja existe meta daquele usuario naquele ano, atualiza;
- se nao existe, cria.

No banco, a tabela `Goal` tem:

```prisma
model Goal {
  id        Int      @id @default(autoincrement())
  year      Int
  target    Int
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, year])
}
```

A regra `@@unique([userId, year])` impede que o mesmo usuario tenha duas metas para o mesmo ano.

### 4.8 Como o progresso da meta e calculado?

O progresso e calculado no frontend:

```ts
const metaNumerica = Number(meta) || 0;
const percentualMeta =
  metaNumerica > 0 ? Math.min(100, Math.round((livrosLidos / metaNumerica) * 100)) : 0;
```

Exemplo:

- meta = 10 livros;
- livros lidos = 3;
- percentual = 30%.

O `Math.min(100, ...)` limita a barra a no maximo 100%.

A barra visual usa:

```ts
style={{ width: `${percentualMeta}%` }}
```

### 4.9 Atualizacao da meta na Sidebar

Depois que a meta e salva, a tela dispara um evento customizado:

```ts
window.dispatchEvent(
  new CustomEvent("librorum:meta-atualizada", {
    detail: { target: metaSalva.target },
  })
);
```

A `Sidebar` escuta esse evento:

```ts
window.addEventListener("librorum:meta-atualizada", atualizarMeta);
```

Assim, quando a meta muda no perfil, a barra da sidebar tambem atualiza.

### 4.10 Funcionalidade: aba de resenhas no Perfil

A aba ativa fica no estado:

```ts
const [abaAtiva, setAbaAtiva] = useState<AbaPerfil>("metas");
```

Os botoes mudam esse estado:

```ts
onClick={() => setAbaAtiva(id)}
```

Se `abaAtiva === "metas"`, mostra meta.

Se `abaAtiva === "resenhas"`, mostra resenhas.

### 4.11 Fluxo: listar minhas resenhas

Quando o perfil abre, chama:

```ts
listarMinhasAvaliacoes()
```

Service frontend:

```text
frontend/src/services/review.ts
-> GET /reviews/me
```

Backend:

```text
backend/src/app.ts
-> /reviews passa pelo authMiddleware
-> backend/src/routes/review.route.ts
-> router.get("/me", listarMinhasReviews)
-> backend/src/controllers/review.controller.ts
-> listarMinhasReviews()
-> backend/src/services/review.service.ts
-> listarReviewsUsuarioService(userId)
-> Prisma consulta Review por userId
```

O service:

```ts
return await prisma.review.findMany({
  where: {
    userId,
  },
  orderBy: {
    updatedAt: "desc",
  },
  select: {
    id: true,
    googleBookId: true,
    userId: true,
    rating: true,
    text: true,
    createdAt: true,
    updatedAt: true,
    user: {
      select: {
        nome: true,
      },
    },
  },
});
```

### 4.12 Como o Perfil descobre o nome do livro em cada resenha?

As resenhas guardam `googleBookId`, mas a biblioteca guarda os dados do livro.

Na hora de renderizar cada resenha, a tela faz:

```ts
const livro = biblioteca.find(
  (item) => item.googleBookId === resenha.googleBookId
);
```

Depois passa para o componente:

```tsx
<CardResenhaPerfil
  key={resenha.id}
  resenha={resenha}
  livro={livro}
  onDelete={handleDeletarResenha}
/>
```

Se encontrar o livro, o card mostra `livro.titulo`.

Se nao encontrar, mostra:

```text
Livro avaliado
```

### 4.13 Funcionalidade: remover resenha no Perfil

O botao de remover fica no componente:

```text
frontend/src/components/CardResenhaPerfil.tsx
```

Ele chama:

```ts
onClick={() => onDelete(resenha.id)}
```

No Perfil, `onDelete` e `handleDeletarResenha`.

```ts
async function handleDeletarResenha(id: number) {
  await deletarAvaliacao(id);
  setResenhas((resenhasAtuais) =>
    resenhasAtuais.filter((resenha) => resenha.id !== id)
  );
}
```

Fluxo:

```text
CardResenhaPerfil
-> handleDeletarResenha(id)
-> deletarAvaliacao(id)
-> DELETE /reviews/:id
-> backend review route
-> review controller
-> review service
-> Prisma deleta Review
-> frontend remove a resenha do estado
```

No backend, antes de deletar, o service verifica se a resenha pertence ao usuario logado:

```ts
const review = await prisma.review.findFirst({
  where: {
    id,
    userId,
  },
});
```

Se nao encontrar, retorna erro. Isso impede o usuario de apagar resenha de outra pessoa.

---

## 5. Tela do Livro

Arquivo principal:

```text
frontend/src/app/livro/[id]/page.tsx
```

Essa tela mostra:

- capa do livro;
- titulo;
- autor;
- categoria;
- ano de publicacao;
- quantidade de paginas;
- idioma;
- descricao;
- status na biblioteca do usuario;
- avaliacao por estrelas;
- formulario para escrever resenha;
- lista de avaliacoes dos leitores.

Ela usa os componentes:

- `InfoLivro`: mostra capa e informacoes principais.
- `LivroStatus`: mostra os botoes de status da biblioteca.
- `AvaliacaoLivro`: mostra estrelas e formulario de avaliacao.
- `Avaliacoes`: mostra a lista de avaliacoes.
- `Sidebar` e `Header`: layout geral.

### 5.1 Estados da tela do Livro

Na pagina do livro existem estes estados:

```ts
const [bookData, setBookData] = useState<DadosLivro | null>(null);
const [error, setError] = useState("");
const [selectedStatus, setSelectedStatus] = useState<StatusLeitura>("WANT_TO_READ");
const [userRating, setUserRating] = useState(0);
const [hoverRating, setHoverRating] = useState(0);
const [showReviewForm, setShowReviewForm] = useState(false);
const [newReviewText, setNewReviewText] = useState("");
const [newReviewRating, setNewReviewRating] = useState(5);
const [reviews, setReviews] = useState<Resenha[]>([]);
```

O que cada um controla:

- `bookData`: dados detalhados do livro que aparecem na tela.
- `error`: mensagem caso o livro nao carregue.
- `selectedStatus`: status escolhido pelo usuario para aquele livro.
- `userRating`: nota atual exibida nas estrelas principais.
- `hoverRating`: efeito visual quando o mouse passa por cima das estrelas.
- `showReviewForm`: abre ou fecha o formulario de avaliacao.
- `newReviewText`: texto digitado na resenha.
- `newReviewRating`: nota escolhida dentro do formulario.
- `reviews`: lista de avaliacoes exibidas abaixo do livro.

### 5.2 O que acontece quando a tela do Livro abre?

Quando a pagina carrega, o `useEffect` chama `fetchBookData`.

```ts
useEffect(() => {
  async function fetchBookData() {
    const data = await buscarLivroPorId(bookId);
    ...
    const biblioteca = await listarBiblioteca();
    ...
    const avaliacoes = await listarAvaliacoes(bookId);
    ...
  }

  fetchBookData();
}, [bookId]);
```

Essa funcao faz tres coisas principais:

1. Busca detalhes do livro pelo ID.
2. Busca a biblioteca do usuario para saber se esse livro ja esta salvo.
3. Busca as avaliacoes desse livro.

### 5.3 Fluxo: buscar detalhes do livro

Frontend:

```text
livro/[id]/page.tsx
-> buscarLivroPorId(bookId)
-> frontend/src/services/book.ts
-> GET /books/:id
```

Service:

```ts
export const buscarLivroPorId = getLivro;
```

`getLivro` faz:

```ts
fetch(`${API_URL}/books/${encodeURIComponent(id)}`, {
  credentials: "include",
  headers: getHeaders(cookieHeader),
});
```

Backend:

```text
backend/src/app.ts
-> /books passa pelo authMiddleware
-> backend/src/routes/book.route.ts
-> router.get("/:id", buscarLivroPorId)
-> backend/src/controllers/book.controller.ts
-> buscarLivroPorId()
-> backend/src/services/book.service.ts
-> searchBookById(id)
-> Google Books API
```

Esse dado nao vem do banco. Vem da API externa Google Books.

O service backend chama:

```ts
axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`, {
  params: {
    key: process.env.GOOGLE_BOOKS_API_KEY,
  },
});
```

Depois transforma a resposta em um objeto mais simples:

```ts
return {
  id: book.id,
  titulo: book.volumeInfo.title,
  autores: book.volumeInfo.authors?.join(", "),
  imagem: book.volumeInfo.imageLinks?.thumbnail,
  paginas: book.volumeInfo.pageCount,
  publicadoEm: book.volumeInfo.publishedDate,
  idioma: book.volumeInfo.language,
  categoria: book.volumeInfo.categories?.[0],
  descricao: book.volumeInfo.description,
};
```

No frontend, esse dado e adaptado para a interface:

```ts
setBookData({
  title: data.titulo || "Titulo indisponivel",
  authors: data.autores || "Autor desconhecido",
  cover: data.imagem?.replace("http://", "https://"),
  pages: data.paginas || 0,
  publishedDate: data.publicadoEm?.split("-")[0] || "N/A",
  language: formatLanguage(data.idioma),
  category: data.categoria || "Categoria nao informada",
  description: removeHtml(data.descricao),
});
```

Importante:

- `replace("http://", "https://")` evita problema ao carregar imagem insegura.
- `split("-")[0]` pega apenas o ano da data.
- `formatLanguage` transforma codigos como `pt`, `en`, `es` em texto.
- `removeHtml` remove tags HTML da descricao.

### 5.4 Componente InfoLivro

Arquivo:

```text
frontend/src/components/InfoLivro.tsx
```

Recebe:

```ts
bookData: DadosLivro
```

Ele exibe:

- capa com `next/image`;
- titulo;
- autores;
- categoria;
- data de publicacao;
- numero de paginas;
- idioma;
- descricao.

Se nao tiver capa:

```tsx
<div>Sem capa</div>
```

A descricao tem estado proprio:

```ts
const [mostrarDescricaoCompleta, setMostrarDescricaoCompleta] = useState(false);
```

Se `mostrarDescricaoCompleta` for falso, aplica `line-clamp-4`, mostrando so parte da descricao.

O botao "Ver mais" alterna:

```ts
onClick={() => setMostrarDescricaoCompleta((valorAtual) => !valorAtual)}
```

### 5.5 Fluxo: verificar se o livro ja esta na biblioteca

Depois de buscar os detalhes do livro, a tela chama:

```ts
const biblioteca = await listarBiblioteca();
const livroSalvo = biblioteca.find((livro) => livro.googleBookId === bookId);
```

Essa requisicao e a mesma do Perfil:

```text
GET /library
```

Se o livro ja existir na biblioteca:

```ts
setSelectedStatus(livroSalvo.status);
```

Se ele tiver nota:

```ts
setUserRating(livroSalvo.nota);
setNewReviewRating(livroSalvo.nota);
```

Isso faz a tela abrir ja mostrando o status e a nota salvos antes.

### 5.6 Funcionalidade: adicionar ou alterar status do livro

Componente:

```text
frontend/src/components/LivroStatus.tsx
```

Ele mostra quatro botoes:

```ts
const statuses = [
  { value: "WANT_TO_READ", label: "Quero ler", icon: Bookmark },
  { value: "READING", label: "Lendo", icon: BookOpen },
  { value: "FINISHED", label: "Lido", icon: CheckCircle2 },
  { value: "DROPPED", label: "Abandonado", icon: XCircle }
];
```

Quando o usuario clica em um status:

```ts
onClick={() => onStatusChange(value, label)}
```

Na pagina do livro, essa funcao e:

```ts
async function handleStatusChange(status: string, label: string) {
  const novoStatus = status as StatusLeitura;

  setSelectedStatus(novoStatus);

  await adicionarLivroNaBiblioteca(bookId, novoStatus);
  toast.success(`Livro salvo como "${label}"`);
}
```

### 5.7 Fluxo: salvar livro na biblioteca

Frontend:

```text
LivroStatus
-> handleStatusChange(status, label)
-> adicionarLivroNaBiblioteca(bookId, status)
-> frontend/src/services/book.ts
-> POST /library
```

Body enviado:

```json
{
  "googleBookId": "id-do-google-books",
  "status": "READING"
}
```

Backend:

```text
backend/src/app.ts
-> /library passa pelo authMiddleware
-> backend/src/routes/library.route.ts
-> router.post("/", adicionarLivro)
-> backend/src/controllers/library.controller.ts
-> adicionarLivro()
-> backend/src/services/library.service.ts
-> adicionarLivroService()
```

Controller:

```ts
const userId = getUsuarioId(res);
const { googleBookId, status, nota } = req.body;
```

Ele valida:

- usuario autenticado;
- `googleBookId` obrigatorio.

Depois chama:

```ts
adicionarLivroService(
  googleBookId,
  userId,
  status ?? ReadingStatus.WANT_TO_READ,
  nota
);
```

Service:

```ts
const livroExistente = await prisma.library.findUnique({
  where: {
    userId_googleBookId: {
      userId,
      googleBookId,
    },
  },
});
```

Se o livro ja existe na biblioteca do usuario, atualiza:

```ts
return await prisma.library.update({
  where: {
    id: livroExistente.id,
  },
  data: {
    status,
    nota,
  },
});
```

Se nao existe, busca os dados na Google Books API:

```ts
const livroGoogle = await searchBookById(googleBookId);
```

Depois cria no banco:

```ts
return await prisma.library.create({
  data: {
    googleBookId,
    titulo: livroGoogle.titulo,
    autores: livroGoogle.autores,
    imagem: livroGoogle.imagem,
    paginas: livroGoogle.paginas,
    status,
    nota,
    userId,
  },
});
```

Os dados sao persistidos na tabela `Library`.

### 5.8 Como o banco evita livro duplicado na biblioteca?

No Prisma:

```prisma
@@unique([userId, googleBookId])
```

Isso significa que o mesmo usuario nao pode ter o mesmo livro duas vezes.

Mas usuarios diferentes podem salvar o mesmo livro, porque o par unico e:

```text
userId + googleBookId
```

### 5.9 Funcionalidade: avaliar por estrelas

Componente:

```text
frontend/src/components/AvaliacaoLivro.tsx
```

Ele recebe estados e funcoes da pagina:

- `userRating`
- `setUserRating`
- `hoverRating`
- `setHoverRating`
- `newReviewRating`
- `setNewReviewRating`
- `onStarRatingToast`
- `onSubmitReview`

As estrelas principais sao renderizadas com:

```ts
[1, 2, 3, 4, 5].map((starValue) => ...)
```

Quando clica em uma estrela:

```ts
setUserRating(starValue);
onStarRatingToast(starValue);
```

Na pagina do livro, `onStarRatingToast` aponta para:

```ts
handleRatingChange
```

Essa funcao salva a nota na biblioteca:

```ts
async function handleRatingChange(rating: number) {
  setNewReviewRating(rating);

  await adicionarLivroNaBiblioteca(bookId, selectedStatus, rating);
  toast.success(`Voce avaliou este livro com ${rating} estrelas!`);
}
```

Fluxo:

```text
Usuario clica estrela
-> AvaliacaoLivro chama onStarRatingToast(rating)
-> pagina chama handleRatingChange(rating)
-> POST /library com googleBookId, status e nota
-> backend cria ou atualiza Library
-> nota fica salva no campo nota da tabela Library
```

### 5.10 Funcionalidade: escrever avaliacao/resenha

No componente `AvaliacaoLivro`, o botao:

```tsx
Escrever uma avaliacao
```

alterna o estado:

```ts
setShowReviewForm(!showReviewForm)
```

Quando `showReviewForm` e verdadeiro, aparece um formulario com:

- estrelas da resenha;
- campo de texto;
- botao "Publicar Avaliacao".

O texto da resenha fica em:

```ts
newReviewText
```

A nota da resenha fica em:

```ts
newReviewRating
```

Ao enviar o formulario:

```ts
<form onSubmit={onSubmitReview}>
```

Na pagina do livro, `onSubmitReview` e:

```ts
handleAddReview
```

### 5.11 Fluxo: publicar avaliacao

Na pagina:

```ts
async function handleAddReview(e: React.FormEvent) {
  e.preventDefault();

  if (!newReviewText.trim()) {
    toast.error("Por favor, escreva o texto da avaliacao.");
    return;
  }

  const reviewSalva = await salvarAvaliacao(bookId, newReviewRating, newReviewText);
  await adicionarLivroNaBiblioteca(bookId, selectedStatus, newReviewRating);

  setReviews((currentReviews) => {
    const outrasReviews = currentReviews.filter((review) => review.id !== reviewSalva.id);
    return [mapReview(reviewSalva), ...outrasReviews];
  });

  setNewReviewText("");
  setUserRating(newReviewRating);
  setShowReviewForm(false);
}
```

O que acontece:

1. Impede o comportamento padrao do formulario com `e.preventDefault()`.
2. Verifica se o texto nao esta vazio.
3. Salva a resenha em `/reviews`.
4. Atualiza tambem a nota do livro em `/library`.
5. Atualiza a lista de resenhas na tela.
6. Limpa o campo de texto.
7. Atualiza a nota exibida.
8. Fecha o formulario.

Service frontend:

```text
frontend/src/services/review.ts
-> salvarAvaliacao(googleBookId, rating, text)
-> POST /reviews
```

Body:

```json
{
  "googleBookId": "id-do-google-books",
  "rating": 5,
  "text": "Texto da avaliacao"
}
```

Backend:

```text
backend/src/app.ts
-> /reviews passa pelo authMiddleware
-> backend/src/routes/review.route.ts
-> router.post("/", salvarReview)
-> backend/src/controllers/review.controller.ts
-> salvarReview()
-> backend/src/services/review.service.ts
-> salvarReviewService()
-> Prisma faz upsert na tabela Review
```

Controller valida:

- usuario autenticado;
- `googleBookId` obrigatorio;
- `rating` inteiro entre 1 e 5;
- `text` string nao vazia.

```ts
if (!isRatingValido(rating)) {
  return res.status(400).json({
    erro: "Nota invalida.",
  });
}

if (typeof text !== "string" || !text.trim()) {
  return res.status(400).json({
    erro: "Texto da avaliacao e obrigatorio.",
  });
}
```

Service salva com `upsert`:

```ts
return await prisma.review.upsert({
  where: {
    userId_googleBookId: {
      userId,
      googleBookId,
    },
  },
  update: {
    rating,
    text,
  },
  create: {
    googleBookId,
    userId,
    rating,
    text,
  },
});
```

Isso significa:

- se o usuario ja avaliou aquele livro, atualiza a avaliacao;
- se ainda nao avaliou, cria uma nova.

No banco:

```prisma
model Review {
  id           Int      @id @default(autoincrement())
  googleBookId String
  rating       Int
  text         String
  userId       Int
  user         User     @relation(fields: [userId], references: [id])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([userId, googleBookId])
}
```

A regra `@@unique([userId, googleBookId])` garante uma resenha por usuario por livro.

### 5.12 Fluxo: listar avaliacoes do livro

Quando a pagina abre:

```ts
const avaliacoes = await listarAvaliacoes(bookId);
setReviews(avaliacoes.map(mapReview));
```

Service frontend:

```text
frontend/src/services/review.ts
-> GET /reviews/:googleBookId
```

Backend:

```text
backend/src/routes/review.route.ts
-> router.get("/:googleBookId", listarReviews)
-> backend/src/controllers/review.controller.ts
-> listarReviews()
-> backend/src/services/review.service.ts
-> listarReviewsService(googleBookId)
-> Prisma consulta Review por googleBookId
```

Service:

```ts
return await prisma.review.findMany({
  where: {
    googleBookId,
  },
  orderBy: {
    updatedAt: "desc",
  },
  select: {
    id: true,
    googleBookId: true,
    userId: true,
    rating: true,
    text: true,
    createdAt: true,
    updatedAt: true,
    user: {
      select: {
        nome: true,
      },
    },
  },
});
```

Ele tambem traz o nome do usuario que escreveu a avaliacao.

No frontend, `mapReview` adapta o formato:

```ts
export function mapReview(review: ReviewApi): Resenha {
  return {
    id: review.id,
    user: review.user.nome,
    date: formatarData(review.updatedAt),
    rating: review.rating,
    text: review.text,
    useful: 0,
    hasLiked: false,
  };
}
```

O componente `Avaliacoes` recebe esse array e renderiza:

- inicial do usuario;
- nome;
- data;
- estrelas;
- texto.

---

## 6. Persistencia dos dados

Os dados persistidos ficam no SQLite, acessado pelo Prisma.

Arquivo do schema:

```text
backend/prisma/schema.prisma
```

O banco usado e:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

As principais tabelas envolvidas na minha parte:

### User

Guarda usuarios:

- `id`
- `nome`
- `email`
- `senha`
- `createdAt`

Senha nao e salva pura. Ela e salva com hash usando bcrypt.

### Library

Guarda livros salvos na biblioteca do usuario:

- `id`
- `googleBookId`
- `titulo`
- `autores`
- `imagem`
- `paginas`
- `paginaAtual`
- `percentual`
- `nota`
- `status`
- `userId`
- `createdAt`

Relacionamento:

```prisma
user User @relation(fields: [userId], references: [id])
```

### Review

Guarda resenhas/avaliacoes:

- `id`
- `googleBookId`
- `rating`
- `text`
- `userId`
- `createdAt`
- `updatedAt`

### Goal

Guarda meta anual:

- `id`
- `year`
- `target`
- `userId`
- `createdAt`
- `updatedAt`

---

## 7. Onde os dados sao extraidos na criacao de usuario?

A criacao de usuario nao e minha tela principal, mas faz parte do fluxo de autenticacao.

Frontend:

```text
frontend/src/services/auth.service.ts
-> cadastro(dados)
-> POST /auth/cadastro
```

Backend:

```text
backend/src/routes/user.route.ts
-> router.post("/cadastro", cadastro)
-> backend/src/controllers/user.controller.ts
```

No controller, os dados sao extraidos do corpo da requisicao:

```ts
const { nome, email, senha } = req.body;
```

Depois chama:

```ts
cadastrarUsuarioService(nome, email, senha);
```

No service:

```text
backend/src/services/user.service.ts
```

Ele verifica se ja existe usuario com aquele email:

```ts
const usuarioExistente = await prisma.user.findUnique({
  where: { email },
});
```

Criptografa a senha:

```ts
const senhaHash = await bcrypt.hash(senha, 10);
```

E salva no banco:

```ts
return prisma.user.create({
  data: {
    nome,
    email,
    senha: senhaHash,
  },
});
```

---

## 8. Onde e como os dados sao persistidos?

Os dados sao persistidos no backend usando Prisma.

O Prisma Client e criado em:

```text
backend/src/prisma/client.ts
```

```ts
const prisma = new PrismaClient();
export default prisma;
```

Cada service importa esse cliente:

```ts
import prisma from "../prisma/client";
```

Exemplos de persistencia:

- Usuario: `prisma.user.create`
- Livro na biblioteca: `prisma.library.create` ou `prisma.library.update`
- Resenha: `prisma.review.upsert`
- Meta: `prisma.goal.upsert`

---

## 9. Se eu desejasse adicionar um novo campo, como seria feito?

Exemplo: adicionar um campo `favorito` no livro da biblioteca.

Passos:

1. Alterar o schema do Prisma em `backend/prisma/schema.prisma`.

```prisma
model Library {
  ...
  favorito Boolean @default(false)
}
```

2. Rodar migracao ou sincronizacao do banco.

Exemplo:

```bash
npx prisma migrate dev
```

ou, dependendo do fluxo do projeto:

```bash
npx prisma db push
```

3. Atualizar os tipos no frontend.

Em `frontend/src/services/book.ts`, adicionar no tipo `LivroBiblioteca`:

```ts
favorito: boolean;
```

4. Atualizar o service/controller/backend para receber e salvar esse campo.

No controller:

```ts
const { googleBookId, status, nota, favorito } = req.body;
```

No service:

```ts
data: {
  status,
  nota,
  favorito,
}
```

5. Atualizar o frontend para exibir ou alterar esse campo.

Por exemplo, criar um botao de favorito na tela do livro e chamar um endpoint para salvar.

Resumo:

```text
schema.prisma
-> migracao do banco
-> service backend
-> controller backend
-> service frontend
-> tipo TypeScript frontend
-> componente/tela
```

---

## 10. Respostas rapidas para perguntas do professor

### De onde parte a requisicao?

Parte de um componente ou pagina React no frontend.

Exemplo no Perfil:

```text
perfil/page.tsx chama listarBiblioteca(), listarMinhasAvaliacoes() e buscarMetaAtual().
```

Exemplo na tela do Livro:

```text
livro/[id]/page.tsx chama buscarLivroPorId(), listarBiblioteca(), listarAvaliacoes(), adicionarLivroNaBiblioteca() e salvarAvaliacao().
```

### Onde a requisicao e recebida?

No backend, em `backend/src/app.ts`, que registra as rotas:

```ts
app.use("/library", authMiddleware, libraryRoutes);
app.use("/reviews", authMiddleware, reviewRoutes);
app.use("/goals", authMiddleware, goalRoutes);
app.use("/books", authMiddleware, bookRoutes);
```

Depois ela vai para o arquivo de rotas especifico, por exemplo:

- `library.route.ts`
- `review.route.ts`
- `goal.route.ts`
- `book.route.ts`

### Onde a requisicao e tratada?

Nos controllers:

- `library.controller.ts`
- `review.controller.ts`
- `goal.controller.ts`
- `book.controller.ts`

O controller valida dados, pega o usuario autenticado e chama o service.

### Onde o dado e lido do banco?

Nos services do backend usando Prisma:

- `library.service.ts`
- `review.service.ts`
- `goal.service.ts`
- `user.service.ts`

Exemplo:

```ts
prisma.library.findMany(...)
```

### Onde os dados de livro sao buscados?

Detalhes do livro e busca por titulo vem da Google Books API, em:

```text
backend/src/services/book.service.ts
```

Mas quando o usuario salva um livro, uma copia dos dados principais e persistida na tabela `Library`.

### Onde e feita a autenticacao?

Login:

```text
backend/src/controllers/user.controller.ts
backend/src/services/user.service.ts
```

Validacao das rotas protegidas:

```text
backend/src/middlewares/auth.middleware.ts
```

Protecao de paginas no frontend:

```text
frontend/src/middleware.ts
```

### Como o cliente consegue acessar uma rota protegida?

Ele precisa ter token salvo apos o login. O service do frontend pega esse token e envia no header:

```text
Authorization: Bearer <token>
```

O backend valida esse token no `authMiddleware`.

### Como e o processo de adicionar token na requisicao?

1. Login retorna token.
2. Frontend salva token no `localStorage`.
3. `getAuthHeaders()` le esse token.
4. O service coloca o token no header `Authorization`.
5. Backend valida com JWT.

### Como e feito o roteamento de paginas no cliente?

Pela estrutura de arquivos do Next.js em `frontend/src/app`.

Exemplos:

```text
src/app/perfil/page.tsx       -> /perfil
src/app/livro/[id]/page.tsx   -> /livro/:id
src/app/page.tsx              -> /
```

### Onde esta a tela de Perfil?

```text
frontend/src/app/perfil/page.tsx
```

### Onde esta a tela do Livro?

```text
frontend/src/app/livro/[id]/page.tsx
```

### Qual e a minha parte principal?

Minha parte esta concentrada no frontend das telas de Perfil e Livro:

- Perfil: carrega dados do usuario, meta, estatisticas e resenhas.
- Livro: carrega detalhes do livro, permite salvar status, avaliar, escrever resenha e listar avaliacoes.

Mas para explicar corretamente, tambem preciso entender os services do frontend e o fluxo ate o backend.

---

## 11. Fluxos principais para apresentar

### Fluxo 1: abrir Perfil

```text
Usuario acessa /perfil
-> middleware do Next verifica cookie librorum:token
-> Perfil renderiza
-> useEffect chama listarBiblioteca, listarMinhasAvaliacoes e buscarMetaAtual
-> services enviam token no Authorization
-> backend valida token
-> controllers pegam userId de res.locals.user
-> services consultam Library, Review e Goal pelo userId
-> dados voltam para o frontend
-> React atualiza estados
-> tela mostra estatisticas, meta e resenhas
```

### Fluxo 2: salvar meta

```text
Usuario digita meta
-> estado meta e atualizado
-> usuario clica Salvar
-> handleSalvarMeta valida numero
-> salvarMetaAtual envia PUT /goals/current
-> backend valida token
-> controller valida target
-> service faz upsert em Goal
-> frontend atualiza meta
-> evento librorum:meta-atualizada atualiza Sidebar
```

### Fluxo 3: abrir tela de livro

```text
Usuario acessa /livro/:id
-> pagina pega id da URL
-> busca detalhes em GET /books/:id
-> backend busca dados na Google Books API
-> pagina busca biblioteca em GET /library
-> pagina verifica se esse livro ja esta salvo
-> pagina busca avaliacoes em GET /reviews/:googleBookId
-> tela mostra dados do livro, status, nota e avaliacoes
```

### Fluxo 4: salvar status do livro

```text
Usuario clica Quero ler/Lendo/Lido/Abandonado
-> LivroStatus chama handleStatusChange
-> frontend faz POST /library
-> backend valida token
-> controller recebe googleBookId, status e userId
-> service verifica se livro ja existe para aquele usuario
-> se existe, atualiza
-> se nao existe, busca no Google Books e cria em Library
-> frontend mostra toast de sucesso
```

### Fluxo 5: escrever resenha

```text
Usuario abre formulario
-> escolhe nota
-> escreve texto
-> clica Publicar Avaliacao
-> handleAddReview valida texto
-> POST /reviews salva Review
-> POST /library atualiza nota do livro
-> frontend atualiza lista reviews
-> formulario fecha
```

### Fluxo 6: remover resenha pelo Perfil

```text
Usuario vai em Perfil > Resenhas
-> clica Remover resenha
-> CardResenhaPerfil chama onDelete(id)
-> Perfil chama deletarAvaliacao(id)
-> DELETE /reviews/:id
-> backend valida token
-> service verifica se review pertence ao userId
-> Prisma deleta
-> frontend remove resenha do estado
```

---

## 12. Pontos importantes para falar na apresentacao

- O frontend usa estados React para controlar o que aparece na tela.
- As telas nao acessam o banco diretamente.
- Todas as operacoes de dados passam por services do frontend.
- Os services enviam requisicoes HTTP para o backend.
- Rotas protegidas recebem token pelo header `Authorization`.
- O backend usa `authMiddleware` para validar JWT.
- O usuario autenticado fica em `res.locals.user`.
- Os controllers validam os dados recebidos.
- Os services do backend concentram a regra de negocio.
- O Prisma faz leitura e escrita no SQLite.
- Dados externos de livro vem da Google Books API.
- Dados do usuario, biblioteca, metas e resenhas ficam persistidos no banco.

