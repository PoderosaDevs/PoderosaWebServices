/*
  Warnings:

  - The primary key for the `Avaliacao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Avaliacao` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Produto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Produto` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `id_produto` on the `Avaliacao` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `produtoId` on the `Venda_Detalhe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_CategoriaToProduto` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_id_produto_fkey";

-- DropForeignKey
ALTER TABLE "Venda_Detalhe" DROP CONSTRAINT "Venda_Detalhe_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "_CategoriaToProduto" DROP CONSTRAINT "_CategoriaToProduto_B_fkey";

-- AlterTable
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "id_produto",
ADD COLUMN     "id_produto" INTEGER NOT NULL,
ADD CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Produto_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Venda_Detalhe" DROP COLUMN "produtoId",
ADD COLUMN     "produtoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_CategoriaToProduto" DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Linha" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Linha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Linha_Tipo_Sistema" (
    "id" SERIAL NOT NULL,
    "id_linha" INTEGER NOT NULL,
    "id_tipo_sistema" INTEGER NOT NULL,

    CONSTRAINT "Linha_Tipo_Sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Linha_Produto" (
    "id" SERIAL NOT NULL,
    "id_linha" INTEGER NOT NULL,
    "id_produto" INTEGER NOT NULL,

    CONSTRAINT "Linha_Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Linha_Marca" (
    "id" SERIAL NOT NULL,
    "id_linha" INTEGER NOT NULL,
    "id_marca" INTEGER NOT NULL,

    CONSTRAINT "Linha_Marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LinhaTipoSistema" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LinhaProduto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LinhaMarca" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Linha_nome_idx" ON "Linha"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Linha_Tipo_Sistema_id_linha_id_tipo_sistema_key" ON "Linha_Tipo_Sistema"("id_linha", "id_tipo_sistema");

-- CreateIndex
CREATE UNIQUE INDEX "Linha_Produto_id_linha_id_produto_key" ON "Linha_Produto"("id_linha", "id_produto");

-- CreateIndex
CREATE UNIQUE INDEX "Linha_Marca_id_linha_id_marca_key" ON "Linha_Marca"("id_linha", "id_marca");

-- CreateIndex
CREATE UNIQUE INDEX "_LinhaTipoSistema_AB_unique" ON "_LinhaTipoSistema"("A", "B");

-- CreateIndex
CREATE INDEX "_LinhaTipoSistema_B_index" ON "_LinhaTipoSistema"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LinhaProduto_AB_unique" ON "_LinhaProduto"("A", "B");

-- CreateIndex
CREATE INDEX "_LinhaProduto_B_index" ON "_LinhaProduto"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LinhaMarca_AB_unique" ON "_LinhaMarca"("A", "B");

-- CreateIndex
CREATE INDEX "_LinhaMarca_B_index" ON "_LinhaMarca"("B");

-- CreateIndex
CREATE INDEX "Venda_Detalhe_vendaId_produtoId_idx" ON "Venda_Detalhe"("vendaId", "produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriaToProduto_AB_unique" ON "_CategoriaToProduto"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriaToProduto_B_index" ON "_CategoriaToProduto"("B");

-- AddForeignKey
ALTER TABLE "Venda_Detalhe" ADD CONSTRAINT "Venda_Detalhe_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Linha_Tipo_Sistema" ADD CONSTRAINT "Linha_Tipo_Sistema_id_linha_fkey" FOREIGN KEY ("id_linha") REFERENCES "Linha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Linha_Tipo_Sistema" ADD CONSTRAINT "Linha_Tipo_Sistema_id_tipo_sistema_fkey" FOREIGN KEY ("id_tipo_sistema") REFERENCES "Tipo_Sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Linha_Produto" ADD CONSTRAINT "Linha_Produto_id_linha_fkey" FOREIGN KEY ("id_linha") REFERENCES "Linha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Linha_Produto" ADD CONSTRAINT "Linha_Produto_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Linha_Marca" ADD CONSTRAINT "Linha_Marca_id_linha_fkey" FOREIGN KEY ("id_linha") REFERENCES "Linha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Linha_Marca" ADD CONSTRAINT "Linha_Marca_id_marca_fkey" FOREIGN KEY ("id_marca") REFERENCES "Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriaToProduto" ADD CONSTRAINT "_CategoriaToProduto_B_fkey" FOREIGN KEY ("B") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinhaTipoSistema" ADD CONSTRAINT "_LinhaTipoSistema_A_fkey" FOREIGN KEY ("A") REFERENCES "Linha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinhaTipoSistema" ADD CONSTRAINT "_LinhaTipoSistema_B_fkey" FOREIGN KEY ("B") REFERENCES "Tipo_Sistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinhaProduto" ADD CONSTRAINT "_LinhaProduto_A_fkey" FOREIGN KEY ("A") REFERENCES "Linha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinhaProduto" ADD CONSTRAINT "_LinhaProduto_B_fkey" FOREIGN KEY ("B") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinhaMarca" ADD CONSTRAINT "_LinhaMarca_A_fkey" FOREIGN KEY ("A") REFERENCES "Linha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinhaMarca" ADD CONSTRAINT "_LinhaMarca_B_fkey" FOREIGN KEY ("B") REFERENCES "Marca"("id") ON DELETE CASCADE ON UPDATE CASCADE;
