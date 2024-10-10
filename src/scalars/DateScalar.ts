// src/scalars/DateScalar.ts
import { GraphQLScalarType, Kind } from 'graphql';

// Define o scalar Date
export const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom scalar type for Date',
  parseValue(value: unknown): Date {
    // Converte o valor de entrada (normalmente string ISO) para um objeto Date
    if (typeof value === 'string') {
      return new Date(value);
    }
    throw new Error('Invalid input for Date scalar');
  },
  serialize(value: unknown): string {
    // Converte o valor interno (Date) para uma string ISO
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error('Invalid value for Date scalar');
  },
  parseLiteral(ast): Date | null {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});
