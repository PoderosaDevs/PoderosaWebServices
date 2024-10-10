import { ObjectType, Field, Int } from "type-graphql";
import { UsuarioModel } from "../Usuario";
import { MarcaModel } from "../Marca";

@ObjectType()
export class MetaModel {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  quantidade!: number;

  @Field(() => Date)
  data_inicio!: Date;

  @Field(() => Date)
  data_fim!: Date;

  @Field(() => Int)
  marca_id!: number;

  @Field(() => Int, { nullable: true })
  usuario_id?: number; // Opcional se a meta for associada a um usuário

  @Field(() => [UsuarioModel], { nullable: true })
  usuarios?: UsuarioModel[];

  @Field(() => MarcaModel)
  marca!: MarcaModel;

  @Field()
  situacao!: boolean;

  @Field(() => [Int], { nullable: true })
  etapas?: Etapa[]; // Lista de etapas, se existir
}



@ObjectType()
export class Etapa {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  quantidade!: number; // Quantidade para esta etapa

  @Field(() => Int)
  meta_id!: number; // ID da meta associada
}
