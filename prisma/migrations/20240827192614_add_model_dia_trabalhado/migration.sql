-- CreateEnum
CREATE TYPE "TypePerson" AS ENUM ('USER', 'ADMIN', 'EMPLOYEE', 'MANAGER', 'GUEST');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uuid" CHAR(36) NOT NULL,
    "api_token" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isWhatsapp" BOOLEAN NOT NULL,
    "cep" TEXT,
    "address" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "theme" TEXT,
    "cpf" TEXT,
    "cnpj" TEXT,
    "situacao" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "type_person" "TypePerson" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaTrabalhado" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horarioEntrada" TIMESTAMP(3) NOT NULL,
    "horarioSaida" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT,
    "isPresenca" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiaTrabalhado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "supplier_id" TEXT,
    "brandId" INTEGER,
    "price" DOUBLE PRECISION NOT NULL,
    "format" TEXT,
    "expirationDate" TIMESTAMP(3),
    "freeShipping" BOOLEAN NOT NULL,
    "netWeight" DOUBLE PRECISION,
    "grossWeight" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "depth" DOUBLE PRECISION,
    "volumes" INTEGER,
    "itemsPerBox" INTEGER,
    "unitOfMeasurement" TEXT,
    "situation" BOOLEAN NOT NULL,
    "image" TEXT,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "produtoId" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marca" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "dataPrevista" TIMESTAMP(3) NOT NULL,
    "totalProdutos" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "ordemCompra" TEXT NOT NULL,
    "observacoes" TEXT NOT NULL,
    "observacoesInternas" TEXT NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mail" (
    "id" SERIAL NOT NULL,
    "assunto" VARCHAR(445),
    "corpo" TEXT,
    "email" VARCHAR(245),
    "data_cadastro" TIMESTAMP(3),
    "data_envio" TIMESTAMP(3),
    "situacao_envio" INTEGER,
    "origem" VARCHAR(100),

    CONSTRAINT "Mail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoriaToProduto" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_cnpj_key" ON "User"("cnpj");

-- CreateIndex
CREATE INDEX "DiaTrabalhado_userId_data_idx" ON "DiaTrabalhado"("userId", "data");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_code_key" ON "Produto"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_name_key" ON "Categoria"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Marca_name_key" ON "Marca"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriaToProduto_AB_unique" ON "_CategoriaToProduto"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriaToProduto_B_index" ON "_CategoriaToProduto"("B");

-- AddForeignKey
ALTER TABLE "DiaTrabalhado" ADD CONSTRAINT "DiaTrabalhado_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Marca"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriaToProduto" ADD CONSTRAINT "_CategoriaToProduto_A_fkey" FOREIGN KEY ("A") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriaToProduto" ADD CONSTRAINT "_CategoriaToProduto_B_fkey" FOREIGN KEY ("B") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
