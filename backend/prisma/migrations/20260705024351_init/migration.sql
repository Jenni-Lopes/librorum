-- CreateTable
CREATE TABLE "Library" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "googleBookId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autores" TEXT,
    "imagem" TEXT,
    "paginas" INTEGER,
    "paginaAtual" INTEGER NOT NULL DEFAULT 0,
    "percentual" REAL NOT NULL DEFAULT 0,
    "nota" REAL,
    "status" TEXT NOT NULL DEFAULT 'WANT_TO_READ',
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Library_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Library_userId_googleBookId_key" ON "Library"("userId", "googleBookId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
