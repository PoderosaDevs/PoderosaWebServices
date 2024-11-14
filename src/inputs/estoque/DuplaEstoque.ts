import { InputType, Field } from "type-graphql";

@InputType()
export class DuplaEstoqueInput {
  @Field()
  usuarioId1!: number; // ID do primeiro usuário da dupla

  @Field()
  usuarioId2!: number; // ID do segundo usuário da dupla
}
