/*
  Warnings:

  - You are about to drop the column `pontos_objetivo` on the `meta` table. All the data in the column will be lost.
  - You are about to drop the column `etapa_numero` on the `meta_etapa` table. All the data in the column will be lost.
  - You are about to drop the column `importancia` on the `meta_etapa` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `meta_etapa` table. All the data in the column will be lost.
  - You are about to drop the column `recompensa` on the `meta_etapa` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `meta_etapa` table. All the data in the column will be lost.
  - Made the column `data_fim` on table `meta` required. This step will fail if there are existing NULL values in that column.
  - Made the column `marcaId` on table `meta` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "meta" DROP CONSTRAINT "meta_marcaId_fkey";

-- AlterTable
ALTER TABLE "meta" DROP COLUMN "pontos_objetivo",
ADD COLUMN     "objetivo_total" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "situacao" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "data_fim" SET NOT NULL,
ALTER COLUMN "data_fim" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "marcaId" SET NOT NULL;

-- AlterTable
ALTER TABLE "meta_etapa" DROP COLUMN "etapa_numero",
DROP COLUMN "importancia",
DROP COLUMN "quantidade",
DROP COLUMN "recompensa",
DROP COLUMN "valor",
ADD COLUMN     "nome" TEXT NOT NULL DEFAULT 'Etapa',
ADD COLUMN     "objetivo" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "meta" ADD CONSTRAINT "meta_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
