import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";
import { TipoPessoa } from "../../types/enums";

export class Usuario extends Model<InferAttributes<Usuario>, InferCreationAttributes<Usuario>> {
  declare id: CreationOptional<number>;
  declare uuid: string;
  declare token_api: string | null;
  declare senha: string;
  declare email: string;
  declare complemento: string | null;
  declare tema: string | null;
  declare cpf: string | null;
  declare situacao: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare deleted_at: Date | null;
  declare updated_at: Date | null;
  declare data_nascimento: Date | null;
  declare nome: string;
  declare funcao: string | null;
  declare usuario_foto: string | null;
  declare tipo_pessoa: CreationOptional<TipoPessoa>;
}

Usuario.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uuid: { type: DataTypes.CHAR(36), allowNull: false },
    token_api: { type: DataTypes.TEXT, allowNull: true },
    senha: { type: DataTypes.TEXT, allowNull: false },
    email: { type: DataTypes.TEXT, allowNull: false, unique: true },
    complemento: { type: DataTypes.TEXT, allowNull: true },
    tema: { type: DataTypes.TEXT, allowNull: true },
    cpf: { type: DataTypes.TEXT, allowNull: true, unique: true },
    situacao: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
    updated_at: { type: DataTypes.DATE, allowNull: true },
    data_nascimento: { type: DataTypes.DATE, allowNull: true },
    nome: { type: DataTypes.TEXT, allowNull: false },
    funcao: { type: DataTypes.TEXT, allowNull: true },
    usuario_foto: { type: DataTypes.TEXT, allowNull: true },
    tipo_pessoa: {
      type: DataTypes.ENUM(...Object.values(TipoPessoa)),
      allowNull: false,
      defaultValue: TipoPessoa.EMPLOYEE,
    },
  },
  { sequelize, tableName: "usuario", timestamps: false }
);
