
// Generate a unique ID for liturgies
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Bible references suggestions for different liturgy sections
export const bibleReferenceSuggestions = {
  worshipCall: [
    'Salmo 95:1-7 - "Vinde, cantemos alegremente ao SENHOR, com júbilo celebremos o Rochedo da nossa salvação. Apresentemo-nos diante dele com ações de graças, celebremo-lo com salmos. Porque o SENHOR é o Deus supremo e o grande Rei acima de todos os deuses..."',
    'Salmo 100 - "Celebrai com júbilo ao SENHOR, todas as terras. Servi ao SENHOR com alegria, apresentai-vos diante dele com cântico. Sabei que o SENHOR é Deus; foi ele quem nos fez, e dele somos; somos o seu povo e rebanho do seu pastoreio..."',
    'Isaías 55:1-3 - "Ah! Todos vós, os que tendes sede, vinde às águas; e vós, os que não tendes dinheiro, vinde, comprai e comei; sim, vinde e comprai, sem dinheiro e sem preço, vinho e leite..."',
    'Salmo 96:1-9 - "Cantai ao SENHOR um cântico novo, cantai ao SENHOR, todas as terras. Cantai ao SENHOR, bendizei o seu nome; proclamai a sua salvação, dia após dia..."',
    'Salmo 98:1-6 - "Cantai ao SENHOR um cântico novo, porque ele tem feito maravilhas; a sua destra e o seu braço santo lhe alcançaram a vitória..."',
  ],
  lawReading: [
    'Êxodo 20:1-17 - "Então, falou Deus todas estas palavras: Eu sou o SENHOR, teu Deus, que te tirei da terra do Egito, da casa da servidão. Não terás outros deuses diante de mim..."',
    'Deuteronômio 5:6-21 - "Eu sou o SENHOR, teu Deus, que te tirei da terra do Egito, da casa da servidão. Não terás outros deuses diante de mim..."',
    'Mateus 22:37-40 - "Respondeu-lhe Jesus: Amarás o Senhor, teu Deus, de todo o teu coração, de toda a tua alma e de todo o teu entendimento. Este é o grande e primeiro mandamento. O segundo, semelhante a este, é: Amarás o teu próximo como a ti mesmo..."',
    'Romanos 13:8-10 - "A ninguém fiqueis devendo coisa alguma, exceto o amor com que vos ameis uns aos outros; pois quem ama o próximo tem cumprido a lei..."',
    'Gálatas 5:13-14 - "Porque vós, irmãos, fostes chamados à liberdade; porém não useis da liberdade para dar ocasião à carne; sede, antes, servos uns dos outros, pelo amor..."',
    'Tiago 2:8-13 - "Se vós, contudo, observais a lei régia segundo a Escritura: Amarás o teu próximo como a ti mesmo, fazeis bem..."',
  ],
  forgiveness: [
    'Salmo 32:1-5 - "Bem-aventurado aquele cuja iniquidade é perdoada, cujo pecado é coberto. Bem-aventurado o homem a quem o SENHOR não atribui iniquidade e em cujo espírito não há dolo..."',
    'Isaías 1:18 - "Vinde, pois, e arrazoemos, diz o SENHOR; ainda que os vossos pecados sejam como a escarlata, eles se tornarão brancos como a neve; ainda que sejam vermelhos como o carmesim, se tornarão como a lã..."',
    'Isaías 43:25 - "Eu, eu mesmo, sou o que apago as tuas transgressões por amor de mim e dos teus pecados não me lembro..."',
    '1 João 1:9 - "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça..."',
    'Romanos 5:1-2 - "Justificados, pois, mediante a fé, temos paz com Deus por meio de nosso Senhor Jesus Cristo; por intermédio de quem obtivemos igualmente acesso, pela fé, a esta graça na qual estamos firmes; e gloriamo-nos na esperança da glória de Deus..."',
    'Colossenses 1:13-14 - "Ele nos libertou do império das trevas e nos transportou para o reino do Filho do seu amor, no qual temos a redenção, a remissão dos pecados..."',
    'Efésios 1:7-8 - "No qual temos a redenção, pelo seu sangue, a remissão dos pecados, segundo a riqueza da sua graça, que Deus derramou abundantemente sobre nós em toda a sabedoria e prudência..."',
    'Miquéias 7:18-19 - "Quem, ó Deus, é semelhante a ti, que perdoas a iniquidade e te esqueces da transgressão do restante da tua herança? O SENHOR não retém a sua ira para sempre, porque tem prazer na misericórdia..."',
  ],
  intercession: [
    '1 Timóteo 2:1-4 - "Antes de tudo, recomendo que se façam súplicas, orações, intercessões e ações de graças por todos os homens; pelos reis e por todos os que se acham investidos de autoridade, para que vivamos vida tranquila e mansa, com toda piedade e respeito..."',
    'Filipenses 4:6-7 - "Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas, diante de Deus, as vossas petições, pela oração e pela súplica, com ações de graças..."',
    'Tiago 5:13-16 - "Está alguém entre vós sofrendo? Faça oração. Está alguém alegre? Cante louvores. Está alguém entre vós doente? Chame os presbíteros da igreja, e estes façam oração sobre ele, ungindo-o com óleo, em nome do Senhor..."',
    'Mateus 6:9-13 - "Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o teu nome; venha o teu reino; faça-se a tua vontade, assim na terra como no céu..."',
    'Colossenses 1:9-12 - "Por esta razão, também nós, desde o dia em que o ouvimos, não cessamos de orar por vós e de pedir que transbordeis de pleno conhecimento da sua vontade, em toda a sabedoria e entendimento espiritual..."',
  ],
  illumination: [
    'Salmo 119:105 - "Lâmpada para os meus pés é a tua palavra e, luz para os meus caminhos..."',
    'Provérbios 2:1-5 - "Filho meu, se aceitares as minhas palavras e esconderes contigo os meus mandamentos, para fazeres atento à sabedoria o teu ouvido e para inclinares o coração ao entendimento..."',
    'João 16:12-15 - "Tenho ainda muito que vos dizer, mas vós não o podeis suportar agora; quando vier, porém, o Espírito da verdade, ele vos guiará a toda a verdade; porque não falará por si mesmo, mas dirá tudo o que tiver ouvido e vos anunciará as coisas que hão de vir..."',
    '2 Timóteo 3:16-17 - "Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção, para a educação na justiça, a fim de que o homem de Deus seja perfeito e perfeitamente habilitado para toda boa obra..."',
    'Hebreus 4:12 - "Porque a palavra de Deus é viva, e eficaz, e mais cortante do que qualquer espada de dois gumes, e penetra até ao ponto de dividir alma e espírito, juntas e medulas, e é apta para discernir os pensamentos e propósitos do coração..."',
    'Efésios 1:17-19 - "Para que o Deus de nosso Senhor Jesus Cristo, o Pai da glória, vos conceda espírito de sabedoria e de revelação no pleno conhecimento dele, iluminados os olhos do vosso coração..."',
  ],
  wordPreaching: [
    'Romanos 10:14-17 - "Como, porém, invocarão aquele em quem não creram? E como crerão naquele de quem nada ouviram? E como ouvirão, se não há quem pregue? E como pregarão, se não forem enviados?..."',
    '2 Timóteo 4:1-5 - "Conjuro-te, perante Deus e Cristo Jesus, que há de julgar vivos e mortos, pela sua manifestação e pelo seu reino: prega a palavra, insta, quer seja oportuno, quer não, corrige, repreende, exorta com toda a longanimidade e doutrina..."',
    'Isaías 55:10-11 - "Porque, assim como descem a chuva e a neve dos céus e para lá não tornam, sem que primeiro reguem a terra, e a fecundem, e a façam brotar, para dar semente ao semeador e pão ao que come, assim será a palavra que sair da minha boca: não voltará para mim vazia..."',
    'Tiago 1:22-25 - "Tornai-vos, pois, praticantes da palavra e não somente ouvintes, enganando-vos a vós mesmos. Porque, se alguém é ouvinte da palavra e não praticante, assemelha-se ao homem que contempla, num espelho, o seu rosto natural..."',
    'Atos 20:27-28 - "Porquanto jamais deixei de vos anunciar todo o desígnio de Deus. Atendei por vós e por todo o rebanho sobre o qual o Espírito Santo vos constituiu bispos, para pastoreardes a igreja de Deus, a qual ele comprou com o seu próprio sangue..."',
  ],
  lordsSupper: [
    '1 Coríntios 11:23-26 - "Porque eu recebi do Senhor o que também vos entreguei: que o Senhor Jesus, na noite em que foi traído, tomou o pão; e, tendo dado graças, o partiu e disse: Isto é o meu corpo, que é dado por vós; fazei isto em memória de mim..."',
    'Marcos 14:22-25 - "Enquanto comiam, tomou Jesus um pão e, abençoando-o, o partiu e lhes deu, dizendo: Tomai, isto é o meu corpo. A seguir, tomou Jesus um cálice e, tendo dado graças, o deu aos seus discípulos; e todos beberam dele..."',
    'Lucas 22:14-20 - "Chegada a hora, pôs-se Jesus à mesa, e com ele os apóstolos. E disse-lhes: Tenho desejado ansiosamente comer convosco esta Páscoa, antes do meu sofrimento..."',
    'João 6:35-40 - "Declarou-lhes, pois, Jesus: Eu sou o pão da vida; o que vem a mim jamais terá fome; e o que crê em mim jamais terá sede..."',
    '1 Coríntios 10:16-17 - "Porventura, o cálice da bênção que abençoamos não é a comunhão do sangue de Cristo? O pão que partimos não é a comunhão do corpo de Cristo? Porque nós, embora muitos, somos unicamente um pão, um só corpo; porque todos participamos do único pão..."',
  ],
  consecration: [
    'Romanos 12:1-2 - "Rogo-vos, pois, irmãos, pelas misericórdias de Deus, que apresenteis o vosso corpo por sacrifício vivo, santo e agradável a Deus, que é o vosso culto racional..."',
    '1 Coríntios 10:31 - "Portanto, quer comais, quer bebais ou façais outra coisa qualquer, fazei tudo para a glória de Deus..."',
    'Colossenses 3:16-17 - "Habite, ricamente, em vós a palavra de Cristo; instruí-vos e aconselhai-vos mutuamente em toda a sabedoria, louvando a Deus, com salmos, e hinos, e cânticos espirituais, com gratidão, em vosso coração..."',
    'Malaquias 3:10 - "Trazei todos os dízimos à casa do Tesouro, para que haja mantimento na minha casa; e provai-me nisto, diz o SENHOR dos Exércitos, se eu não vos abrir as janelas do céu e não derramar sobre vós bênção sem medida..."',
    '2 Coríntios 9:6-8 - "E isto afirmo: aquele que semeia pouco pouco também ceifará; e o que semeia com fartura com abundância também ceifará. Cada um contribua segundo tiver proposto no coração, não com tristeza ou por necessidade; porque Deus ama a quem dá com alegria..."',
    'Provérbios 3:9-10 - "Honra ao SENHOR com os teus bens e com as primícias de toda a tua renda; e se encherão fartamente os teus celeiros, e transbordarão de vinho os teus lagares..."',
  ],
  sending: [
    'Mateus 28:18-20 - "Jesus, aproximando-se, falou-lhes, dizendo: Toda a autoridade me foi dada no céu e na terra. Ide, portanto, fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo; ensinando-os a guardar todas as coisas que vos tenho ordenado..."',
    'Atos 1:8 - "Mas recebereis poder, ao descer sobre vós o Espírito Santo, e sereis minhas testemunhas tanto em Jerusalém como em toda a Judéia e Samaria e até aos confins da terra..."',
    'Marcos 16:15 - "E disse-lhes: Ide por todo o mundo e pregai o evangelho a toda criatura..."',
    'Romanos 10:14-15 - "Como, porém, invocarão aquele em quem não creram? E como crerão naquele de quem nada ouviram? E como ouvirão, se não há quem pregue? E como pregarão, se não forem enviados? Como está escrito: Quão formosos são os pés dos que anunciam coisas boas!..."',
    'Josué 1:9 - "Não to mandei eu? Sê forte e corajoso; não temas, nem te espantes, porque o SENHOR, teu Deus, é contigo por onde quer que andares..."',
  ],
  blessing: [
    'Números 6:24-26 - "O SENHOR te abençoe e te guarde; o SENHOR faça resplandecer o seu rosto sobre ti e tenha misericórdia de ti; o SENHOR sobre ti levante o seu rosto e te dê a paz..."',
    '2 Coríntios 13:14 - "A graça do Senhor Jesus Cristo, e o amor de Deus, e a comunhão do Espírito Santo sejam com todos vós..."',
    'Hebreus 13:20-21 - "Ora, o Deus da paz, que tornou a trazer dentre os mortos a Jesus, nosso Senhor, o grande Pastor das ovelhas, pelo sangue da eterna aliança, vos aperfeiçoe em todo bem, para cumprirdes a sua vontade, operando em vós o que é agradável diante dele, por Jesus Cristo, a quem seja a glória para todo o sempre. Amém!..."',
    'Judas 24-25 - "Ora, àquele que é poderoso para vos guardar de tropeços e para vos apresentar com exultação, imaculados diante da sua glória, ao único Deus, nosso Salvador, mediante Jesus Cristo, Senhor nosso, glória, majestade, império e soberania, antes de todas as eras, e agora, e por todos os séculos. Amém!..."',
    'Efésios 3:20-21 - "Ora, àquele que é poderoso para fazer infinitamente mais do que tudo quanto pedimos ou pensamos, conforme o seu poder que opera em nós, a ele seja a glória, na igreja e em Cristo Jesus, por todas as gerações, para todo o sempre. Amém!..."',
    'Romanos 15:13 - "E o Deus da esperança vos encha de todo o gozo e paz no vosso crer, para que sejais ricos de esperança no poder do Espírito Santo..."',
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

// Sugestões de hinos do Novo Cântico e Salmos Metrificados
export const hymnSuggestions = {
  worshipCall: [
    'NC 14 - Santo! Santo! Santo!',
    'NC 19 - Rei Sublime',
    'NC 21 - Deus de Abraão',
    'NC 22 - Os Céus Proclamam',
    'NC 25 - O Criador de Tudo',
    'NC 38 - Louvores Sem Fim',
    'Salmo 8 - Ó Senhor, quão maravilhoso',
    'Salmo 100 - Cantai alegres ao Senhor',
  ],
  lawReading: [
    'NC 33 - A Lei do Senhor',
    'NC 96 - Coração Quebrantado',
    'NC 78 - Perfeição',
    'NC 135 - Mais Perto da Cruz',
    'Salmo 19 - Os céus proclamam',
    'Salmo 119 - Lâmpada para os meus pés',
  ],
  forgiveness: [
    'NC 58 - Bondoso Amigo',
    'NC 62 - Coração Quebrantado',
    'NC 63 - Necessidade',
    'NC 89 - Amor Perene',
    'NC 96 - Salvação em Cristo',
    'Salmo 32 - Bem-aventurado',
    'Salmo 51 - Tem misericórdia de mim',
  ],
  intercession: [
    'NC 87 - Preciosa Graça',
    'NC 129 - Oração Diária',
    'NC 179 - Vigilância e Oração',
    'NC 86 - Espírito Divino',
    'Salmo 20 - O Senhor te ouça',
    'Salmo 130 - Das profundezas',
  ],
  illumination: [
    'NC 105 - A Revelação Natural',
    'NC 121 - Noite de Paz',
    'NC 137 - Palavra da Vida',
    'NC 172 - Bíblia, Livro Precioso',
    'Salmo 19 - A lei do Senhor é perfeita',
    'Salmo 119 - Como o jovem manterá puro o seu caminho',
  ],
  wordPreaching: [
    'NC 81 - Tu és Digno',
    'NC 114 - Brilho Celeste',
    'NC 124 - Congregação Abençoada',
    'NC 154 - Achei um Bom Amigo',
    'NC 177 - Firme nas Promessas',
    'NC 266 - Rude Cruz',
  ],
  lordsSupper: [
    'NC 261 - Ceia do Senhor',
    'NC 94 - Cordeiro Divino',
    'NC 112 - Qual Piloto',
    'NC 147 - Bendito Cordeiro',
    'NC 190 - Tu és Fiel, Senhor',
    'Salmo 116 - Que darei ao Senhor',
  ],
  consecration: [
    'NC 119 - Trabalho Cristão',
    'NC 120 - Dedicação',
    'NC 165 - Dedicação Pessoal',
    'NC 95 - Mais de Jesus',
    'NC 207 - Renovo Espiritual',
    'Salmo 116 - Que darei ao Senhor',
  ],
  sending: [
    'NC 170 - Firmeza na Fé',
    'NC 171 - Crer e Observar',
    'NC 208 - O Combate',
    'NC 320 - Oração da Noite',
    'NC 299 - Renovação',
    'Salmo 67 - Deus tenha misericórdia',
  ],
  blessing: [
    'NC 150 - Bênção Antiga',
    'NC 226 - Eu Te Seguirei',
    'NC 320 - Oração da Noite',
    'NC 225 - O Pai Nosso',
    'Salmo 121 - O Senhor é teu guarda',
    'Salmo 134 - Bendizei ao Senhor',
  ],
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
