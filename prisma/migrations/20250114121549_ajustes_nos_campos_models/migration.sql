/*
  Warnings:

  - You are about to drop the column `altura` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `data_expiracao` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `estoque` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `formato` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `id_fornecedor` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `is_frete_gratis` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `itens_por_caixa` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `largura` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `peso_bruto` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `peso_liquido` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `profundidade` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `unidade_de_medida` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `volumes` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `cep` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `cnpj` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `is_whatsapp` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the `avaliacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dia_trabalhado_estoque` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dupla_estoque` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `linha_tipo_sistema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tipo_sistema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario_tipo_sistema` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cor` to the `marca` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "avaliacao" DROP CONSTRAINT "avaliacao_id_produto_fkey";

-- DropForeignKey
ALTER TABLE "avaliacao" DROP CONSTRAINT "avaliacao_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "dia_trabalhado_estoque" DROP CONSTRAINT "dia_trabalhado_estoque_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "dupla_estoque" DROP CONSTRAINT "dupla_estoque_usuarioId1_fkey";

-- DropForeignKey
ALTER TABLE "dupla_estoque" DROP CONSTRAINT "dupla_estoque_usuarioId2_fkey";

-- DropForeignKey
ALTER TABLE "linha_tipo_sistema" DROP CONSTRAINT "linha_tipo_sistema_id_linha_fkey";

-- DropForeignKey
ALTER TABLE "linha_tipo_sistema" DROP CONSTRAINT "linha_tipo_sistema_id_tipo_sistema_fkey";

-- DropForeignKey
ALTER TABLE "produto" DROP CONSTRAINT "produto_id_tipo_sistema_fkey";

-- DropForeignKey
ALTER TABLE "usuario_tipo_sistema" DROP CONSTRAINT "usuario_tipo_sistema_id_tipo_sistema_fkey";

-- DropForeignKey
ALTER TABLE "usuario_tipo_sistema" DROP CONSTRAINT "usuario_tipo_sistema_id_usuario_fkey";

-- DropIndex
DROP INDEX "usuario_cnpj_key";

-- AlterTable
ALTER TABLE "marca" ADD COLUMN     "cor" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "produto" DROP COLUMN "altura",
DROP COLUMN "data_expiracao",
DROP COLUMN "estoque",
DROP COLUMN "formato",
DROP COLUMN "id_fornecedor",
DROP COLUMN "is_frete_gratis",
DROP COLUMN "itens_por_caixa",
DROP COLUMN "largura",
DROP COLUMN "peso_bruto",
DROP COLUMN "peso_liquido",
DROP COLUMN "profundidade",
DROP COLUMN "unidade_de_medida",
DROP COLUMN "volumes";

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "cep",
DROP COLUMN "cnpj",
DROP COLUMN "endereco",
DROP COLUMN "is_whatsapp",
DROP COLUMN "numero",
DROP COLUMN "telefone";

-- DropTable
DROP TABLE "avaliacao";

-- DropTable
DROP TABLE "dia_trabalhado_estoque";

-- DropTable
DROP TABLE "dupla_estoque";

-- DropTable
DROP TABLE "linha_tipo_sistema";

-- DropTable
DROP TABLE "pedido";

-- DropTable
DROP TABLE "tipo_sistema";

-- DropTable
DROP TABLE "usuario_tipo_sistema";
