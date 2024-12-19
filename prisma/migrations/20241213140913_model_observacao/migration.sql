-- CreateTable
CREATE TABLE "Observacao" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "data" TIMESTAMP(3),
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Observacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Observacao" ADD CONSTRAINT "Observacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
