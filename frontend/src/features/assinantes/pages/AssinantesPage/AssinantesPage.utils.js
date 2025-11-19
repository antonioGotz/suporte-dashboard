/**
 * Formata uma data ISO para formato brasileiro
 * @param {string} dateString - Data em formato ISO
 * @returns {string} Data formatada (dd/mm/aaaa)
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return '-';
  }
};

/**
 * Formata telefone para formato brasileiro
 * @param {string} phone - Telefone sem formatação
 * @returns {string} Telefone formatado
 */
export const formatPhone = (phone) => {
  if (!phone) return '-';
  
  // Remove tudo que não é número
  const cleaned = phone.replace(/\D/g, '');
  
  // Formata: (11) 98765-4321 ou (11) 3456-7890
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

/**
 * Resolve o email do assinante de várias possíveis propriedades
 * @param {object} record - Objeto do assinante
 * @returns {string} Email encontrado ou string vazia
 */
export const resolveEmail = (record) => {
  if (!record) return '';
  const possibilities = [
    record.user_email,
    record.email,
    record.customer_email,
    record.billing_email,
    record.login,
  ];
  const found = possibilities.find((value) => typeof value === 'string' && value.trim().length > 0);
  return found ? found.trim() : '';
};

/**
 * Formata nome do assinante para exibição (primeiros 2 nomes, truncado se necessário)
 * @param {string} name - Nome completo
 * @param {number} maxLength - Comprimento máximo (padrão: 22)
 * @returns {string} Nome formatado
 */
export const formatName = (name, maxLength = 22) => {
  if (!name) return '—';
  const nome = name.split(' ').slice(0, 2).join(' ');
  return nome.length > maxLength ? nome.slice(0, maxLength) + '…' : nome;
};

