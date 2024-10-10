-- DropForeignKey
ALTER TABLE "venda" DROP CONSTRAINT "venda_loja_id_fkey";

-- DropIndex
DROP INDEX "loja_nome_fantasia_key";

-- DropIndex
DROP INDEX "loja_razao_social_key";

-- AlterTable
ALTER TABLE "venda" ALTER COLUMN "loja_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "venda" ADD CONSTRAINT "venda_loja_id_fkey" FOREIGN KEY ("loja_id") REFERENCES "loja"("id") ON DELETE SET NULL ON UPDATE CASCADE;
