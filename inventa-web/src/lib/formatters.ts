/**
 * Formate un montant financier avec espaces séparateurs de milliers (ex: 15 000 FCFA, 1 500 000 FCFA).
 * Évite les chiffres collés illisibles.
 */
export function formatCurrency(amount: number | string | null | undefined, currency = 'FCFA'): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `0 ${currency}`;
  }
  const numeric = Math.round(Number(amount));
  const formatted = numeric.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ${currency}`;
}

/**
 * Formate un poids en grammes pour les métaux précieux (or, argent).
 */
export function formatWeight(grams: number | null | undefined): string {
  if (grams === null || grams === undefined) return '0.00 g';
  return `${Number(grams).toFixed(2).replace('.', ',')} g`;
}

/**
 * Formate une date en format français lisible (ex: 27 Septembre 2026).
 */
export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
