/*
  Warnings:

  - You are about to drop the `_linha_tipo_sistema` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nome]` on the table `linha` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_linha_tipo_sistema" DROP CONSTRAINT "_linha_tipo_sistema_A_fkey";

-- DropForeignKey
ALTER TABLE "_linha_tipo_sistema" DROP CONSTRAINT "_linha_tipo_sistema_B_fkey";

-- AlterTable
ALTER TABLE "usuario" ALTER COLUMN "tipo_pessoa" SET DEFAULT 'EMPLOYEE';

-- DropTable
DROP TABLE "_linha_tipo_sistema";

-- CreateIndex
CREATE UNIQUE INDEX "linha_nome_key" ON "linha"("nome");
