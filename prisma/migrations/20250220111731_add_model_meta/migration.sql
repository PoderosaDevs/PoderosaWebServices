/*
  Warnings:

  - You are about to drop the `Meta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MetaEtapa` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Meta" DROP CONSTRAINT "Meta_marca_id_fkey";

-- DropForeignKey
ALTER TABLE "MetaEtapa" DROP CONSTRAINT "MetaEtapa_meta_id_fkey";

-- DropForeignKey
ALTER TABLE "_UsuarioMetas" DROP CONSTRAINT "_UsuarioMetas_A_fkey";

-- DropTable
DROP TABLE "Meta";

-- DropTable
DROP TABLE "MetaEtapa";

-- CreateTable
CREATE TABLE "meta" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "usuario_id" INTEGER NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fim" TIMESTAMP(3),
    "pontos_objetivo" DOUBLE PRECISION NOT NULL,
    "marcaId" INTEGER,

    CONSTRAINT "meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meta_etapa" (
    "id" SERIAL NOT NULL,
    "meta_id" INTEGER NOT NULL,
    "etapa_numero" INTEGER NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "recompensa" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "atingida" BOOLEAN NOT NULL DEFAULT false,
    "importancia" INTEGER NOT NULL,

    CONSTRAINT "meta_etapa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "meta_usuario_id_data_inicio_key" ON "meta"("usuario_id", "data_inicio");

-- CreateIndex
CREATE INDEX "meta_etapa_meta_id_idx" ON "meta_etapa"("meta_id");

-- AddForeignKey
ALTER TABLE "meta" ADD CONSTRAINT "meta_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "marca"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meta_etapa" ADD CONSTRAINT "meta_etapa_meta_id_fkey" FOREIGN KEY ("meta_id") REFERENCES "meta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioMetas" ADD CONSTRAINT "_UsuarioMetas_A_fkey" FOREIGN KEY ("A") REFERENCES "meta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
