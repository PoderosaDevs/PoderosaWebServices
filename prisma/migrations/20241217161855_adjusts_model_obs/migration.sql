/*
  Warnings:

  - You are about to drop the `Observacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Observacao" DROP CONSTRAINT "Observacao_usuario_id_fkey";

-- DropTable
DROP TABLE "Observacao";

-- CreateTable
CREATE TABLE "observacao" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "data" TIMESTAMP(3),
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "observacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "observacao" ADD CONSTRAINT "observacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
