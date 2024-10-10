/*
  Warnings:

  - You are about to alter the column `pontos` on the `venda_detalhe` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "venda_detalhe" ALTER COLUMN "pontos" SET DATA TYPE INTEGER;
