
// Generate a unique ID for liturgies
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Bible references suggestions for different liturgy sections
export const bibleReferenceSuggestions = {
  worshipCall: [
    'Salmo 95:1-7',
    'Salmo 100',
    'Isaías 55:1-3',
    'Salmo 96:1-9',
    'Salmo 98:1-6',
  ],
  lawReading: [
    'Êxodo 20:1-17',
    'Deuteronômio 5:6-21',
    'Mateus 22:37-40',
    'Romanos 13:8-10',
    'Gálatas 5:13-14',
  ],
  forgiveness: [
    'Salmo 32:1-5',
    'Isaías 1:18',
    'Isaías 43:25',
    '1 João 1:9',
    'Romanos 5:1-2',
    'Colossenses 1:13-14',
    'Efésios 1:7-8',
  ],
  intercession: [
    '1 Timóteo 2:1-4',
    'Filipenses 4:6-7',
    'Tiago 5:13-16',
    'Mateus 6:9-13',
  ],
  illumination: [
    'Salmo 119:105',
    'Provérbios 2:1-5',
    'João 16:12-15',
    '2 Timóteo 3:16-17',
    'Hebreus 4:12',
  ],
  wordPreaching: [
    'Romanos 10:14-17',
    '2 Timóteo 4:1-5',
    'Isaías 55:10-11',
    'Tiago 1:22-25',
  ],
  lordsSupper: [
    '1 Coríntios 11:23-26',
    'Marcos 14:22-25',
    'Lucas 22:14-20',
    'João 6:35-40',
  ],
  consecration: [
    'Romanos 12:1-2',
    '1 Coríntios 10:31',
    'Colossenses 3:16-17',
    'Malaquias 3:10',
    '2 Coríntios 9:6-8',
  ],
  sending: [
    'Mateus 28:18-20',
    'Atos 1:8',
    'Marcos 16:15',
    'Romanos 10:14-15',
  ],
  blessing: [
    'Números 6:24-26',
    '2 Coríntios 13:14',
    'Hebreus 13:20-21',
    'Judas 24-25',
    'Efésios 3:20-21',
  ],
};

// Prayer suggestions for different liturgy sections
export const prayerSuggestions = {
  worshipCall: 'Deus eterno e todo-poderoso, nós nos aproximamos de Ti com louvor e adoração. Reconhecemos Tua majestade e glória, e Te adoramos como nosso Criador e Sustentador...',
  lawReading: 'Senhor, Tua lei é perfeita e restaura a alma. Ao ouvirmos Teus mandamentos, que possamos examinar nossos corações e reconhecer onde falhamos em amar a Ti e ao próximo...',
  forgiveness: 'Deus misericordioso, confessamos que pecamos contra Ti em pensamento, palavra e ação. Por Tua grande misericórdia, perdoa-nos e renova-nos pela graça de Jesus Cristo...',
  intercession: 'Pai Celestial, trazemos diante de Ti as necessidades da Tua igreja, do mundo e da nossa comunidade. Intercedemos por aqueles que sofrem, pelos enfermos, pelos enlutados...',
  illumination: 'Espírito Santo, abre nossos corações e mentes para recebermos Tua Palavra. Ilumina nosso entendimento e transforma-nos pela verdade das Escrituras...',
  wordPreaching: 'Senhor, que a mensagem da Tua Palavra seja proclamada com fidelidade e recebida com fé. Usa este sermão para edificar Tua igreja e glorificar Teu nome...',
  lordsSupper: 'Deus gracioso, ao participarmos desta refeição sagrada, lembramos do sacrifício do Teu Filho Jesus Cristo. Que esta Ceia fortaleça nossa fé e nos una como corpo de Cristo...',
  consecration: 'Pai Celestial, tudo o que temos vem de Ti. Consagramos nossas vidas e recursos para Tua glória, reconhecendo que somos mordomos das Tuas bênçãos...',
  sending: 'Senhor, ao sairmos deste lugar de adoração, envia-nos como Teus embaixadores para proclamar o evangelho e servir ao próximo. Que nossas vidas reflitam Teu amor e verdade...',
  blessing: 'Que a graça do Senhor Jesus Cristo, o amor de Deus e a comunhão do Espírito Santo estejam com todos nós, agora e sempre. Amém.',
};

// Get a liturgy from localStorage by ID
export const getLiturgyById = (liturgyId: string) => {
  const savedLiturgies = JSON.parse(localStorage.getItem('savedLiturgies') || '{}');
  return savedLiturgies[liturgyId] || null;
};

// Format date to a readable format
export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};
