import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class Linha extends Model<InferAttributes<Linha>, InferCreationAttributes<Linha>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  // Coluna literal "marcaId" (camelCase) - assim foi criada originalmente no banco.
  declare marcaId: number;
}

Linha.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.TEXT, allowNull: false, unique: true },
    marcaId: { type: DataTypes.INTEGER, allowNull: false, field: "marcaId" },
  },
  { sequelize, tableName: "linha", timestamps: false, indexes: [{ fields: ["nome"] }] }
);
