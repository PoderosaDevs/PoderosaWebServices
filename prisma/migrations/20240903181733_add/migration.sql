/*
  Warnings:

  - You are about to drop the `VendaDetalhe` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tipo_sistema_id` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VendaDetalhe" DROP CONSTRAINT "VendaDetalhe_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "VendaDetalhe" DROP CONSTRAINT "VendaDetalhe_vendaId_fkey";

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "tipo_sistema_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tipo_Sistema" ADD COLUMN     "descricao" TEXT;

-- DropTable
DROP TABLE "VendaDetalhe";

-- CreateTable
CREATE TABLE "Venda_Detalhe" (
    "id" SERIAL NOT NULL,
    "vendaId" INTEGER NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "pontos" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Venda_Detalhe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Venda_Detalhe_vendaId_produtoId_idx" ON "Venda_Detalhe"("vendaId", "produtoId");

-- AddForeignKey
ALTER TABLE "Venda_Detalhe" ADD CONSTRAINT "Venda_Detalhe_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "Venda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda_Detalhe" ADD CONSTRAINT "Venda_Detalhe_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_tipo_sistema_id_fkey" FOREIGN KEY ("tipo_sistema_id") REFERENCES "Tipo_Sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
