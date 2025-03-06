import hymnsData from '@/data/hymns.json';

interface Hymn {
  number: string;
  title: string;
  text: string;
  section: string;
  subject: string;
  author: string;
}

// Tipo do JSON importado
interface HymnsCollection {
  [hymnNumber: string]: Hymn;
}

const hymns = hymnsData as unknown as HymnsCollection;

/**
 * Obtém um hino pelo seu número
 * @param number Número do hino (sem zeros à esquerda)
 * @returns O texto formatado do hino ou null se não encontrado
 */
export function getHymn(number: string): string | null {
  // Formatar o número com zeros à esquerda
  const formattedNumber = number.toString().padStart(3, '0');
  
  const hymn = hymns[formattedNumber];
  if (!hymn) return null;
  
  return `NC ${hymn.number.replace(/^0+/, '')} · ${hymn.title}\n\n${hymn.text}`;
}

/**
 * Obtém objeto com dados do hino
 * @param number Número do hino
 * @returns Objeto com dados do hino ou null se não encontrado
 */
export function getHymnData(number: string): Hymn | null {
  const formattedNumber = number.toString().padStart(3, '0');
  return hymns[formattedNumber] || null;
}

/**
 * Pesquisa hinos por texto no título
 * @param query Texto para pesquisa
 * @returns Lista de hinos encontrados
 */
export function searchHymnsByTitle(query: string): Hymn[] {
  if (!query || query.trim().length === 0) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  return Object.values(hymns).filter(hymn => 
    hymn.title.toLowerCase().includes(searchTerm)
  );
}

/**
 * Lista todos os hinos disponíveis
 * @returns Lista completa de hinos
 */
export function getAllHymns(): Hymn[] {
  return Object.values(hymns);
}
