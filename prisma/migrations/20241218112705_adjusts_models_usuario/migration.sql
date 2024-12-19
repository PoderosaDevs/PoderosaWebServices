/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `dia_trabalhado_estoque` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "dia_trabalhado_estoque" DROP CONSTRAINT "dia_trabalhado_estoque_usuarioId_fkey";

-- AlterTable
ALTER TABLE "dia_trabalhado_estoque" DROP COLUMN "usuarioId",
ADD COLUMN     "usuario_id" INTEGER;

-- AddForeignKey
ALTER TABLE "dia_trabalhado_estoque" ADD CONSTRAINT "dia_trabalhado_estoque_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
