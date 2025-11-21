/**
 * Formata valor para formato monetário brasileiro
 * @param {number} value - Valor numérico
 * @returns {string} Valor formatado (R$ 0,00)
 */
export const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

