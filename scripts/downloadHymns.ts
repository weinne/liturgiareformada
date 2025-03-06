import * as fs from 'fs';
import * as path from 'path';
import { XMLParser } from 'fast-xml-parser';

interface HymnData {
  numero: string;
  n: string;
  titulo: string;
  texto: {
    estrofe: any;
  };
  secao: string;
  assunto: string;
  origem_letra: string;
}

interface ProcessedHymn {
  number: string;
  title: string;
  text: string;
  section: string;
  subject: string;
  author: string;
  originalText: string; // XML bruto para referência futura se precisar
}

// Extrair números de hinos da lista de sugestões
function extractHymnNumbers(): Set<string> {
  const hymnsFile = fs.readFileSync(
    path.join(process.cwd(), 'src', 'utils', 'hymnSuggestions.ts'),
    'utf-8'
  );

  const hymnRegex = /NC (\d{3})/g;
  const matches = [...hymnsFile.matchAll(hymnRegex)];
  
  const hymnNumbers = new Set<string>();
  matches.forEach((match) => {
    hymnNumbers.add(match[1]);
  });
  
  return hymnNumbers;
}

// Formatar o hino para texto
function formatHymn(hymn: HymnData): string {
  try {
    let formattedText = '';
    
    // Processar cada estrofe
    const estrofes = Array.isArray(hymn.texto.estrofe) 
      ? hymn.texto.estrofe 
      : [hymn.texto.estrofe];
    
    estrofes.forEach((estrofe: any, index: number) => {
      // Obter versos da estrofe
      const versos = Array.isArray(estrofe.verso) ? estrofe.verso : [estrofe.verso];
      
      // Adicionar cada verso
      versos.forEach((verso: string) => {
        formattedText += `${verso}\n`;
      });
      
      // Adicionar linha em branco entre estrofes (exceto na última)
      if (index < estrofes.length - 1) {
        formattedText += '\n';
      }
    });
    
    return formattedText;
  } catch (error) {
    console.error('Erro ao formatar o hino:', error);
    return 'Erro ao processar letra do hino.';
  }
}

async function fetchHymn(hymnNumber: string): Promise<ProcessedHymn | null> {
  try {
    const url = `https://novocantico.com.br/hino/${hymnNumber}/${hymnNumber}.xml`;
    
    console.log(`Buscando hino ${hymnNumber}...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Erro ao buscar hino ${hymnNumber}: ${response.statusText}`);
      return null;
    }
    
    const xmlData = await response.text();
    
    // Parsear o XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      isArray: (name) => ['estrofe', 'verso'].includes(name),
    });
    
    const result = parser.parse(xmlData);
    const hymn = result.hino as HymnData;
    
    // Formatar o hino para texto
    const formattedText = formatHymn(hymn);
    
    return {
      number: hymn.numero,
      title: hymn.titulo,
      text: formattedText,
      section: hymn.secao || '',
      subject: hymn.assunto || '',
      author: hymn.origem_letra || '',
      originalText: xmlData
    };
  } catch (error) {
    console.error(`Erro ao processar hino ${hymnNumber}:`, error);
    return null;
  }
}

async function downloadAllHymns() {
  const hymnNumbers = extractHymnNumbers();
  console.log(`Encontrados ${hymnNumbers.size} números únicos de hinos.`);
  
  const hymns: Record<string, ProcessedHymn> = {};
  let processedCount = 0;
  let errorCount = 0;
  
  // Criar pasta de dados se não existir
  const dataDir = path.join(process.cwd(), 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Processar cada hino com um pequeno intervalo para não sobrecarregar o servidor
  for (const hymnNumber of hymnNumbers) {
    try {
      const hymn = await fetchHymn(hymnNumber);
      
      if (hymn) {
        hymns[hymnNumber] = hymn;
        processedCount++;
        console.log(`Hino ${hymnNumber} processado com sucesso (${processedCount}/${hymnNumbers.size})`);
      } else {
        errorCount++;
      }
      
      // Esperar um pouco para não sobrecarregar o servidor
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Falha ao processar hino ${hymnNumber}:`, error);
      errorCount++;
    }
  }
  
  // Salvar resultado em JSON
  const outputPath = path.join(dataDir, 'hymns.json');
  fs.writeFileSync(outputPath, JSON.stringify(hymns, null, 2));
  
  console.log(`
Download concluído:
- Total de hinos processados: ${processedCount}
- Erros: ${errorCount}
- Arquivo salvo em: ${outputPath}
  `);
}

downloadAllHymns().catch(error => {
  console.error('Erro na execução do script:', error);
  process.exit(1);
});
