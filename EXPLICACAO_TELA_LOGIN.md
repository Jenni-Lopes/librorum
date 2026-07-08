# Explicacao da tela de Login - Librorum

Este documento explica a tela de Login do Librorum e o fluxo completo de autenticacao: o que acontece no formulario, onde os dados sao validados, como a requisicao chega no backend, como a senha e conferida, como o token e criado e como o usuario passa a acessar rotas protegidas.

Arquivos principais:

- Tela de login: `frontend/src/app/(auth)/login/page.tsx`
- Layout das telas de autenticacao: `frontend/src/app/(auth)/layout.tsx`
- Validacao do login: `frontend/src/schemas/login.schema.ts`
- Service de autenticacao no frontend: `frontend/src/services/auth.service.ts`
- Tipos de autenticacao: `frontend/src/types/auth.ts`
- Middleware de paginas protegidas: `frontend/src/middleware.ts`
- Rotas de usuario no backend: `backend/src/routes/user.route.ts`
- Controller de usuario: `backend/src/controllers/user.controller.ts`
- Service de usuario: `backend/src/services/user.service.ts`
- Middleware de autenticacao da API: `backend/src/middlewares/auth.middleware.ts`

---

## 1. Qual e a funcao da tela de Login?

A tela de Login permite que um usuario ja cadastrado entre no sistema usando:

- e-mail;
- senha.

Quando o login da certo, o sistema:

- recebe um token JWT do backend;
- salva o token no navegador;
- salva os dados basicos do usuario no navegador;
- cria um cookie usado pelo middleware do Next;
- redireciona o usuario para a pagina inicial `/`.

Depois disso, o usuario consegue acessar paginas protegidas como:

- `/`
- `/perfil`
- `/livro/:id`

---

## 2. Onde fica a tela de Login no frontend?

A tela fica em:

```text
frontend/src/app/(auth)/login/page.tsx
```

Como o projeto usa o App Router do Next.js, esse arquivo vira a rota:

```text
/login
```

A pasta `(auth)` e um grupo de rotas. Ela organiza as telas de autenticacao, mas nao aparece na URL. Por isso:

```text
src/app/(auth)/login/page.tsx
```

vira:

```text
/login
```

---

## 3. Layout da tela de Login

O layout usado pelas telas de login e cadastro fica em:

```text
frontend/src/app/(auth)/layout.tsx
```

Ele recebe `children`, que representa a pagina atual, e coloca um fundo com gradiente:

```tsx
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#362A67] to-[#15131D] p-4">
      <div>
        {children}
      </div>
    </div>
  );
}
```

Isso significa que a tela de Login e a tela de Cadastro compartilham esse mesmo visual base.

---

## 4. Estados usados na tela de Login

Na tela `LoginPage`, existem tres estados principais:

```ts
const [showPassword, setShowPassword] = useState(false);
const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
```

O que cada um faz:

- `showPassword`: controla se a senha aparece como texto ou como senha escondida.
- `email`: guarda o valor digitado no campo de e-mail.
- `senha`: guarda o valor digitado no campo de senha.

Tambem existe:

```ts
const router = useRouter();
```

O `router` vem do Next.js e e usado para redirecionar o usuario depois do login.

---

## 5. Campo de e-mail

O campo de e-mail fica ligado ao estado `email`.

```tsx
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="nome@gmail.com"
/>
```

Fluxo:

```text
Usuario digita no input
-> evento onChange acontece
-> setEmail salva o novo valor
-> estado email fica atualizado
```

Esse valor depois e usado no envio do formulario.

---

## 6. Campo de senha

O campo de senha fica ligado ao estado `senha`.

```tsx
<input
  type={showPassword ? "text" : "password"}
  value={senha}
  onChange={(e) => setSenha(e.target.value)}
  placeholder="senha"
/>
```

Fluxo:

```text
Usuario digita a senha
-> onChange chama setSenha
-> estado senha e atualizado
```

O tipo do input depende de `showPassword`:

- se `showPassword` for `false`, o input e `password`;
- se `showPassword` for `true`, o input e `text`.

---

## 7. Funcionalidade: mostrar ou esconder senha

O botao com icone de olho alterna o estado `showPassword`.

```tsx
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? <EyeOff /> : <Eye />}
</button>
```

Quando o usuario clica:

```text
showPassword false -> true
ou
showPassword true -> false
```

Isso muda o tipo do input:

```ts
type={showPassword ? "text" : "password"}
```

Entao a senha aparece ou fica escondida.

Esse botao tem `type="button"` para nao enviar o formulario sem querer.

---

## 8. Envio do formulario

O formulario tem:

```tsx
<form onSubmit={handleSubmit}>
```

Quando o usuario clica em "ENTRAR" ou aperta Enter, a funcao `handleSubmit` e executada.

```ts
const handleSubmit = async (e: React.SyntheticEvent) => {
  e.preventDefault();
  ...
}
```

O `e.preventDefault()` impede o comportamento padrao do HTML, que seria recarregar a pagina.

Depois disso, o login e tratado via JavaScript/React.

---

## 9. Validacao no frontend com Zod

Antes de enviar para o backend, o frontend valida os dados usando Zod.

Arquivo:

```text
frontend/src/schemas/login.schema.ts
```

Schema:

```ts
export const loginSchema = z.object({
  email: z.email("Email invalido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});
```

Na tela:

```ts
const result = loginSchema.safeParse({
  email,
  senha,
});
```

O que isso valida:

- `email` precisa ter formato de e-mail.
- `senha` precisa ter pelo menos 6 caracteres.

Se a validacao falhar:

```ts
if (!result.success) {
  toast.error(result.error.issues[0].message);
  return;
}
```

Ou seja:

```text
Formulario invalido
-> mostra toast com erro
-> para a execucao
-> nao chama o backend
```

Isso evita requisicoes desnecessarias quando os dados ja estao errados no frontend.

---

## 10. Fluxo completo do clique em ENTRAR

Quando o usuario clica em "ENTRAR":

```text
Botao submit
-> formulario chama handleSubmit
-> preventDefault evita recarregar pagina
-> loginSchema.safeParse valida email e senha
-> se tiver erro, mostra toast e para
-> se estiver valido, chama login({ email, senha })
-> service faz POST /auth/login
-> backend verifica usuario e senha
-> backend gera token JWT
-> frontend salva token e usuario
-> frontend redireciona para /
```

No codigo:

```ts
try {
  await login({ email, senha });
  toast.success("Login feito com sucesso");
  router.push("/");
  router.refresh();
} catch (error) {
  const mensagem = error instanceof Error ? error.message : "Usuario ou senha invalidos";
  toast.error(mensagem);
}
```

---

## 11. Service de login no frontend

Arquivo:

```text
frontend/src/services/auth.service.ts
```

A funcao principal e:

```ts
export async function login(dados: LoginDTO): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  ...
}
```

Ela envia uma requisicao HTTP para:

```text
POST http://localhost:3001/auth/login
```

O `API_URL` vem de:

```ts
const API_URL = getApiUrl();
```

E geralmente usa:

```text
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Se essa variavel nao existir, usa:

```text
http://localhost:3001
```

### O que e enviado no body?

O body e:

```json
{
  "email": "usuario@email.com",
  "senha": "123456"
}
```

Ele e enviado como JSON:

```ts
body: JSON.stringify(dados)
```

E o header informa isso:

```ts
"Content-Type": "application/json"
```

### Por que usa credentials: "include"?

```ts
credentials: "include"
```

permite que cookies sejam enviados/recebidos na requisicao.

Nesse projeto, o backend tambem cria um cookie chamado `token`, e o frontend cria outro cookie chamado `librorum:token` para o middleware do Next.

---

## 12. Tipos usados no login

Arquivo:

```text
frontend/src/types/auth.ts
```

Tipo enviado no login:

```ts
export interface LoginDTO {
  email: string;
  senha: string;
}
```

Tipo esperado como resposta:

```ts
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
  };
}
```

Esses tipos ajudam o TypeScript a garantir que o frontend esta enviando e recebendo os dados no formato esperado.

---

## 13. Tratamento de erro no service

Se o backend responder com erro:

```ts
if (!response.ok) {
  throw new Error(await getErrorMessage(response, "Usuario ou senha invalidos"));
}
```

A funcao `getErrorMessage` tenta ler a mensagem do backend:

```ts
const data = await response.json().catch(() => null);
return data?.erro ?? fallback;
```

Se nao conseguir, usa uma mensagem padrao.

Na tela de Login, esse erro cai no `catch`:

```ts
catch (error) {
  const mensagem = error instanceof Error ? error.message : "Usuario ou senha invalidos";
  toast.error(mensagem);
}
```

Assim o usuario recebe um aviso visual.

---

## 14. O que acontece quando o login da certo?

Depois que a resposta vem com sucesso:

```ts
const data: LoginResponse = await response.json();
```

O frontend salva:

```ts
localStorage.setItem(TOKEN_KEY, data.token);
localStorage.setItem(USER_KEY, JSON.stringify(data.user));
document.cookie = `${TOKEN_KEY}=${data.token}; path=/; max-age=${TOKEN_MAX_AGE_SECONDS}; SameSite=Lax`;
```

Onde:

```ts
const TOKEN_KEY = "librorum:token";
const USER_KEY = "librorum:user";
```

Ou seja:

- `librorum:token`: guarda o JWT.
- `librorum:user`: guarda id, nome e email do usuario.

O token tambem e salvo em cookie para o middleware do frontend conseguir verificar se o usuario esta logado.

Tempo do cookie:

```ts
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;
```

Isso equivale a 1 dia.

---

## 15. Backend: onde a requisicao de login chega?

No backend, as rotas de autenticacao sao registradas em:

```text
backend/src/app.ts
```

```ts
app.use("/auth", userRoutes);
```

Entao:

```text
POST /auth/login
```

vai para:

```text
backend/src/routes/user.route.ts
```

Nesse arquivo:

```ts
router.post("/login", login);
```

Isso chama a funcao `login` do controller:

```text
backend/src/controllers/user.controller.ts
```

---

## 16. Controller de login no backend

No controller:

```ts
export async function login(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;

    const resposta = await loginUsuarioService(email, senha);

    res.cookie("token", resposta.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      success: true,
      token: resposta.token,
      user: resposta.user,
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Erro",
    });
  }
}
```

O controller faz quatro coisas:

1. Extrai `email` e `senha` do corpo da requisicao.
2. Chama o service `loginUsuarioService`.
3. Cria um cookie `token` com o JWT.
4. Retorna JSON com `success`, `token` e `user`.

### Onde os dados sao extraidos?

Aqui:

```ts
const { email, senha } = req.body;
```

Esses dados vieram do frontend no body JSON.

---

## 17. Service de login no backend

Arquivo:

```text
backend/src/services/user.service.ts
```

Funcao:

```ts
export async function loginUsuarioService(email: string, senha: string) {
  ...
}
```

Essa funcao contem a regra de negocio do login.

### 17.1 Buscar usuario pelo e-mail

```ts
const usuario = await prisma.user.findUnique({
  where: { email },
});
```

Aqui o Prisma consulta a tabela `User` no banco SQLite procurando um usuario com aquele e-mail.

Se nao encontrar:

```ts
if (!usuario) {
  throw new Error("Email ou senha invalidos.");
}
```

### 17.2 Conferir a senha com bcrypt

A senha salva no banco nao e a senha original. Ela e um hash criado no cadastro.

Para comparar, o sistema usa:

```ts
const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
```

O `bcrypt.compare` compara:

- `senha`: senha digitada agora no login;
- `usuario.senha`: hash salvo no banco.

Se a senha estiver errada:

```ts
if (!senhaCorreta) {
  throw new Error("Email ou senha invalidos.");
}
```

### 17.3 Criar token JWT

Se o e-mail existe e a senha esta correta, o backend cria um token:

```ts
const token = jwt.sign(
  {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  },
  process.env.JWT_SECRET!,
  {
    expiresIn: "1d",
  },
);
```

O payload do token guarda:

- `id`;
- `nome`;
- `email`.

A chave secreta vem do `.env`:

```text
JWT_SECRET=...
```

O token expira em 1 dia:

```ts
expiresIn: "1d"
```

### 17.4 Retornar dados para o controller

O service retorna:

```ts
return {
  token,
  user: {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  },
};
```

Ele nao retorna a senha.

---

## 18. Onde a senha fica persistida?

A senha fica na tabela `User`, definida em:

```text
backend/prisma/schema.prisma
```

Modelo:

```prisma
model User {
  id        Int @id @default(autoincrement())
  nome      String
  email     String @unique
  senha     String
  livros    Library[]
  reviews   Review[]
  goals     Goal[]
  createdAt DateTime @default(now())
}
```

Importante:

- `email` e unico por causa de `@unique`;
- `senha` guarda o hash, nao a senha pura.

No cadastro, a senha e transformada em hash:

```ts
const senhaHash = await bcrypt.hash(senha, 10);
```

No login, a senha digitada e comparada com esse hash:

```ts
bcrypt.compare(senha, usuario.senha);
```

---

## 19. Como o usuario passa a acessar rotas protegidas?

Depois do login, o frontend salva o token.

Quando o usuario acessa uma pagina protegida, o middleware do Next verifica o cookie.

Arquivo:

```text
frontend/src/middleware.ts
```

Rotas privadas:

```ts
const privateRoutes = ["/", "/livro", "/perfil"];
```

Rotas de autenticacao:

```ts
const authRoutes = ["/login", "/cadastro"];
```

O middleware le:

```ts
const token = request.cookies.get(TOKEN_KEY)?.value;
```

Se tentar acessar rota privada sem token:

```ts
return NextResponse.redirect(new URL("/login", request.url));
```

Se tentar acessar `/login` ou `/cadastro` ja tendo token:

```ts
return NextResponse.redirect(new URL("/", request.url));
```

Isso evita que um usuario logado volte para a tela de login.

---

## 20. Como o token e adicionado nas proximas requisicoes?

O frontend tem a funcao:

```ts
export function getAuthHeaders(): Record<string, string> {
  const token = getToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}
```

Ela pega o token salvo em:

```ts
localStorage.getItem("librorum:token");
```

E monta o header:

```text
Authorization: Bearer <token>
```

Depois, services como `book.ts`, `review.ts` e `goal.ts` usam esse header para acessar rotas protegidas.

Exemplo:

```ts
fetch(`${API_URL}/goals/current`, {
  credentials: "include",
  headers: getAuthHeaders(),
});
```

---

## 21. Como o backend valida o token nas rotas protegidas?

Arquivo:

```text
backend/src/middlewares/auth.middleware.ts
```

O middleware procura token no cookie:

```ts
let token = req.cookies.token;
```

Se nao encontrar, procura no header Authorization:

```ts
if (!token && req.headers.authorization) {
  const parts = req.headers.authorization.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    token = parts[1];
  }
}
```

Depois valida:

```ts
const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
res.locals.user = payload;
next();
```

Se o token for valido:

- o backend coloca o usuario em `res.locals.user`;
- chama `next()`;
- a requisicao continua para o controller.

Se for invalido:

```ts
return res.status(401).json({
  message: "Token invalido",
});
```

---

## 22. Por que o login e uma rota publica?

No backend:

```ts
app.use("/auth", userRoutes);
app.use("/books", authMiddleware, bookRoutes);
app.use("/library", authMiddleware, libraryRoutes);
app.use("/reviews", authMiddleware, reviewRoutes);
app.use("/goals", authMiddleware, goalRoutes);
```

A rota `/auth` nao usa `authMiddleware`, porque o usuario ainda nao tem token antes de fazer login.

Ja as rotas de livros, biblioteca, avaliacoes e metas sao protegidas.

---

## 23. Redirecionamento apos login

Depois que `await login({ email, senha })` termina com sucesso, a tela executa:

```ts
router.push("/");
router.refresh();
```

`router.push("/")` manda o usuario para a pagina inicial.

`router.refresh()` atualiza a navegacao para garantir que o estado do login/cookie seja reconhecido.

---

## 24. Funcionalidade: link para cadastro

No final da tela existe:

```tsx
<a href="/cadastro">
  Crie agora
</a>
```

Se o usuario nao tiver conta, ele pode ir para a tela de cadastro.

Como `/cadastro` esta dentro do grupo `(auth)`, ela tambem usa o mesmo layout visual de autenticacao.

---

## 25. Respostas rapidas para perguntas do professor

### De onde parte a requisicao de login?

Parte da tela:

```text
frontend/src/app/(auth)/login/page.tsx
```

Quando o formulario e enviado, `handleSubmit` chama:

```ts
login({ email, senha })
```

### Onde a requisicao e montada?

Em:

```text
frontend/src/services/auth.service.ts
```

Na funcao:

```ts
login(dados)
```

Ela faz:

```text
POST /auth/login
```

### Onde a requisicao e recebida no backend?

Primeiro em:

```text
backend/src/app.ts
```

Depois em:

```text
backend/src/routes/user.route.ts
```

Rota:

```ts
router.post("/login", login);
```

### Onde os dados sao extraidos?

No controller:

```text
backend/src/controllers/user.controller.ts
```

Linha principal:

```ts
const { email, senha } = req.body;
```

### Onde o usuario e buscado no banco?

No service:

```text
backend/src/services/user.service.ts
```

Com Prisma:

```ts
prisma.user.findUnique({
  where: { email },
});
```

### Onde a senha e validada?

No mesmo service, usando bcrypt:

```ts
bcrypt.compare(senha, usuario.senha);
```

### Onde o token e criado?

No service de usuario:

```ts
jwt.sign(...)
```

### Onde o token e salvo no frontend?

Em:

```text
frontend/src/services/auth.service.ts
```

Com:

```ts
localStorage.setItem("librorum:token", data.token);
document.cookie = `librorum:token=${data.token}; ...`;
```

### Onde os dados do usuario sao salvos no frontend?

No `localStorage`:

```ts
localStorage.setItem("librorum:user", JSON.stringify(data.user));
```

### Como o cliente acessa rotas protegidas depois?

Os services usam:

```ts
getAuthHeaders()
```

para enviar:

```text
Authorization: Bearer <token>
```

### Onde e feita a protecao de paginas?

No frontend:

```text
frontend/src/middleware.ts
```

### Onde e feita a protecao da API?

No backend:

```text
backend/src/middlewares/auth.middleware.ts
```

### Como e feito o roteamento da tela de Login?

Pelo App Router do Next.js:

```text
frontend/src/app/(auth)/login/page.tsx -> /login
```

---

## 26. Fluxo principal para apresentar

```text
Usuario acessa /login
-> Next renderiza LoginPage
-> usuario digita email e senha
-> estados email e senha sao atualizados
-> usuario clica ENTRAR
-> handleSubmit impede reload da pagina
-> Zod valida email e senha
-> se invalido, mostra toast de erro
-> se valido, chama login() do auth.service
-> frontend envia POST /auth/login com email e senha
-> backend recebe em user.route.ts
-> controller extrai email e senha do req.body
-> service busca usuario pelo email no banco
-> bcrypt compara senha digitada com hash salvo
-> se correto, JWT e gerado
-> backend retorna token e dados do usuario
-> frontend salva token e usuario no localStorage
-> frontend salva cookie librorum:token
-> mostra toast de sucesso
-> redireciona para /
-> usuario passa a acessar rotas protegidas
```

---

## 27. Pontos importantes para falar na apresentacao

- A tela usa React com estados para controlar email, senha e visibilidade da senha.
- A validacao inicial e feita no frontend com Zod.
- O login real e confirmado no backend, nao no frontend.
- O backend busca o usuario pelo e-mail usando Prisma.
- A senha e comparada com bcrypt, porque no banco fica salva como hash.
- O backend cria um token JWT quando o login e valido.
- O frontend salva esse token no `localStorage` e em cookie.
- O cookie permite proteger paginas pelo middleware do Next.
- O header `Authorization: Bearer <token>` permite acessar rotas protegidas da API.
- Depois do login, o usuario e redirecionado para `/`.

