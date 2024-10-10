/*
  Warnings:

  - Added the required column `loja_id` to the `venda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "venda" ADD COLUMN     "loja_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "loja" (
    "id" SERIAL NOT NULL,
    "nome_fantasia" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,

    CONSTRAINT "loja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loja_nome_fantasia_key" ON "loja"("nome_fantasia");

-- CreateIndex
CREATE UNIQUE INDEX "loja_razao_social_key" ON "loja"("razao_social");

-- AddForeignKey
ALTER TABLE "venda" ADD CONSTRAINT "venda_loja_id_fkey" FOREIGN KEY ("loja_id") REFERENCES "loja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
