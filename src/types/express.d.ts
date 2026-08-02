import { TipoPessoa } from "./enums";

export interface AuthPayload {
  id: number;
  nome: string;
  email: string;
  funcao?: string | null;
  tipo_pessoa: TipoPessoa;
  complemento?: string | null;
  cpf?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};
