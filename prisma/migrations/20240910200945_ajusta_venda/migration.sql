/*
  Warnings:

  - You are about to alter the column `pontos` on the `Produto` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[funcionarioId,data_venda]` on the table `Venda` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Venda_funcionarioId_data_venda_idx";

-- AlterTable
ALTER TABLE "Produto" ALTER COLUMN "descricao" DROP NOT NULL,
ALTER COLUMN "estoque" DROP NOT NULL,
ALTER COLUMN "is_frete_gratis" DROP NOT NULL,
ALTER COLUMN "preco" DROP NOT NULL,
ALTER COLUMN "pontos" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "situacao" SET DEFAULT true,
ALTER COLUMN "usuario_foto" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Venda_funcionarioId_data_venda_key" ON "Venda"("funcionarioId", "data_venda");
