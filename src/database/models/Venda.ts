import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class Venda extends Model<InferAttributes<Venda>, InferCreationAttributes<Venda>> {
  declare id: CreationOptional<number>;
  declare funcionario_id: number;
  declare data_venda: CreationOptional<Date>;
  declare pontos_totais: number;
  declare situacao: boolean;
  declare loja_id: number | null;
}

Venda.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    funcionario_id: { type: DataTypes.INTEGER, allowNull: false },
    data_venda: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    pontos_totais: { type: DataTypes.DOUBLE, allowNull: false },
    situacao: { type: DataTypes.BOOLEAN, allowNull: false },
    loja_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    tableName: "venda",
    timestamps: false,
    indexes: [{ unique: true, fields: ["funcionario_id", "data_venda"] }],
  }
);
