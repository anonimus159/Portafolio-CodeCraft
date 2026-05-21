/**
 * Utility for formatting currency in the system
 * Standardizes all financial displays to COP (Colombian Peso)
 */

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0';
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('es-CO').format(num);
};
