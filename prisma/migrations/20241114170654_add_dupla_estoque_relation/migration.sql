-- CreateTable
CREATE TABLE "dupla_estoque" (
    "id" SERIAL NOT NULL,
    "usuarioId1" INTEGER NOT NULL,
    "usuarioId2" INTEGER NOT NULL,
    "data_associacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dupla_estoque_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dupla_estoque_usuarioId1_usuarioId2_key" ON "dupla_estoque"("usuarioId1", "usuarioId2");

-- AddForeignKey
ALTER TABLE "dupla_estoque" ADD CONSTRAINT "dupla_estoque_usuarioId1_fkey" FOREIGN KEY ("usuarioId1") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dupla_estoque" ADD CONSTRAINT "dupla_estoque_usuarioId2_fkey" FOREIGN KEY ("usuarioId2") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
