/*
  Warnings:

  - You are about to drop the column `tipo_sistema_id` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `Tipo_Sistema` table. All the data in the column will be lost.
  - You are about to drop the `Venda_Detalhe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_tipo_sistema_id_fkey";

-- DropForeignKey
ALTER TABLE "Venda_Detalhe" DROP CONSTRAINT "Venda_Detalhe_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "Venda_Detalhe" DROP CONSTRAINT "Venda_Detalhe_vendaId_fkey";

-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "tipo_sistema_id";

-- AlterTable
ALTER TABLE "Tipo_Sistema" DROP COLUMN "descricao";

-- DropTable
DROP TABLE "Venda_Detalhe";

-- CreateTable
CREATE TABLE "VendaDetalhe" (
    "id" SERIAL NOT NULL,
    "vendaId" INTEGER NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "pontos" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "VendaDetalhe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VendaDetalhe_vendaId_produtoId_idx" ON "VendaDetalhe"("vendaId", "produtoId");

-- AddForeignKey
ALTER TABLE "VendaDetalhe" ADD CONSTRAINT "VendaDetalhe_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "Venda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendaDetalhe" ADD CONSTRAINT "VendaDetalhe_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
