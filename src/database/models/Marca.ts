import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class Marca extends Model<InferAttributes<Marca>, InferCreationAttributes<Marca>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare cor: string;
}

Marca.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.TEXT, allowNull: false, unique: true },
    cor: { type: DataTypes.TEXT, allowNull: false },
  },
  { sequelize, tableName: "marca", timestamps: false }
);
