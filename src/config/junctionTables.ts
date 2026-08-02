import { QueryTypes } from "sequelize";
import { sequelize } from "./database";
import { logger } from "../utils/logger";

/**
 * As relacoes N:N abaixo foram criadas implicitamente pelo Prisma (schema
 * antigo) e o nome exato da tabela de juncao no Postgres depende de como o
 * Prisma as nomeou historicamente (o schema.prisma atual nao guarda esse
 * nome quando ele segue a convencao padrao do Prisma). Para nao arriscar
 * "adivinhar" um nome errado e quebrar leitura/escrita em producao, cada
 * relacao tenta, em ordem, os nomes candidatos e usa o primeiro que
 * realmente existir no banco.
 */
const candidatos = {
  categoriaProduto: ["_categoria_to_produto", "_CategoriaToProduto"],
  linhaProduto: ["_linha_produto", "_LinhaToProduto", "_LinhaProduto"],
  metaUsuario: ["_MetaToUsuario", "_UsuarioMetas", "_metaTousuario", "_meta_to_usuario"],
};

async function tableExists(name: string): Promise<boolean> {
  const rows = await sequelize.query<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1 FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = :name
     ) as "exists"`,
    { replacements: { name }, type: QueryTypes.SELECT }
  );
  return Boolean(rows[0]?.exists);
}

async function resolveOne(chave: keyof typeof candidatos): Promise<string> {
  for (const nome of candidatos[chave]) {
    if (await tableExists(nome)) {
      logger.info(`Tabela de juncao "${chave}" resolvida para "${nome}".`);
      return nome;
    }
  }
  throw new Error(
    `Nao foi possivel localizar a tabela de juncao para "${chave}". ` +
      `Tentei: ${candidatos[chave].join(", ")}. ` +
      `Verifique o nome real no banco (information_schema.tables) e adicione-o em src/config/junctionTables.ts.`
  );
}

export interface JunctionTables {
  categoriaProduto: string;
  linhaProduto: string;
  metaUsuario: string;
}

let cache: JunctionTables | null = null;

export async function resolveJunctionTables(): Promise<JunctionTables> {
  if (cache) return cache;
  cache = {
    categoriaProduto: await resolveOne("categoriaProduto"),
    linhaProduto: await resolveOne("linhaProduto"),
    metaUsuario: await resolveOne("metaUsuario"),
  };
  return cache;
}
