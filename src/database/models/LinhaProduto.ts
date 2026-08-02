import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";

/** Tabela explicita legada (id proprio) - independente da relacao N:N implicita linha<->produto. */
export class LinhaProduto extends Model<
  InferAttributes<LinhaProduto>,
  InferCreationAttributes<LinhaProduto>
> {
  declare id: CreationOptional<number>;
  declare id_linha: number;
  declare id_produto: number;
}

LinhaProduto.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_linha: { type: DataTypes.INTEGER, allowNull: false },
    id_produto: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: "linha_produto",
    timestamps: false,
    indexes: [{ unique: true, fields: ["id_linha", "id_produto"] }],
  }
);
