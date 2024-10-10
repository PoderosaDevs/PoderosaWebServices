// src/inputs/CategoriaInput.ts
import { InputType, Field } from 'type-graphql';

@InputType()
export class CategoriaInput {
  @Field()
  nome!: string;
}
