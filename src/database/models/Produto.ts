import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class Produto extends Model<InferAttributes<Produto>, InferCreationAttributes<Produto>> {
  declare id: CreationOptional<number>;
  declare codigo: string;
  declare nome: string;
  declare descricao: string | null;
  declare id_marca: number | null;
  declare preco: number | null;
  declare pontos: number | null;
  declare situacao: boolean;
  declare imagem: string | null;
  declare id_tipo_sistema: number | null;
}

Produto.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    codigo: { type: DataTypes.TEXT, allowNull: false, unique: true },
    nome: { type: DataTypes.TEXT, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    id_marca: { type: DataTypes.INTEGER, allowNull: true },
    preco: { type: DataTypes.DOUBLE, allowNull: true },
    pontos: { type: DataTypes.INTEGER, allowNull: true },
    situacao: { type: DataTypes.BOOLEAN, allowNull: false },
    imagem: { type: DataTypes.TEXT, allowNull: true },
    id_tipo_sistema: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: "produto", timestamps: false }
);
