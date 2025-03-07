const fs = require('fs');
const path = require('path');

// Função principal para reorganizar os hinos
async function reorganizeHymns() {
  try {
    // Ler o arquivo JSON dos hinos
    const hymnsPath = path.join(__dirname, '../data/hymns.json');
    const hymnsData = await fs.promises.readFile(hymnsPath, 'utf8');
    const hymns = JSON.parse(hymnsData);

    // Estrutura para o novo formato
    const reorganizedHymns = {
      sections: {}
    };

    // Iterar por todos os hinos
    for (const [hymnNumber, hymnData] of Object.entries(hymns)) {
      if (!hymnData.section) continue;

      const sectionId = hymnData.section['@_id'];
      const sectionName = hymnData.section['#text'] || hymnData.section.name;

      // Criar a seção se não existir
      if (!reorganizedHymns.sections[sectionId]) {
        reorganizedHymns.sections[sectionId] = {
          name: sectionName,
          hymns: {}
        };
      }

      // Extrair os autores
      let authors = [];
      if (Array.isArray(hymnData.author)) {
        authors = hymnData.author;
      } else if (hymnData.author) {
        authors = [hymnData.author];
      }

      // Formatar o texto do hino no formato solicitado
      const formattedText = formatHymnText(hymnNumber, hymnData.title, authors, hymnData.text);

      // Adicionar hino à estrutura
      reorganizedHymns.sections[sectionId].hymns[hymnNumber] = {
        number: hymnData.number || parseInt(hymnNumber),
        title: hymnData.title,
        formattedText: formattedText
      };
    }

    // Escrever o arquivo reorganizado
    const outputPath = path.join(__dirname, '../data/reorganizedHymns.json');
    await fs.promises.writeFile(
      outputPath, 
      JSON.stringify(reorganizedHymns, null, 2),
      'utf8'
    );

    console.log(`Hinos reorganizados com sucesso! Arquivo salvo em: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Erro ao reorganizar os hinos:', error);
    return false;
  }
}

/**
 * Formata o texto do hino conforme o modelo solicitado
 * @param {string} number - Número do hino
 * @param {string} title - Título do hino
 * @param {Array} authors - Lista de autores
 * @param {string} text - Letra do hino
 * @returns {string} - Texto formatado
 */
function formatHymnText(number, title, authors, text) {
  // Formatar título
  let formattedText = `NC ${number} - ${title}`;
  
  // Adicionar autores se houver
  if (authors && authors.length > 0) {
    formattedText += `\n\nAutores: ${authors.join(', ')}`;
  }
  
  // Adicionar a letra do hino
  if (text) {
    formattedText += `\n\n${text}`;
  }
  
  return formattedText;
}

// Executar a função se este arquivo for executado diretamente
if (require.main === module) {
  reorganizeHymns();
}

module.exports = { reorganizeHymns };
