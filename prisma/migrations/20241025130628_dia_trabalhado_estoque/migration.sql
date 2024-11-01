-- CreateTable
CREATE TABLE "dia_trabalhado_estoque" (
    "id" SERIAL NOT NULL,
    "pedidos" INTEGER NOT NULL,
    "realizados" INTEGER NOT NULL,
    "data_trabalhada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horario_entrada" TIMESTAMP(3) NOT NULL,
    "horario_saida" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER,

    CONSTRAINT "dia_trabalhado_estoque_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dia_trabalhado_estoque" ADD CONSTRAINT "dia_trabalhado_estoque_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
