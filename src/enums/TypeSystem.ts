// src/enums/TypeSystem.ts
import { registerEnumType } from 'type-graphql';

export enum TypeSystem {
  ESTOQUE = 'ESTOQUE',
  SITE = 'SITE',
  BACKOFFICE = 'BACKOFFICE',
  SALES = 'SALES',
  ALL = 'ALL'
}

registerEnumType(TypeSystem, {
  name: 'TypeSystem', // Nome do enum no GraphQL
  description: 'Tipo de sistema', // Descrição opcional
});
