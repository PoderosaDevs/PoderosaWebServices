/*
  Warnings:

  - Added the required column `situacao` to the `Venda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Venda" ADD COLUMN     "situacao" BOOLEAN NOT NULL;
