import { ObjectType, Field, ID } from "type-graphql";
import { UsuarioModel } from "../Usuario";

@ObjectType()
export class DuplaEstoqueModel {
  @Field(() => ID)
  id!: number;

  @Field()
  usuarioId1!: number; // ID do primeiro usuário da dupla

  @Field()
  usuarioId2!: number; // ID do segundo usuário da dupla

  // Relacionamentos com o modelo de Usuario completo para o primeiro e segundo usuário
  @Field(() => UsuarioModel)
  usuario1!: UsuarioModel;

  @Field(() => UsuarioModel)
  usuario2!: UsuarioModel;
}
