import { InputType, Field, Int, Float } from 'type-graphql';

@InputType()  // Marca esta classe como um tipo de entrada para o GraphQL
export class MetaEtapaInputs {
  @Field(() => Int)  // Define o tipo do campo
  etapa_numero!: number;

  @Field(() => Int)
  quantidade!: number;

  @Field()
  recompensa!: string;

  @Field(() => Float)  // Define que o valor é um número com ponto flutuante
  valor!: number;

  @Field(() => Int)  // Definindo como Int se for um número inteiro
  importancia!: number;
}

@InputType()  // Agora a classe é reconhecida como tipo de entrada no GraphQL
export class MetaEtapaUpdateInputs {
  @Field(() => Int)
  id!: number;
  
  @Field(() => Int)  // Define o tipo do campo
  etapa_numero!: number;

  @Field(() => Int)
  quantidade!: number;

  @Field()
  recompensa!: string;

  @Field(() => Float)  // Define que o valor é um número com ponto flutuante
  valor!: number;

  @Field(() => Int)  // Definindo como Int se for um número inteiro
  importancia!: number;

  @Field()  // Se o campo for de tipo booleano, também precisa ser decorado com @Field
  atingida!: boolean;
}
