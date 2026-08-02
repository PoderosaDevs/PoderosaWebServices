import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class Categoria extends Model<InferAttributes<Categoria>, InferCreationAttributes<Categoria>> {
  declare id: CreationOptional<number>;
  declare nome: string;
}

Categoria.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.TEXT, allowNull: false, unique: true },
  },
  { sequelize, tableName: "categoria", timestamps: false }
);
