export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationParams {
  pagina: number;
  quantidade: number;
}

export function parsePagination(query: {
  pagina?: unknown;
  quantidade?: unknown;
}): PaginationParams {
  const pagina = Math.max(0, Number(query.pagina ?? 0) || 0);
  const quantidadeBruta = Number(query.quantidade ?? 10) || 10;
  const quantidade = Math.min(200, Math.max(1, quantidadeBruta));
  return { pagina, quantidade };
}

export function buildPageInfo(
  totalItems: number,
  pagina: number,
  quantidade: number
): PaginationInfo {
  const totalPages = Math.max(1, Math.ceil(totalItems / quantidade));
  return {
    currentPage: pagina,
    totalPages,
    totalItems,
    hasNextPage: (pagina + 1) * quantidade < totalItems,
    hasPreviousPage: pagina > 0,
  };
}
