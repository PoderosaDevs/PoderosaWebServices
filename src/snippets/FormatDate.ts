export function normalizarDataPara10h(data: string | Date): Date {
  let dataStr = typeof data === 'string' ? data : data.toISOString();

  // Remove qualquer parte de tempo
  const apenasData = dataStr.split('T')[0];

  // Força a hora para 10:00 da manhã (sem timezone)
  const dataComHora = `${apenasData}T10:00:00`;

  const finalDate = new Date(dataComHora);

  console.log('📅 Data recebida:', data);
  console.log('🕙 Data ajustada para 10h:', dataComHora);
  console.log('🧭 Data final convertida:', finalDate.toISOString());

  return finalDate;
}
