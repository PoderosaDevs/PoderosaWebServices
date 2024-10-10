/*
  Warnings:

  - You are about to drop the column `produtoId` on the `Avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Marca` table. All the data in the column will be lost.
  - You are about to drop the column `dataPrevista` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `observacoesInternas` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `ordemCompra` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `totalProdutos` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `brandId` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `depth` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `expirationDate` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `freeShipping` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `grossWeight` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `itemsPerBox` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `netWeight` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `situation` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `unitOfMeasurement` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the `DiaTrabalhado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypeSystem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTypeSystem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nome]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Marca` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `Produto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_produto` to the `Avaliacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_usuario` to the `Avaliacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Categoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Marca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_prevista` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observacoes_internas` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ordem_compra` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_produtos` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estoque` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_frete_gratis` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preco` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `situacao` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "DiaTrabalhado" DROP CONSTRAINT "DiaTrabalhado_userId_fkey";

-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_brandId_fkey";

-- DropForeignKey
ALTER TABLE "UserTypeSystem" DROP CONSTRAINT "UserTypeSystem_typeSystemId_fkey";

-- DropForeignKey
ALTER TABLE "UserTypeSystem" DROP CONSTRAINT "UserTypeSystem_userId_fkey";

-- DropIndex
DROP INDEX "Categoria_name_key";

-- DropIndex
DROP INDEX "Marca_name_key";

-- DropIndex
DROP INDEX "Produto_code_key";

-- AlterTable
ALTER TABLE "Avaliacao" DROP COLUMN "produtoId",
DROP COLUMN "usuarioId",
ADD COLUMN     "id_produto" TEXT NOT NULL,
ADD COLUMN     "id_usuario" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Categoria" DROP COLUMN "name",
ADD COLUMN     "nome" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Marca" DROP COLUMN "name",
ADD COLUMN     "nome" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "dataPrevista",
DROP COLUMN "observacoesInternas",
DROP COLUMN "ordemCompra",
DROP COLUMN "totalProdutos",
ADD COLUMN     "data_prevista" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "observacoes_internas" TEXT NOT NULL,
ADD COLUMN     "ordem_compra" TEXT NOT NULL,
ADD COLUMN     "total_produtos" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "brandId",
DROP COLUMN "code",
DROP COLUMN "depth",
DROP COLUMN "description",
DROP COLUMN "expirationDate",
DROP COLUMN "format",
DROP COLUMN "freeShipping",
DROP COLUMN "grossWeight",
DROP COLUMN "height",
DROP COLUMN "image",
DROP COLUMN "itemsPerBox",
DROP COLUMN "name",
DROP COLUMN "netWeight",
DROP COLUMN "price",
DROP COLUMN "situation",
DROP COLUMN "stock",
DROP COLUMN "supplier_id",
DROP COLUMN "unitOfMeasurement",
DROP COLUMN "width",
ADD COLUMN     "altura" DOUBLE PRECISION,
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "data_expiracao" TIMESTAMP(3),
ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "estoque" INTEGER NOT NULL,
ADD COLUMN     "formato" TEXT,
ADD COLUMN     "id_fornecedor" TEXT,
ADD COLUMN     "id_marca" INTEGER,
ADD COLUMN     "imagem" TEXT,
ADD COLUMN     "is_frete_gratis" BOOLEAN NOT NULL,
ADD COLUMN     "itens_por_caixa" INTEGER,
ADD COLUMN     "largura" DOUBLE PRECISION,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "peso_bruto" DOUBLE PRECISION,
ADD COLUMN     "peso_liquido" DOUBLE PRECISION,
ADD COLUMN     "preco" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "profundidade" DOUBLE PRECISION,
ADD COLUMN     "situacao" BOOLEAN NOT NULL,
ADD COLUMN     "unidade_de_medida" TEXT;

-- DropTable
DROP TABLE "DiaTrabalhado";

-- DropTable
DROP TABLE "TypeSystem";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserTypeSystem";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "uuid" CHAR(36) NOT NULL,
    "token_api" TEXT,
    "senha" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "isWhatsapp" BOOLEAN NOT NULL,
    "cep" TEXT,
    "endereco" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "tema" TEXT,
    "cpf" TEXT,
    "cnpj" TEXT,
    "situacao" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "data_nascimento" TIMESTAMP(3),
    "nome" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "usuario_foto" TEXT NOT NULL,
    "tipo_pessoa" "TypePerson" NOT NULL DEFAULT 'USER',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario_Tipo_Sistema" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_tipo_sistema" INTEGER NOT NULL,

    CONSTRAINT "Usuario_Tipo_Sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipo_Sistema" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Tipo_Sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dia_Trabalhado" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horarioEntrada" TIMESTAMP(3) NOT NULL,
    "horarioSaida" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT,
    "isPresent" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dia_Trabalhado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cnpj_key" ON "Usuario"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_Tipo_Sistema_id_usuario_id_tipo_sistema_key" ON "Usuario_Tipo_Sistema"("id_usuario", "id_tipo_sistema");

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_Sistema_nome_key" ON "Tipo_Sistema"("nome");

-- CreateIndex
CREATE INDEX "Dia_Trabalhado_userId_data_idx" ON "Dia_Trabalhado"("userId", "data");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Marca_nome_key" ON "Marca"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_codigo_key" ON "Produto"("codigo");

-- AddForeignKey
ALTER TABLE "Usuario_Tipo_Sistema" ADD CONSTRAINT "Usuario_Tipo_Sistema_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario_Tipo_Sistema" ADD CONSTRAINT "Usuario_Tipo_Sistema_id_tipo_sistema_fkey" FOREIGN KEY ("id_tipo_sistema") REFERENCES "Tipo_Sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dia_Trabalhado" ADD CONSTRAINT "Dia_Trabalhado_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_id_marca_fkey" FOREIGN KEY ("id_marca") REFERENCES "Marca"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
