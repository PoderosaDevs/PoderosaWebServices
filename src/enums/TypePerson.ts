// src/enums/TypePerson.ts
import { registerEnumType } from 'type-graphql';

export enum TypePerson {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
}

registerEnumType(TypePerson, {
  name: 'TypePerson', // Nome do enum no GraphQL
  description: 'Tipo de pessoa', // Descrição opcional
});
