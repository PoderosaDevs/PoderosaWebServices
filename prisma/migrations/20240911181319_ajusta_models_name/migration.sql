/*
  Warnings:

  - You are about to drop the `Avaliacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dia_Trabalhado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Linha` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Linha_Marca` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Linha_Produto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Linha_Tipo_Sistema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Marca` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Produto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tipo_Sistema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario_Tipo_Sistema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Venda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Venda_Detalhe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoriaToProduto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LinhaMarca` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LinhaProduto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LinhaTipoSistema` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "type_person" AS ENUM ('USER', 'ADMIN', 'EMPLOYEE', 'MANAGER', 'GUEST');

-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_id_produto_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Dia_Trabalhado" DROP CONSTRAINT "Dia_Trabalhado_userId_fkey";

-- DropForeignKey
ALTER TABLE "Linha_Marca" DROP CONSTRAINT "Linha_Marca_id_linha_fkey";

-- DropForeignKey
ALTER TABLE "Linha_Marca" DROP CONSTRAINT "Linha_Marca_id_marca_fkey";

-- DropForeignKey
ALTER TABLE "Linha_Produto" DROP CONSTRAINT "Linha_Produto_id_linha_fkey";

-- DropForeignKey
ALTER TABLE "Linha_Produto" DROP CONSTRAINT "Linha_Produto_id_produto_fkey";

-- DropForeignKey
ALTER TABLE "Linha_Tipo_Sistema" DROP CONSTRAINT "Linha_Tipo_Sistema_id_linha_fkey";

-- DropForeignKey
ALTER TABLE "Linha_Tipo_Sistema" DROP CONSTRAINT "Linha_Tipo_Sistema_id_tipo_sistema_fkey";

-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_id_marca_fkey";

-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_id_tipo_sistema_fkey";

-- DropForeignKey
ALTER TABLE "Usuario_Tipo_Sistema" DROP CONSTRAINT "Usuario_Tipo_Sistema_id_tipo_sistema_fkey";

-- DropForeignKey
ALTER TABLE "Usuario_Tipo_Sistema" DROP CONSTRAINT "Usuario_Tipo_Sistema_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Venda" DROP CONSTRAINT "Venda_funcionarioId_fkey";

-- DropForeignKey
ALTER TABLE "Venda_Detalhe" DROP CONSTRAINT "Venda_Detalhe_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "Venda_Detalhe" DROP CONSTRAINT "Venda_Detalhe_vendaId_fkey";

-- DropForeignKey
ALTER TABLE "_CategoriaToProduto" DROP CONSTRAINT "_CategoriaToProduto_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoriaToProduto" DROP CONSTRAINT "_CategoriaToProduto_B_fkey";

-- DropForeignKey
ALTER TABLE "_LinhaMarca" DROP CONSTRAINT "_LinhaMarca_A_fkey";

-- DropForeignKey
ALTER TABLE "_LinhaMarca" DROP CONSTRAINT "_LinhaMarca_B_fkey";

-- DropForeignKey
ALTER TABLE "_LinhaProduto" DROP CONSTRAINT "_LinhaProduto_A_fkey";

-- DropForeignKey
ALTER TABLE "_LinhaProduto" DROP CONSTRAINT "_LinhaProduto_B_fkey";

-- DropForeignKey
ALTER TABLE "_LinhaTipoSistema" DROP CONSTRAINT "_LinhaTipoSistema_A_fkey";

-- DropForeignKey
ALTER TABLE "_LinhaTipoSistema" DROP CONSTRAINT "_LinhaTipoSistema_B_fkey";

-- DropTable
DROP TABLE "Avaliacao";

-- DropTable
DROP TABLE "Categoria";

-- DropTable
DROP TABLE "Dia_Trabalhado";

-- DropTable
DROP TABLE "Linha";

-- DropTable
DROP TABLE "Linha_Marca";

-- DropTable
DROP TABLE "Linha_Produto";

-- DropTable
DROP TABLE "Linha_Tipo_Sistema";

-- DropTable
DROP TABLE "Mail";

-- DropTable
DROP TABLE "Marca";

-- DropTable
DROP TABLE "Pedido";

-- DropTable
DROP TABLE "Produto";

-- DropTable
DROP TABLE "Tipo_Sistema";

-- DropTable
DROP TABLE "Usuario";

-- DropTable
DROP TABLE "Usuario_Tipo_Sistema";

-- DropTable
DROP TABLE "Venda";

-- DropTable
DROP TABLE "Venda_Detalhe";

-- DropTable
DROP TABLE "_CategoriaToProduto";

-- DropTable
DROP TABLE "_LinhaMarca";

-- DropTable
DROP TABLE "_LinhaProduto";

-- DropTable
DROP TABLE "_LinhaTipoSistema";

-- DropEnum
DROP TYPE "TypePerson";

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "uuid" CHAR(36) NOT NULL,
    "token_api" TEXT,
    "senha" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "is_whatsapp" BOOLEAN NOT NULL,
    "cep" TEXT,
    "endereco" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "tema" TEXT,
    "cpf" TEXT,
    "cnpj" TEXT,
    "situacao" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "data_nascimento" TIMESTAMP(3),
    "nome" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "usuario_foto" TEXT,
    "tipo_pessoa" "type_person" NOT NULL DEFAULT 'USER',

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_tipo_sistema" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_tipo_sistema" INTEGER NOT NULL,

    CONSTRAINT "usuario_tipo_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_sistema" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "tipo_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dia_trabalhado" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horario_entrada" TIMESTAMP(3) NOT NULL,
    "horario_saida" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT,
    "is_present" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dia_trabalhado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venda" (
    "id" SERIAL NOT NULL,
    "funcionario_id" INTEGER NOT NULL,
    "data_venda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pontos_totais" DOUBLE PRECISION NOT NULL,
    "situacao" BOOLEAN NOT NULL,

    CONSTRAINT "venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venda_detalhe" (
    "id" SERIAL NOT NULL,
    "venda_id" INTEGER NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "pontos" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "venda_detalhe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "estoque" INTEGER,
    "id_fornecedor" TEXT,
    "id_marca" INTEGER,
    "preco" DOUBLE PRECISION,
    "formato" TEXT,
    "data_expiracao" TIMESTAMP(3),
    "is_frete_gratis" BOOLEAN,
    "pontos" INTEGER,
    "peso_liquido" DOUBLE PRECISION,
    "peso_bruto" DOUBLE PRECISION,
    "largura" DOUBLE PRECISION,
    "altura" DOUBLE PRECISION,
    "profundidade" DOUBLE PRECISION,
    "volumes" INTEGER,
    "itens_por_caixa" INTEGER,
    "unidade_de_medida" TEXT,
    "situacao" BOOLEAN NOT NULL,
    "imagem" TEXT,
    "id_tipo_sistema" INTEGER,

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacao" (
    "id" SERIAL NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "id_produto" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marca" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "data_prevista" TIMESTAMP(3) NOT NULL,
    "total_produtos" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "ordem_compra" TEXT NOT NULL,
    "observacoes" TEXT NOT NULL,
    "observacoes_internas" TEXT NOT NULL,

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mail" (
    "id" SERIAL NOT NULL,
    "assunto" VARCHAR(445),
    "corpo" TEXT,
    "email" VARCHAR(245),
    "data_cadastro" TIMESTAMP(3),
    "data_envio" TIMESTAMP(3),
    "situacao_envio" INTEGER,
    "origem" VARCHAR(100),

    CONSTRAINT "mail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linha" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "linha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linha_tipo_sistema" (
    "id" SERIAL NOT NULL,
    "id_linha" INTEGER NOT NULL,
    "id_tipo_sistema" INTEGER NOT NULL,

    CONSTRAINT "linha_tipo_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linha_produto" (
    "id" SERIAL NOT NULL,
    "id_linha" INTEGER NOT NULL,
    "id_produto" INTEGER NOT NULL,

    CONSTRAINT "linha_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linha_marca" (
    "id" SERIAL NOT NULL,
    "id_linha" INTEGER NOT NULL,
    "id_marca" INTEGER NOT NULL,

    CONSTRAINT "linha_marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_categoria_to_produto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_linha_tipo_sistema" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_linha_produto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_linha_marca" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cpf_key" ON "usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cnpj_key" ON "usuario"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_tipo_sistema_id_usuario_id_tipo_sistema_key" ON "usuario_tipo_sistema"("id_usuario", "id_tipo_sistema");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_sistema_nome_key" ON "tipo_sistema"("nome");

-- CreateIndex
CREATE INDEX "dia_trabalhado_user_id_data_idx" ON "dia_trabalhado"("user_id", "data");

-- CreateIndex
CREATE UNIQUE INDEX "venda_funcionario_id_data_venda_key" ON "venda"("funcionario_id", "data_venda");

-- CreateIndex
CREATE INDEX "venda_detalhe_venda_id_produto_id_idx" ON "venda_detalhe"("venda_id", "produto_id");

-- CreateIndex
CREATE UNIQUE INDEX "produto_codigo_key" ON "produto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_nome_key" ON "categoria"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "marca_nome_key" ON "marca"("nome");

-- CreateIndex
CREATE INDEX "linha_nome_idx" ON "linha"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "linha_tipo_sistema_id_linha_id_tipo_sistema_key" ON "linha_tipo_sistema"("id_linha", "id_tipo_sistema");

-- CreateIndex
CREATE UNIQUE INDEX "linha_produto_id_linha_id_produto_key" ON "linha_produto"("id_linha", "id_produto");

-- CreateIndex
CREATE UNIQUE INDEX "linha_marca_id_linha_id_marca_key" ON "linha_marca"("id_linha", "id_marca");

-- CreateIndex
CREATE UNIQUE INDEX "_categoria_to_produto_AB_unique" ON "_categoria_to_produto"("A", "B");

-- CreateIndex
CREATE INDEX "_categoria_to_produto_B_index" ON "_categoria_to_produto"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_linha_tipo_sistema_AB_unique" ON "_linha_tipo_sistema"("A", "B");

-- CreateIndex
CREATE INDEX "_linha_tipo_sistema_B_index" ON "_linha_tipo_sistema"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_linha_produto_AB_unique" ON "_linha_produto"("A", "B");

-- CreateIndex
CREATE INDEX "_linha_produto_B_index" ON "_linha_produto"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_linha_marca_AB_unique" ON "_linha_marca"("A", "B");

-- CreateIndex
CREATE INDEX "_linha_marca_B_index" ON "_linha_marca"("B");

-- AddForeignKey
ALTER TABLE "usuario_tipo_sistema" ADD CONSTRAINT "usuario_tipo_sistema_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_tipo_sistema" ADD CONSTRAINT "usuario_tipo_sistema_id_tipo_sistema_fkey" FOREIGN KEY ("id_tipo_sistema") REFERENCES "tipo_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dia_trabalhado" ADD CONSTRAINT "dia_trabalhado_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venda" ADD CONSTRAINT "venda_funcionario_id_fkey" FOREIGN KEY ("funcionario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venda_detalhe" ADD CONSTRAINT "venda_detalhe_venda_id_fkey" FOREIGN KEY ("venda_id") REFERENCES "venda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venda_detalhe" ADD CONSTRAINT "venda_detalhe_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_id_marca_fkey" FOREIGN KEY ("id_marca") REFERENCES "marca"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_id_tipo_sistema_fkey" FOREIGN KEY ("id_tipo_sistema") REFERENCES "tipo_sistema"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linha_tipo_sistema" ADD CONSTRAINT "linha_tipo_sistema_id_linha_fkey" FOREIGN KEY ("id_linha") REFERENCES "linha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linha_tipo_sistema" ADD CONSTRAINT "linha_tipo_sistema_id_tipo_sistema_fkey" FOREIGN KEY ("id_tipo_sistema") REFERENCES "tipo_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linha_produto" ADD CONSTRAINT "linha_produto_id_linha_fkey" FOREIGN KEY ("id_linha") REFERENCES "linha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linha_produto" ADD CONSTRAINT "linha_produto_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linha_marca" ADD CONSTRAINT "linha_marca_id_linha_fkey" FOREIGN KEY ("id_linha") REFERENCES "linha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linha_marca" ADD CONSTRAINT "linha_marca_id_marca_fkey" FOREIGN KEY ("id_marca") REFERENCES "marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_categoria_to_produto" ADD CONSTRAINT "_categoria_to_produto_A_fkey" FOREIGN KEY ("A") REFERENCES "categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_categoria_to_produto" ADD CONSTRAINT "_categoria_to_produto_B_fkey" FOREIGN KEY ("B") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_linha_tipo_sistema" ADD CONSTRAINT "_linha_tipo_sistema_A_fkey" FOREIGN KEY ("A") REFERENCES "linha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_linha_tipo_sistema" ADD CONSTRAINT "_linha_tipo_sistema_B_fkey" FOREIGN KEY ("B") REFERENCES "tipo_sistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_linha_produto" ADD CONSTRAINT "_linha_produto_A_fkey" FOREIGN KEY ("A") REFERENCES "linha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_linha_produto" ADD CONSTRAINT "_linha_produto_B_fkey" FOREIGN KEY ("B") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_linha_marca" ADD CONSTRAINT "_linha_marca_A_fkey" FOREIGN KEY ("A") REFERENCES "linha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_linha_marca" ADD CONSTRAINT "_linha_marca_B_fkey" FOREIGN KEY ("B") REFERENCES "marca"("id") ON DELETE CASCADE ON UPDATE CASCADE;
