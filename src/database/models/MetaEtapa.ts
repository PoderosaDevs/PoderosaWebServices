import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class MetaEtapa extends Model<InferAttributes<MetaEtapa>, InferCreationAttributes<MetaEtapa>> {
  declare id: CreationOptional<number>;
  declare meta_id: number;
  declare nome: string;
  declare quantidade_objetivo: CreationOptional<number>;
  declare quantidade_atual: CreationOptional<number>;
  declare atingida: CreationOptional<boolean>;
}

MetaEtapa.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    meta_id: { type: DataTypes.INTEGER, allowNull: false },
    nome: { type: DataTypes.TEXT, allowNull: false },
    quantidade_objetivo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    quantidade_atual: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    atingida: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, tableName: "meta_etapa", timestamps: false, indexes: [{ fields: ["meta_id"] }] }
);
