import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class DiaTrabalhado extends Model<
  InferAttributes<DiaTrabalhado>,
  InferCreationAttributes<DiaTrabalhado>
> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare data: Date;
  declare horario_entrada: Date;
  declare horario_saida: Date;
  declare observacao: string | null;
  declare is_present: boolean;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

DiaTrabalhado.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    data: { type: DataTypes.DATE, allowNull: false },
    horario_entrada: { type: DataTypes.DATE, allowNull: false },
    horario_saida: { type: DataTypes.DATE, allowNull: false },
    observacao: { type: DataTypes.TEXT, allowNull: true },
    is_present: { type: DataTypes.BOOLEAN, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: "dia_trabalhado", timestamps: false, indexes: [{ fields: ["user_id", "data"] }] }
);
