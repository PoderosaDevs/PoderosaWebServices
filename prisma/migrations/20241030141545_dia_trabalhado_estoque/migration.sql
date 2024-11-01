/*
  Warnings:

  - You are about to drop the column `data_trabalhada` on the `dia_trabalhado_estoque` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dia_trabalhado_estoque" DROP COLUMN "data_trabalhada",
ADD COLUMN     "data_trabalho" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
