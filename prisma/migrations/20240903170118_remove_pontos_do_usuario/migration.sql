-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "pontos" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Venda" (
    "id" SERIAL NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "data_venda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pontos_totais" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("id")
);

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
CREATE INDEX "Venda_funcionarioId_data_venda_idx" ON "Venda"("funcionarioId", "data_venda");

-- CreateIndex
CREATE INDEX "VendaDetalhe_vendaId_produtoId_idx" ON "VendaDetalhe"("vendaId", "produtoId");

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendaDetalhe" ADD CONSTRAINT "VendaDetalhe_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "Venda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendaDetalhe" ADD CONSTRAINT "VendaDetalhe_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
