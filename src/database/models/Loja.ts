import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class Loja extends Model<InferAttributes<Loja>, InferCreationAttributes<Loja>> {
  declare id: CreationOptional<number>;
  declare nome_fantasia: string;
  declare razao_social: string;
}

Loja.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome_fantasia: { type: DataTypes.TEXT, allowNull: false },
    razao_social: { type: DataTypes.TEXT, allowNull: false },
  },
  { sequelize, tableName: "loja", timestamps: false }
);
