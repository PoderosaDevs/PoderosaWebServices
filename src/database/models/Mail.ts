import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class Mail extends Model<InferAttributes<Mail>, InferCreationAttributes<Mail>> {
  declare id: CreationOptional<number>;
  declare assunto: string | null;
  declare corpo: string | null;
  declare email: string | null;
  declare data_cadastro: Date | null;
  declare data_envio: Date | null;
  declare situacao_envio: number | null;
  declare origem: string | null;
}

Mail.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    assunto: { type: DataTypes.STRING(445), allowNull: true },
    corpo: { type: DataTypes.TEXT, allowNull: true },
    email: { type: DataTypes.STRING(245), allowNull: true },
    data_cadastro: { type: DataTypes.DATE, allowNull: true },
    data_envio: { type: DataTypes.DATE, allowNull: true },
    situacao_envio: { type: DataTypes.INTEGER, allowNull: true },
    origem: { type: DataTypes.STRING(100), allowNull: true },
  },
  { sequelize, tableName: "mail", timestamps: false }
);
