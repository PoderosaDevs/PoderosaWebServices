// Espelham exatamente os enums nativos ja existentes no banco (nao alterar valores).

export enum TipoPessoa {
  USER = "USER",
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
  MANAGER = "MANAGER",
  GUEST = "GUEST",
}

export enum MetaSituacao {
  PENDENTE = "PENDENTE",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  CONCLUIDA = "CONCLUIDA",
  CANCELADA = "CANCELADA",
}

export const PERFIS_GESTAO: TipoPessoa[] = [TipoPessoa.ADMIN, TipoPessoa.MANAGER];
