import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class Observacao extends Model<InferAttributes<Observacao>, InferCreationAttributes<Observacao>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare data: Date | null;
  declare usuario_id: number;
}

Observacao.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    data: { type: DataTypes.DATE, allowNull: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "observacao", timestamps: false }
);
