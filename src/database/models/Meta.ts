import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";
import { MetaSituacao } from "../../types/enums";

export class Meta extends Model<InferAttributes<Meta>, InferCreationAttributes<Meta>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare descricao: string | null;
  declare quantidade_objetivo: number;
  declare quantidade_atual: CreationOptional<number>;
  declare data_inicio: CreationOptional<Date>;
  declare data_fim: Date;
  declare situacao: CreationOptional<MetaSituacao>;
  // Coluna literal "marcaId" (camelCase) - assim foi criada originalmente no banco.
  declare marcaId: number;
}

Meta.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.TEXT, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    quantidade_objetivo: { type: DataTypes.INTEGER, allowNull: false },
    quantidade_atual: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    data_inicio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    data_fim: { type: DataTypes.DATE, allowNull: false },
    situacao: {
      type: DataTypes.ENUM(...Object.values(MetaSituacao)),
      allowNull: false,
      defaultValue: MetaSituacao.PENDENTE,
    },
    marcaId: { type: DataTypes.INTEGER, allowNull: false, field: "marcaId" },
  },
  {
    sequelize,
    tableName: "meta",
    timestamps: false,
    indexes: [{ unique: true, fields: ["marcaId", "nome", "data_inicio"] }],
  }
);
