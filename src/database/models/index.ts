import { JunctionTables } from "../../config/junctionTables";
import { Categoria } from "./Categoria";
import { DiaTrabalhado } from "./DiaTrabalhado";
import { Linha } from "./Linha";
import { LinhaProduto } from "./LinhaProduto";
import { Loja } from "./Loja";
import { Mail } from "./Mail";
import { Marca } from "./Marca";
import { Meta } from "./Meta";
import { MetaEtapa } from "./MetaEtapa";
import { Observacao } from "./Observacao";
import { Produto } from "./Produto";
import { Usuario } from "./Usuario";
import { Venda } from "./Venda";
import { VendaDetalhe } from "./VendaDetalhe";

/**
 * Registra todas as associações entre models. Deve ser chamado uma única vez
 * no bootstrap do servidor, depois que os nomes reais das tabelas de junção
 * N:N (Prisma implícitas) forem resolvidos contra o banco.
 */
export function associateModels(junctions: JunctionTables): void {
  // Usuario <-> DiaTrabalhado (1:N)
  Usuario.hasMany(DiaTrabalhado, { foreignKey: "user_id", as: "dias_trabalhados" });
  DiaTrabalhado.belongsTo(Usuario, { foreignKey: "user_id", as: "usuario" });

  // Usuario <-> Observacao (1:N)
  Usuario.hasMany(Observacao, { foreignKey: "usuario_id", as: "observacoes" });
  Observacao.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

  // Usuario/Loja <-> Venda (1:N)
  Usuario.hasMany(Venda, { foreignKey: "funcionario_id", as: "vendas" });
  Venda.belongsTo(Usuario, { foreignKey: "funcionario_id", as: "funcionario" });

  Loja.hasMany(Venda, { foreignKey: "loja_id", as: "vendas" });
  Venda.belongsTo(Loja, { foreignKey: "loja_id", as: "loja" });

  // Venda <-> VendaDetalhe (1:N)
  Venda.hasMany(VendaDetalhe, { foreignKey: "venda_id", as: "venda_detalhe" });
  VendaDetalhe.belongsTo(Venda, { foreignKey: "venda_id", as: "venda" });

  // Produto <-> VendaDetalhe (1:N)
  Produto.hasMany(VendaDetalhe, { foreignKey: "produto_id", as: "venda_detalhe" });
  VendaDetalhe.belongsTo(Produto, { foreignKey: "produto_id", as: "produto" });

  // Marca <-> Produto (1:N)
  Marca.hasMany(Produto, { foreignKey: "id_marca", as: "produtos" });
  Produto.belongsTo(Marca, { foreignKey: "id_marca", as: "marca" });

  // Marca <-> Linha (1:N)
  Marca.hasMany(Linha, { foreignKey: "marcaId", as: "linhas" });
  Linha.belongsTo(Marca, { foreignKey: "marcaId", as: "marca" });

  // Marca <-> Meta (1:N)
  Marca.hasMany(Meta, { foreignKey: "marcaId", as: "metas" });
  Meta.belongsTo(Marca, { foreignKey: "marcaId", as: "marca" });

  // Meta <-> MetaEtapa (1:N)
  Meta.hasMany(MetaEtapa, { foreignKey: "meta_id", as: "meta_etapas" });
  MetaEtapa.belongsTo(Meta, { foreignKey: "meta_id", as: "meta" });

  // Linha <-> Produto (tabela explícita legada "linha_produto", com id próprio)
  Linha.hasMany(LinhaProduto, { foreignKey: "id_linha", as: "linha_produto" });
  LinhaProduto.belongsTo(Linha, { foreignKey: "id_linha", as: "linha" });
  Produto.hasMany(LinhaProduto, { foreignKey: "id_produto", as: "linha_produto" });
  LinhaProduto.belongsTo(Produto, { foreignKey: "id_produto", as: "produto" });

  // Categoria <-> Produto (N:N implícita)
  Categoria.belongsToMany(Produto, {
    through: junctions.categoriaProduto,
    foreignKey: "A",
    otherKey: "B",
    as: "produtos",
  });
  Produto.belongsToMany(Categoria, {
    through: junctions.categoriaProduto,
    foreignKey: "B",
    otherKey: "A",
    as: "categorias",
  });

  // Linha <-> Produto (N:N implícita, além da tabela explícita acima)
  Linha.belongsToMany(Produto, {
    through: junctions.linhaProduto,
    foreignKey: "A",
    otherKey: "B",
    as: "produtos",
  });
  Produto.belongsToMany(Linha, {
    through: junctions.linhaProduto,
    foreignKey: "B",
    otherKey: "A",
    as: "linhas",
  });

  // Meta <-> Usuario (N:N implícita)
  Meta.belongsToMany(Usuario, {
    through: junctions.metaUsuario,
    foreignKey: "A",
    otherKey: "B",
    as: "usuarios",
  });
  Usuario.belongsToMany(Meta, {
    through: junctions.metaUsuario,
    foreignKey: "B",
    otherKey: "A",
    as: "metas",
  });
}

export {
  Categoria,
  DiaTrabalhado,
  Linha,
  LinhaProduto,
  Loja,
  Mail,
  Marca,
  Meta,
  MetaEtapa,
  Observacao,
  Produto,
  Usuario,
  Venda,
  VendaDetalhe,
};
