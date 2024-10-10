/*
  Warnings:

  - You are about to drop the `_linha_marca` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `linha_marca` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `marcaId` to the `linha` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_linha_marca" DROP CONSTRAINT "_linha_marca_A_fkey";

-- DropForeignKey
ALTER TABLE "_linha_marca" DROP CONSTRAINT "_linha_marca_B_fkey";

-- DropForeignKey
ALTER TABLE "linha_marca" DROP CONSTRAINT "linha_marca_id_linha_fkey";

-- DropForeignKey
ALTER TABLE "linha_marca" DROP CONSTRAINT "linha_marca_id_marca_fkey";

-- AlterTable
ALTER TABLE "linha" ADD COLUMN     "marcaId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_linha_marca";

-- DropTable
DROP TABLE "linha_marca";

-- AddForeignKey
ALTER TABLE "linha" ADD CONSTRAINT "linha_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
