import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class VendaDetalhe extends Model<
  InferAttributes<VendaDetalhe>,
  InferCreationAttributes<VendaDetalhe>
> {
  declare id: CreationOptional<number>;
  declare venda_id: number;
  declare produto_id: number;
  declare quantidade: number;
  declare pontos: number;
}

VendaDetalhe.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    venda_id: { type: DataTypes.INTEGER, allowNull: false },
    produto_id: { type: DataTypes.INTEGER, allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    pontos: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "venda_detalhe", timestamps: false, indexes: [{ fields: ["venda_id", "produto_id"] }] }
);
