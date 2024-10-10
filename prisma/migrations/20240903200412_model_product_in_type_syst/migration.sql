/*
  Warnings:

  - You are about to drop the `VendaDetalhe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VendaDetalhe" DROP CONSTRAINT "VendaDetalhe_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "VendaDetalhe" DROP CONSTRAINT "VendaDetalhe_vendaId_fkey";

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
