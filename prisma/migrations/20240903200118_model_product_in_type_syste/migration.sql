-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "id_tipo_sistema" INTEGER;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_id_tipo_sistema_fkey" FOREIGN KEY ("id_tipo_sistema") REFERENCES "Tipo_Sistema"("id") ON DELETE SET NULL ON UPDATE CASCADE;
