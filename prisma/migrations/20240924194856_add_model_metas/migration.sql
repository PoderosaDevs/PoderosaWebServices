-- CreateTable
CREATE TABLE "Meta" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3) NOT NULL,
    "marca_id" INTEGER NOT NULL,
    "quantidade_total" INTEGER NOT NULL,
    "situacao" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaEtapa" (
    "id" SERIAL NOT NULL,
    "meta_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetaEtapa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UsuarioMetas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Meta_marca_id_idx" ON "Meta"("marca_id");

-- CreateIndex
CREATE UNIQUE INDEX "_UsuarioMetas_AB_unique" ON "_UsuarioMetas"("A", "B");

-- CreateIndex
CREATE INDEX "_UsuarioMetas_B_index" ON "_UsuarioMetas"("B");

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaEtapa" ADD CONSTRAINT "MetaEtapa_meta_id_fkey" FOREIGN KEY ("meta_id") REFERENCES "Meta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioMetas" ADD CONSTRAINT "_UsuarioMetas_A_fkey" FOREIGN KEY ("A") REFERENCES "Meta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioMetas" ADD CONSTRAINT "_UsuarioMetas_B_fkey" FOREIGN KEY ("B") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
