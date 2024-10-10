// src/inputs/AvaliacaoInput.ts
import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class AvaliacaoInput {
  @Field()
  nota!: number;

  @Field()
  comentario?: string;

  @Field()
  id_produto!: number;

  @Field()
  id_usuario!: number;
}
