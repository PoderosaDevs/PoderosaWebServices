import {
  endOfDay,
  endOfMonth,
  parse,
  startOfDay,
  startOfMonth,
  isValid,
} from "date-fns";

/** Converte "dd/MM/yyyy" em Date. Lanca erro se invalido. */
export function parseDateBr(value: string): Date {
  const parsed = parse(value, "dd/MM/yyyy", new Date());
  if (!isValid(parsed)) {
    throw new Error(`Data invalida: ${value}. Use o formato dd/MM/yyyy.`);
  }
  return parsed;
}

/** Resolve um intervalo [inicio, fim] a partir de strings dd/MM/yyyy opcionais.
 *  Sem parametros, usa o mes corrente. */
export function resolvePeriodo(
  startDate?: string,
  endDate?: string
): { inicio: Date; fim: Date } {
  const inicio = startDate ? startOfDay(parseDateBr(startDate)) : startOfMonth(new Date());
  const fim = endDate ? endOfDay(parseDateBr(endDate)) : endOfDay(endOfMonth(new Date()));
  return { inicio, fim };
}

/** Normaliza uma data (string ISO ou Date) para 10h da manha, sem timezone. */
export function normalizarDataPara10h(data: string | Date): Date {
  const dataStr = typeof data === "string" ? data : data.toISOString();
  const apenasData = dataStr.split("T")[0];
  return new Date(`${apenasData}T10:00:00`);
}
