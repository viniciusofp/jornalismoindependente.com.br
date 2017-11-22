'use strict';

var app = angular.module('wpReader', ['ngSanitize','ngResource','ngRoute']);
app.config(['$httpProvider', function($httpProvider) {
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.cache = true;
}]);
app.config(function($sceProvider) {
	$sceProvider.enabled(false);
});
app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({
        enabled: true,
    }) 
  $locationProvider.hashPrefix('');
  $routeProvider
	.when('/', {
    	templateUrl: 'views/home.html',
    	controller: 'Home',
  	})
   	.when('/mapa', {
    	templateUrl: 'views/mapa.html',
    	controller: 'Mapa',
  	})
   	.when('/:source', {
    	templateUrl: 'views/single.html',
    	controller: 'Single',
  	})
   	.when('/busca/:termo', {
    	templateUrl: 'views/busca.html',
    	controller: 'Busca',
  	})
   	.when('/categoria/:catSlug', {
    	templateUrl: 'views/cat.html',
    	controller: 'Cat',
  	})
  	.otherwise({
    	redirectTo: '/'
  	});
});
app.filter('uniquemidia', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item.midia[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});
app.directive('postRow', function() {
	return {
    	templateUrl: 'directives/post-row.html',
  	};
});
app.directive('postRowBusca', function() {
	return {
    	templateUrl: 'directives/post-row-busca.html',
  	};
});
app.service('wp', function ($resource, $q, $http) {
	var wp = []
	wp.sites = [{name:"Vaidapé",apiUrl:"http://vaidape.com.br/wp-json/wp/v2/",url:"http://vaidape.com.br/",slug:"vaidape",description:"A Vaidapé é um coletivo de comunicação formado por jovens que debatem e divulgam movimentações culturais, periféricas e marginais por meio de um jornalismo independente. Na Vaidapé, a periferia é o centro. Articula-se com aqueles que não estão nos holofotes da grande imprensa e não são prioridade na agenda política. Atua no audiovisual, na radiodifusão, no meio impresso e digital, mas também desenvolve projetos e eventos que conectam e dialogam com jovens dos extremos da cidade.",linhafina:"Debater e divulgar movimentações culturais, periféricas e marginais.",category:"Cidadania e Política",city:"São Paulo",lat:-23.527274,lng:-46.629497,meu:""},{name:"Ponte Jornalismo",apiUrl:"https://ponte.org/wp-json/wp/v2/",url:"https://ponte.org/",slug:"pontejornalismo",description:"Canal de informações sobre segurança pública, justiça e direitos humanos que surgiu em 2014 da convicção de um grupo de jornalistas de que jornalismo de qualidade sob o prisma dos direitos humanos é capaz de ajudar na construção de um mundo mais justo; de que é preciso desnudar as razões pelas quais a população tem medo da tropa policial; revelar os fatos que levam os pobres e negros a serem vítimas de um Judiciário injusto e lento, e os caminhos que permitem que o sistema prisional invista bilhões de reais para causar dor e sofrimento aos apenados.",linhafina:"Canal de informações sobre segurança pública, justiça e direitos humanos.",category:"Cidadania e Política",city:"São Paulo",lat:-23.534035,lng:-46.652783,meu:""},{name:"Justificando",apiUrl:"http://justificando.cartacapital.com.br/wp-json/wp/v2/",url:"http://justificando.cartacapital.com.br/",slug:"justificando",description:"Portal independente criado em 2014 que busca informação e artigos sobre justiça e poder, sempre com o compromisso com direitos humanos.",linhafina:"Portal independente que busca informação e artigos sobre justiça e poder.",category:"Cidadania e Política",city:"São Paulo",lat:-23.559879,lng:-46.65702,meu:""},{name:"Geledés",apiUrl:"https://www.geledes.org.br/wp-json/wp/v2/",url:"https://www.geledes.org.br/",slug:"geledes",description:"GELEDÉS Instituto da Mulher Negra fundada em 30 de abril de 1988. É uma organização da sociedade civil que se posiciona em defesa de mulheres e negros por entender que esses dois segmentos sociais padecem de desvantagens e discriminações no acesso às oportunidades sociais em função do racismo e do sexismo vigentes na sociedade brasileira.",linhafina:"Organização da sociedade civil que se posiciona em defesa de mulheres e negros.",category:"Gênero",city:"São Paulo",lat:-23.542907,lng:-46.646824,meu:"TRUE"},{name:"Blogueiras Negras",apiUrl:"http://blogueirasnegras.org/wp-json/wp/v2/",url:"http://blogueirasnegras.org/",slug:"blogueirasnegras",description:"Criado a partir da Blogagem Coletiva da Mulher Negra, organizada para motivar a produção de textos sobre a relação entre duas datas importantes que são próximas em nosso calendário: 20 de novembro (Dia Nacional para nos lembrar de Zumbi dos Palmares, um dos principais heróis da luta antirracista brasileira e Dia da Consciência Negra) e 25 de Novembro (Dia Internacional de combate à violência contra as mulheres). A missão do Blogueiras Negras é promover a livre produção de conteúdo, partindo do principio de que às mulheres negras sempre foi negado lugares e discursos.",linhafina:"Mulheres negras e afrodescentes discutem negritude e feminismo.",category:"Gênero",city:"Rio de Janeiro e São Paulo",lat:-22.9811491,lng:-43.2359402,meu:""},{name:"AzMina",apiUrl:"http://azmina.com.br/wp-json/wp/v2/",url:"http://azmina.com.br/",slug:"azmina",description:"Azmina é uma associação sem fins lucrativos que busca usar a cultura e a informação para alimentar o debate e empoderar mulheres. O principal produto é a Revista AzMina  para mulheres de A a Z, criada em 2015, que visa estimular o empoderamento feminino por meio da promoção da cultura e da informação de qualidade.",linhafina:"Usar a cultura e a informação para alimentar o debate e empoderar mulheres.",category:"Gênero",city:"Do Mundo",lat:-23.540581,lng:-46.697379,meu:""},{name:"Agência Pública",apiUrl:"https://apublica.org/wp-json/wp/v2/",url:"https://apublica.org/",slug:"agenciapublica",description:"Pioneira do Brasil, a Agência Pública – fundada em 2011 – aposta num modelo de jornalismo sem fins lucrativos para manter a independência. Sua missão é produzir reportagens de fôlego pautadas pelo interesse público, sobre as grandes questões do país do ponto de vista da população – visando ao fortalecimento do direito à informação, à qualificação do debate democrático e à promoção dos direitos humanos.",linhafina:"Reportagens de fôlego pautadas pelo interesse público.",category:"Cidadania e Política",city:"Rio de Janeiro",lat:-22.952418,lng:-43.188695,meu:""},{name:"Envolverde",apiUrl:"http://envolverde.cartacapital.com.br/wp-json/wp/v2/",url:"http://envolverde.cartacapital.com.br/",slug:"envolverde",description:"O Projeto Envolverde foi criado em 1995 para fazer a gestão do semanário Terramérica, realizado em parceria com o Programa das Nações Unidas para o Meio Ambiente (Pnuma) e o Programa das Nações Unidas para o Desenvolvimento (Pnud), que depois veio a receber apoio do Banco Mundial. O portal, criado em 1998 e decorrente do projeto, hoje é um dos principais sites brasileiros sobre sustentabilidade. Já recebeu dois prêmios Ethos e um Prêmio de Melhor Mídia em Meio Ambiente do Instituto Chico Mendes, entre outros. O objetivo principal do site é ampliar o conhecimento social da sustentabilidade por meio do jornalismo e da comunicação.",linhafina:"Ampliar o conhecimento social da sustentabilidade por meio do jornalismo.",category:"Meio Ambiente",city:"São Paulo",lat:-23.554872,lng:-46.686545,meu:""},{name:"Cidade Para Pessoas",apiUrl:"http://cidadesparapessoas.com/wp-json/wp/v2/",url:"http://cidadesparapessoas.com/",slug:"cidadeparapessoas",description:"É um projeto de investigação que interpreta e experimenta ideias para cidades mais humanas. Investiga a vida urbana em expedições por cidades do Brasil e do mundo usando como ferramentas a apuração jornalística e o desenho de observação. Interpreta suas descobertas em narrativas com diversas linguagens  reportagens, diários ilustrados, vídeos, mapas, palestras, exposições etc. E experimenta algumas dessas ideias na prática, em oficinas e protótipos de intervenções urbanas. Existe desde 2011.",linhafina:"Projeto que interpreta e experimenta ideias para cidades mais humanas.",category:"Cidadania e Política",city:"São Paulo",lat:-23.556291,lng:-46.662371,meu:""},{name:"Desacato",apiUrl:"http://desacato.info/wp-json/wp/v2/",url:"http://desacato.info/",slug:"desacato",description:"Cooperativa de jornalistas, produtores culturais, técnicos em informática, profissionais em áreas específicas, tradutores, cinegrafistas, fotógrafos, designers, publicitários e editores. Foi fundada em 2011.",linhafina:"Cria fontes de trabalho para jornalistas e produtores culturais independentes.",category:"Cidadania e Política",city:"Florianópolis",lat:-27.595285,lng:-48.549152,meu:""},{name:"Passa Palavra",apiUrl:"http://passapalavra.info/wp-json/wp/v2/",url:"http://passapalavra.info/",slug:"passapalavra",description:"Grupo de orientação anticapitalista fundado em 2009 que, independente de partidos e demais poderes políticos e econômicos, é formado por colaboradores de Portugal e do Brasil, cujo intuito maior é construir um espaço comunicacional que contribua para a articulação e a unificação prática das lutas sociais. Estão disponíveis no site notícias, artigos opinativos, cartuns, denúncias, vídeos, áudios, debates e outros materiais informativos de produção própria, visando à construção de uma rede de solidariedade e colaboração entre todos aqueles que lutam contra as injustiças sociais.",linhafina:"Construir um espaço comunicacional que contribua para a articulação e a unificação prática das lutas sociais.",category:"Cidadania e Política",city:"Brasil e Portugal",lat:39.3841994,lng:-9.7235212,meu:""},{name:"Projeto Colabora",apiUrl:"http://projetocolabora.com.br/wp-json/wp/v2/",url:"http://projetocolabora.com.br/",slug:"projetocolabora",description:"Colabora é um projeto jornalístico sem fins lucrativos nem qualquer vinculação partidária. Ele nasce da certeza de que é preciso enfrentar a ideia do Eu, do Aqui e do Agora. Um conceito que tem dominado boa parte das conversas e das decisões que nos cercam. Prefere o Nós, em Qualquer Lugar, a Qualquer Hora. Quer trocar o Faça Você Mesmo pela Construção Coletiva.",linhafina:"Projeto colaborativo de jornalismo ambiental.",category:"Meio Ambiente",city:"Rio de Janeiro",lat:-22.941711,lng:-43.183721,meu:""},{name:"Periferia em Movimento",apiUrl:"http://periferiaemmovimento.com.br/wp-json/wp/v2/",url:"http://periferiaemmovimento.com.br/",slug:"periferiaemmovimento",description:"Como meio alternativo à mídia convencional e com uma perspectiva de dentro pra dentro, o site acompanha, reflete, apoia e difunde ações sociais, culturais, políticas e econômicas de iniciativa popular que visam à garantia dos direitos fundamentais nas bordas das cidades, especialmente no extremo sul de São Paulo, desde 2012.",linhafina:"Meio alternativo à mídia convencional e com uma perspectiva 'de dentro pra dentro'.",category:"Cidadania e Política",city:"São Paulo",lat:-23.718433,lng:-46.699131,meu:""},{name:"Livre Jor",apiUrl:"http://livre.jor.br/wp-json/wp/v2/",url:"http://livre.jor.br/",slug:"livrejor",description:'Livre.jor é feito por jornalistas e existe desde 2014, com a regra de só usar dados públicos como matéria-prima para as notícias. O foco é aquilo que acontece no Paraná. Para isso fazem análise de bancos de dados, acompanham sistematicamente diários e documentos oficiais. Também "entrevistam" os poderes públicos via Lei de Acesso à Informação.',linhafina:"Coloca as pessoas diante da informação, usando só dados públicos como matéria-prima para as notícias.",category:"Cidadania e Política",city:"Curitiba",lat:-25.426214,lng:-49.26625,meu:""},{name:"Terra Sem Males",apiUrl:"http://www.terrasemmales.com.br/wp-json/wp/v2/",url:"http://www.terrasemmales.com.br/",slug:"terrasemmales",description:"O Terra Sem Males é um projeto que pratica o jornalismo independente, com a colaboração de vários jornalistas, para a produção de reportagens e começou em 2015. A missão é dar voz e visibilidade às populações e povos deixados de lado pelos donos da mídia convencional. Luta pela democratização da comunicação, para que seja efetivamente uma concessão pública, e incentiva a criação de novos espaços de comunicadores e comunicadoras populares. Aposta na produção de reportagens, sob o ponto de vista dos trabalhadores, com a valorização das imagens como fonte de informação.",linhafina:"Dar voz e visibilidade às populações e povos deixados de lado pelos donos da mídia convencional.",category:"Cidadania e Política",city:"Curitiba",lat:-25.432695,lng:-49.257924,meu:""},{name:"Revista Movimento",apiUrl:"https://movimentorevista.com.br/wp-json/wp/v2/",url:"https://movimentorevista.com.br/",slug:"revistamovimento",description:"A Revista Movimento é uma publicação teórico-política orientada para o debate de ideias entre os socialistas, a elaboração programática e a ação política. Editada trimestralmente desde março de 2016, a revista recebe contribuições de intelectuais marxistas, militantes políticos e ativistas de movimentos sociais.",linhafina:"Debate de ideias entre os socialistas, a elaboração programática e a ação política",category:"Cidadania e Política",city:"",lat:-23.6024606,lng:-46.6757525,meu:"TRUE"},{name:"Revista Serrote",apiUrl:"http://www.revistaserrote.com.br/wp-json/wp/v2/",url:"http://www.revistaserrote.com.br/",slug:"revistaserrote",description:"Quem edita a serrote tem como horizonte o espírito daqueles que viram, no ensaio, o jogo e a felicidade, e, no ensaísta, o homem liberto”, diz o editorial da primeira revista, resumindo o que mantém nosso entusiasmo a cada número que publicamos.",linhafina:"Serrote é uma revista quadrimestral publicada pelo Instituto Moreira Salles (IMS), dedicada a ensaios, artes visuais, literatura e cultura. Iniciou sua publicação em 2009.",category:"Cultura e Arte",city:"São Paulo",lat:-23.556574,lng:-46.662414,meu:"TRUE"},{name:"Catarinas",apiUrl:"http://catarinas.info/wp-json/wp/v2/",url:"http://catarinas.info/",slug:"catarinas",description:"A linha editorial de Catarinas se encontra entre o jornalismo como um direito e os direitos humanos como uma premissa básica para a produção do jornalismo. Também se identifica como feminista, pretendendo o diálogo com as diversas linhas teóricas e políticas do feminismo, mediando suas perspectivas diante da realidade. Catarinas se coloca com uma unidade ativista do jornalismo enquanto direito e do feminismo enquanto estratégia de ação para a superação desta sociedade que ainda reserva lugares para as mulheres.",linhafina:"O Portal de Notícias Catarinas é um veículo de jornalismo especializado em gênero.",category:"Gênero",city:"Florianópolis",lat:-27.597497,lng:-48.484446,meu:""},{name:"Nonada",apiUrl:"http://www.nonada.com.br/wp-json/wp/v2/",url:"http://www.nonada.com.br/",slug:"nonada",description:"Coletivo de jornalismo cultural e alternativo composto por cerca de vinte pessoas que trabalham de forma colaborativa. Procura relacionar as diversas formas de expressão artística com temas pertinentes à realidade e relativos aos direitos humanos.",linhafina:"Coletivo de jornalismo cultural e alternativo.",category:"Cultura e Arte",city:"Porto Alegre",lat:-30.044029,lng:-51.198437,meu:""},{name:"Repórter Brasil",apiUrl:"http://reporterbrasil.org.br/wp-json/wp/v2/",url:"http://reporterbrasil.org.br/",slug:"reporterbrasil",description:"O jornalismo da Repórter Brasil tem experiência em monitorar os problemas trabalhistas e impactos socioambientais dos maiores setores econômicos do país. Um dos diferenciais é a habilidade de rastrear cadeias produtivas de ponta a ponta: revelando a ligação entre violações de direitos humanos e ambientais na base da produção e as grandes marcas nacionais e internacionais responsáveis por isso.",linhafina:"Monitorar os problemas trabalhistas e impactos socioambientais dos maiores setores econômicos do país.",category:"Cidadania e Política",city:"São Paulo",lat:-23.543233,lng:-46.682765,meu:""},{name:"Candeia",apiUrl:"http://www.candeia.jor.br/wp-json/wp/v2/",url:"http://www.candeia.jor.br/",slug:"candeia",description:"Formado em 2014, o coletivo Candeia tem como missão realizar reportagens e produtos audiovisuais sobre direitos humanos e política. Além disso, mantém um projeto chamado Expressão Comunitária, que fornece oficinas de introdução ao jornalismo e audiovisual independentes para jovens moradores da periferia que se interessam por comunicação.",linhafina:"Reportagens e produtos audiovisuais sobre direitos humanos e política.",category:"Cidadania e Política",city:"São Paulo",lat:-23.549267,lng:-46.635971,meu:""},{name:"Amazônia Real",apiUrl:"http://amazoniareal.com.br/wp-json/wp/v2/",url:"http://amazoniareal.com.br/",slug:"amazoniareal",description:"A agência Amazônia Real nasceu em 2013 e tem o objetivo de dar oportunidade de direitos e acesso à mídia à população amazônica, inclusive as mulheres indígenas e não indígenas, produzindo e difundindo informação de qualidade e profunda na própria região por meio dos seguintes eixos temáticos: meio ambiente, povos indígenas, povos tradicionais, conflitos agrários, direitos humanos e contas públicas.",linhafina:"Oportunidade de direitos e acesso à mídia à população amazônica.",category:"Meio Ambiente",city:"Manaus",lat:-3.12057,lng:-60.021389,meu:""},{name:"Info Amazônia",apiUrl:"https://infoamazonia.org/pt/wp-json/wp/v2/",url:"https://infoamazonia.org/pt/",slug:"infoamazonia",description:"InfoAmazônia agrega dados e notícias sobre a Amazônia, a maior floresta tropical contínua do planeta. O projeto criado em 2012 é sustentado por uma rede de organizações e jornalistas que oferecem atualizações constantes dos nove países da região. As bases de dados compartilhadas por InfoAmazônia estarão sempre disponíveis para download e serão renovadas com frequência. O cruzamento das notícias com os dados pretende melhorar a percepção sobre os desafios para a conservação da floresta.",linhafina:"Dados e notícias sobre a Amazônia.",category:"Meio Ambiente",city:"São Paulo",lat:-23.532402,lng:-46.651883,meu:""},{name:"Scream and Yell",apiUrl:"http://screamyell.com.br/site/wp-json/wp/v2/",url:"http://screamyell.com.br/site/",slug:"screamyell",description:"Um site jornalístico sobre cultura pop, com entrevistas, reviews e coberturas de festivais de música, cinema, cerveja. Também produzem e lançam álbuns, fazem podcast e mixtapes e jornalismo musical aprofundado independentemente do apelo do entrevistado: tratando Caetano Veloso, Romulo Fróes e Loomer como iguais, porque todos fazem boa música.",linhafina:"Site jornalístico sobre cultura pop, com entrevistas, reviews e coberturas de festivais de música, cinema, cerveja.",category:"Cultura e Arte",city:"São Paulo",lat:-23.570674,lng:-46.691424,meu:""},{name:"Vértices Inconfidentes",apiUrl:"http://verticesinconfidentes.com.br/wp-json/wp/v2/",url:"http://verticesinconfidentes.com.br/",slug:"verticesinconfidentes",description:"O VERTICES Inconfidentes é um portal de informação online fundado em outubro de 2015. Representado por estudantes de Jornalismo da UFOP, o veículo prioriza a distribuição de um conteúdo mais divergente e amplo em seu contexto. Sem amarras editoriais, as estórias - e histórias - tendem a se tornar um ponto inicial de reflexão para uma sociedade crítica e cada vez mais conectada. Para atingir uma solidez informativa e evitar a disseminação superficial de conteúdo, o VERTICES se resguarda no direito de esperar e deixar o imediatismo em segundo plano - salvo exceções.",linhafina:"Portal direcionado para as regiões de Mariana e Ouro Preto, com foco em contextualização e autonomia de conteúdo.",category:"Cidadania e Política",city:"Mariana",lat:-20.365341,lng:-43.415023,meu:""},{name:"B9",apiUrl:"http://www.b9.com.br/wp-json/wp/v2/",url:"http://www.b9.com.br/",slug:"b9",description:"O B9 nasceu e continua sendo independente, contando hoje com uma rede de podcasts (10 no total, abordando assuntos bem variados, que vão de política a séries de TV) e publicações sobre o mercado de criatividade do Brasil e do mundo.",linhafina:"Conteúdo opinativo sobre criatividade, inovação e mercado de comunicação.",category:"Cultura e Arte",city:"São Paulo",lat:-23.567343,lng:-46.697626,meu:""},{name:"Fala Roça",apiUrl:"http://www.falaroca.com/wp-json/wp/v2/",url:"http://www.falaroca.com/",slug:"falaroca",description:"O Fala Roça existe há três anos e é formado por três jovens da Rocinha, entre 22 e 27 anos de idade. Nosso impresso é rodado a cada 2 meses e entregue cuidadosamente de porta em porta, dentro de becos e ruas de difícil acesso que não estão na rota da 'favela turística'. A ideia de criar um canal de comunicação comunitária começou em 201, partindo da insatisfação em relação às notícias produzidas sobre a Rocinha na grande mídia. Nós, enquanto moradores desse lugar, tínhamos (e temos) a vontade de dizer o que antes não se dava destaque, como as histórias incríveis que acontecem aqui e eram abafadas por tiroteios, tráfico de drogas e toda a leva de coisas ruins. Criamos então o Fala Roça e escolhemos como o elemento principal disso a cultura nordestina, pois cerca de 70% da comunidade tem ligações com a cultura do nordeste.",linhafina:"O Fala Roça é um jornal impresso, gratuito, bimestral, entregue de porta em porta, criado por jovens da Rocinha e inspirado na cultura nordestina.",category:"Cidadania e Política",city:"Rio de Janeiro",lat:-22.992021,lng:-43.251278,meu:""},{name:"Apartamento 702",apiUrl:"https://apartamento702.com.br/wp-json/wp/v2/",url:"https://apartamento702.com.br/",slug:"apartamento702",description:"O Apartamento 702 é um site que cobre, preferencialmente, as áreas de cultura e criatividade em Natal, mas que não se furta aos debates importantes que envolvem direitos de minoria e política na cidade. O site existe há dois anos e é mantido pelo jornalista Fábio Farias e pela publicitária Alana Cascudo. Ele conta com colaboradores da cidade entre jornalistas, profissionais liberais, universitários e outros.",linhafina:"A cobertura prioritária são temas que envolve cultura, política cultural, eventos e criatividade na cidade.",category:"Cultura e Arte",city:"Natal",lat:-5.782495,lng:-35.200274,meu:""},{name:"Megafonia",apiUrl:"http://megafonia.info/wp-json/wp/v2/",url:"http://megafonia.info/",slug:"megafonia",description:"Mídia independente especializada na resistência popular e direitos humanos. Até o momento, a revista tem três edições publicadas online , além de reportagens no site. Também compartilha informações de coletivos e de outras mídias independentes nas redes sociais. A revista é um projeto que surgiu no fim de 2013, ideia de dois jornalistas que estavam cansados de vivenciar uma coisa nas ruas e receber informações deturpadas pelos grandes veículos de comunicação.",linhafina:"Jornalismo independente, sem amarras.",category:"Cidadania e Política",city:"São Paulo",lat:-23.579467,lng:-46.655564,meu:""},{name:"Peneira Musical",apiUrl:"http://peneiramusical.com.br/wp-json/wp/v2/",url:"http://peneiramusical.com.br/",slug:"peneiramusical",description:"Peneira Musical é um blog criado por músicos e jornalistas musicais com foco na nova música brasileira, através de divulgação de material inédito e colaborações com a blogosfera.",linhafina:"O melhor da música brasileira e mundial passa por aqui.",category:"Cultura e Arte",city:"Rio de Janeiro",lat:-22.92021,lng:-43.193334,meu:""},{name:"Papo Reto",apiUrl:"https://paporeto.net.br/wp-json/wp/v2/",url:"https://paporeto.net.br/",slug:"paporeto",description:"Criado em setembro de 2013 por um grupo de jornalistas, liderados por Rosenildo Ferreira, o portal é parte do Projeto Colaborativo 1 Papo Reto e faz a cobertura de temas ligados ao debate da sustentabilidade de uma forma inovadora, preocupada em traduzir este universo para os integrantes das classes C e B.",linhafina:"Portal de notícias sobre sustentabilidade.",category:"Meio Ambiente",city:"São Paulo",lat:-23.53952,lng:-46.633846,meu:""},{name:"Jornal Já",apiUrl:"http://www.jornalja.com.br/wp-json/wp/v2/",url:"http://www.jornalja.com.br/",slug:"jornalja",description:"Além do site com atualização diária, edita uma revista temática, um jornal de bairro e um de grandes reportagens. Também investe em livros escritos por jornalistas e lançados sob o selo JÁ Editores. É editado por um coletivo de jornalistas independentes e se financia por uma multiplicidade de canais - desde patrocínios tradicionais, venda de livros, revistas e jornais, projetos culturais e, mais recentemente, pela sua primeira campanha de crowdfunding.",linhafina:"Jornal alternativo de Porto Alegre com 30 anos de existência que privilegia grandes reportagens sobre temas que a gente não vê por aí.",category:"Cidadania e Política",city:"Porto Alegre",lat:-30.03463,lng:-51.228222,meu:""},{name:"Revista Gambiarra",apiUrl:"http://revistagambiarra.com.br/wp-json/wp/v2/",url:"http://revistagambiarra.com.br/",slug:"revistagambiarra",description:"A Revista Gambiarra é um veículo online que pretende adicionar novas práticas na produção jornalística de Vitória da Conquista e região, inserido debates e questionamentos através de entrevistas e grandes reportagens sobre os mais diversos temas.",linhafina:"Jornalismo, Cultura e Ativismo",category:"Cidadania e Política",city:"Vitória da Conquista",lat:-14.863313,lng:-40.842119,meu:""},{name:"Manual do Usuário",apiUrl:"https://www.manualdousuario.net/wp-json/wp/v2/",url:"https://www.manualdousuario.net/",slug:"manualdousuario",description:"O Manual do Usuário é um site de tecnologia que não publica notícias. Em vez disso, veicula matérias especiais, mais aprofundadas e com pontos de vista diferentes. Além dessa linha editorial menos célere, sua fundação ainda é composta pela filosofia slow web e por uma comunidade interessada e respeitosa de leitores.",linhafina:"Site slow web sobre tecnologia que escreve mais sobre menos assuntos.",category:"Cultura e Arte",city:"Maringá",lat:-23.420292,lng:-51.936972,meu:""},{name:"Portal Giro",apiUrl:"https://portalgiro.com/wp-json/wp/v2/",url:"https://portalgiro.com/",slug:"portalgiro",description:"O Portal Giro nasceu da iniciativa de dois amigos que, ao se mudarem para Petrópolis, buscaram frustradamente uma colocação nos jornais locais. Não foi necessária uma pesquisa muito extensa para entender que o jornalismo da cidade era feito pelas mesmas pessoas há muitos anos e que não havia lugar para gente ou ideias novas. Cansados do status quo e ainda cheios da vontade de fazer produzir informação para as pessoas, os dois amigos decidiram fundar seu próprio portal de notícias. Sem dinheiro para montar uma estrutura impressa, a opção foi criar um jornal online. O Portal hoje conta, principalmente, com a colaboração dos que leem para fazer as denúncias e informar o que acontece na cidade de Petrópolis e nas cidades vizinhas.",linhafina:"Jornalismo independente da Região Serrana do Rio.",category:"Cidadania e Política",city:"Petrópolis",lat:-22.513327,lng:-43.17805,meu:""},{name:"Portallos",apiUrl:"http://www.portallos.com.br/wp-json/wp/v2/",url:"http://www.portallos.com.br/",slug:"portallos",description:"O Portallos surgiu em 2008, inspirado em sites como o Continue e Hadouken (que eram sites de jornalistas na área de games no Brasil). Nos últimos anos ele vem se profissionalizando, focando em textos editoriais, reviews e críticas, sempre com opiniões e reflexões embasadas, cobrindo o entretenimento pop de forma informativa e opinativa, sem ser apelativo. Seu editor não é formato em jornalismo, porém tem formação em Direito, por isso o site faz mais textos do que conteúdo multimídia.",linhafina:"Cobertura do entretenimento pop feita com opiniões e reflexões.",category:"Cultura e Arte",city:"Nacional",lat:-23.296314,lng:-45.974028,meu:""},{name:"Sul 21",apiUrl:"https://www.sul21.com.br/wp-json/wp/v2/",url:"https://www.sul21.com.br/",slug:"sul21",description:"Somos um jornal veiculado exclusivamente na internet, comprometido com a democracia e a honestidade. Estes são valores inegociáveis e dos quais não nos afastaremos jamais. Nosso noticiário busca sempre a verdade factual, dando oportunidade de expressão a todas as correntes, sejam elas ideológicas, partidárias, religiosas ou esportivas.",linhafina:"Política do RS e Nacional, Mundo e Cultura.",category:"Cidadania e Política",city:"Rio Grande do Sul",lat:-29.991678,lng:-51.20153,meu:""},{name:"Agência Plano",apiUrl:"http://agenciaplano.com/wp-json/wp/v2/",url:"http://agenciaplano.com/",slug:"agenciaplano",description:"O Portal Latino-americano de Notícias nasceu em 2014 e tem como principal objetivo produzir conteúdo jornalístico sobre os países da América Latina. Acreditamos que é possível promover a integração da região também por meio de informação feita por e para a população latino-americana.",linhafina:"Portal de notícias feito por e para latino-americanos.",category:"Cidadania e Política",city:"São Paulo",lat:-23.535295,lng:-46.66655,meu:""},{name:"Conexão Israel",apiUrl:"http://www.conexaoisrael.org/wp-json/wp/v2/",url:"http://www.conexaoisrael.org/",slug:"conexaoisrael",description:"O Conexão Israel é composto por brasileiros que vivem em Israel produzem material original. Isso inclui análise, notícias e opiniões vindo de diversos campos do espectro político. Os temas são os mais variados, como atualidades, história, política, língua, sociedade, ciências e até culinária. São mais de três anos criando em torno de 3 matérias semanais que já passaram por duas guerras e duas eleições.",linhafina:"Opinião, informação e análise sobre Israel.",category:"Cidadania e Política",city:"Israel",lat:31.7964453,lng:35.1053189,meu:""},{name:"Boatos.org",apiUrl:"http://www.boatos.org/wp-json/wp/v2/",url:"http://www.boatos.org/",slug:"boatos",description:"Formado por jornalistas, o Boatos.org é um site que visa, diariamente, desmentir informações falsas que circulam na internet. A equipe do site busca, apura e publica desmentidos de boatos online. Atualmente, o site conta com a colaboração (principalmente em pautas) dos leitores e é atualizado diariamente.",linhafina:"Portal destinado a desmentir informações falsas que circulam na web.",category:"Cidadania e Política",city:"Brasília",lat:-15.79561,lng:-47.871841,meu:""},{name:"MigraMundo",apiUrl:"http://migramundo.com/wp-json/wp/v2/",url:"http://migramundo.com/",slug:"migramundo",description:"No ar desde 3 de outubro de 2012, o MigraMundo contém tanto notícias e relatos sobre problemas vividos pelos migrantes dentro e fora do país como avanços e reconhecimentos obtidos na questão migratória. Tocado por um grupo de pessoas simpáticas à questão das migrações, ele também busca ser um ponto de conexão entre estudiosos, militantes e demais interessados no tema.",linhafina:"Espaço para abordar e debater as múltiplas facetas que permeiam as migrações no Brasil e no mundo, combatendo estereótipos, racismo e xenofobia.",category:"Cidadania e Política",city:"São Paulo",lat:-23.558028,lng:-46.644537,meu:""},{name:"Revista Cardamomo",apiUrl:"http://www.revistacardamomo.com/wp-json/wp/v2/",url:"http://www.revistacardamomo.com/",slug:"revistacardamomo",description:"Uma revista de cultura aberta para qualquer papo cabeça ou conversa cotidiana e suas sugestões. O desejo é discutir as filosofias e as letargias da sociedade de maneira profunda.",linhafina:"Revista de jornalismo livre, cultura e arte aberta para qualquer papo cabeça ou conversa cotidiana.",category:"Cultura e Arte",city:"Recife",lat:-8.071851,lng:-34.877183,meu:""},{name:"De Olho Nos Ruralistas",apiUrl:"https://deolhonosruralistas.com.br/wp-json/wp/v2/",url:"https://deolhonosruralistas.com.br/",slug:"deolhonosruralistas",description:"Um observatório do agronegócio no Brasil.",linhafina:"Um observatório do agronegócio no Brasil.",category:"Meio Ambiente",city:"São Paulo",lat:-23.560281,lng:-46.644099,meu:""},{name:"De Olho No Paraguai",apiUrl:"https://deolhonosruralistas.com.br/deolhonoparaguai/wp-json/wp/v2/",url:"https://deolhonosruralistas.com.br/deolhonoparaguai/",slug:"deolhonoparaguai",description:"Um observatório do agronegócio no Paraguai.",linhafina:"Um observatório do agronegócio no Paraguai.",category:"Meio Ambiente",city:"São Paulo",lat:-23.560281,lng:-46.644099,meu:""}];
	// Define listas de sites
	function sortAbc (array) {
		array.sort(function(a, b) {
		    var textA = a.name.toUpperCase();
		    var textB = b.name.toUpperCase();
		    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});
	}
	sortAbc(wp.sites);


	wp.sitesCultura = wp.sites.filter(function(site) {
		return site.category == 'Cultura e Arte'
	});
	wp.sitesPolitica = wp.sites.filter(function(site) {
		return site.category == 'Cidadania e Política'
	});
	wp.sitesGenero = wp.sites.filter(function(site) {
		return site.category == 'Gênero'
	});
	wp.sitesMeioAmbiente = wp.sites.filter(function(site) {
		return site.category == 'Meio Ambiente'
	});

	// Shuffle array function
	function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;
	  while (0 !== currentIndex) {
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }
	  return array;
	}
	// Ocurrences function
	function occurrences(string, subString, allowOverlapping) {
	    string += "";
	    subString += "";
	    if (subString.length <= 0) return (string.length + 1);
	    var n = 0,
	        pos = 0,
	        step = allowOverlapping ? 1 : subString.length;

	    while (true) {
	        pos = string.indexOf(subString, pos);
	        if (pos >= 0) {
	            ++n;
	            pos += step;
	        } else break;
	    }
	    return n;
	}
	// Count Words funcion
	function countWords(s){
	    s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
	    s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
	    s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
	    return s.split(' ').length; 
	}

	function resumoPost (post) {
		var html = post.content.rendered.replace(/(<([^>]+)>)/ig,"");
		var resumo = html.substr(0, 100);
		var resumo = resumo.substr(0, Math.min(resumo.length, resumo.lastIndexOf(" "))) + " (...)"
		return resumo
	}

	var  getImage = function(pst) {
		if (pst._links['wp:featuredmedia'] != undefined) {
			//Featured Media
			var featuredmedia = $resource( pst._links['wp:featuredmedia'][0].href).get();
			$q.all([
			    featuredmedia.$promise
			]).then( function (data) {
				pst.featuredmedia = data[0].media_details.sizes;
			}, function (error) {
			});
		} else {
			pst.featuredmedia = false;
		};
	}

	var setMidia = function(pst) {
	  	// Mídia
		var midia = wp.sites.filter(function( obj ) {
		  return obj.apiUrl == pst._links.self[0].href.split('v2/')[0] + 'v2/';
		});
		if (pst.midia = midia[0] != undefined) {
			pst.midia = midia[0];
		};
	}

	wp.ultimas = function(siteLista, paginaAtual, porPagina) {
		var results = [];
		siteLista =  shuffle(siteLista);
		var index = siteLista.length - 1;
		for (var i = 0 ; i <= siteLista.length - 1; i++) {
			var posts = $resource( siteLista[i].apiUrl + "posts?per_page=:perpage", { perpage: porPagina, page: paginaAtual} ).query();
			$q.all([
			    posts.$promise
			]).then( function (data) { 
				var psts = data[0];
				psts.forEach(function(pst) {
					setMidia(pst);
					getImage(pst);
					// Resumo do post
					pst.resumo = resumoPost(pst) 
					// Readtime
					var wpm = 200;
					pst.readtime = countWords(pst.content.rendered) / wpm - (countWords(pst.content.rendered) / wpm) % 1 + 1
					// Dias atrás
					var today = new Date();
					var date_to_reply = new Date(pst.date);
					var daysFromToday = Math.ceil((today.getTime() - date_to_reply.getTime()) / (1000 * 60 * 60 * 24));
					
					if (daysFromToday < 365) {
						results.push(pst);
					};
				});
			
			}).finally(function() {
				$('#loading').css('display', 'none');
	 		});		
		};
		return results		
	}

	wp.singleSource = function(url, paginaAtual) {
		var results = [];
		var index = wp.sites.length - 1;
		var posts = $resource( url + "posts?per_page=:perpage", { perpage: 9, page: paginaAtual} ).query();
		$q.all([
		    posts.$promise
		]).then( function (data) { 
			var psts = data[0];
			psts.forEach(function(pst) {
				setMidia(pst);
				getImage(pst);
				// Resumo do post
				pst.resumo = resumoPost(pst) 
				// Readtime
				var wpm = 200;
				pst.readtime = countWords(pst.content.rendered) / wpm - (countWords(pst.content.rendered) / wpm) % 1 + 1
				// Dias atrás
				var today = new Date();
				var date_to_reply = new Date(pst.date);
				var daysFromToday = Math.ceil((today.getTime() - date_to_reply.getTime()) / (1000 * 60 * 60 * 24));
				
				results.push(pst);
				//Sort
				results.sort(function(a, b){
				    var keyA = new Date(a.date),
				        keyB = new Date(b.date);
				    // Compare the 2 dates
				    if(keyA < keyB) return 1;
				    if(keyA > keyB) return -1;
				    return 0;
				});
			});
		}).finally(function() {
			$('#loading').css('display', 'none');
	  });	
		return results		
	}
	
	wp.busca = function (termo, paginaAtual) {
		var results = [];
    var termos = termo.toLowerCase().split(' ');
    var termosBuscados = [];
    termos.forEach(function (pTermo) {
      termosBuscados[pTermo] = { name: pTermo, relevancia: 0 };
    });
		for (var i =  wp.sites.length - 1; i >= 0; i--) {
			var posts = $resource( wp.sites[i].apiUrl + "posts?search=:buscatermo&per_page=:perpage&page=:page", { buscatermo: termo.toLowerCase(), perpage: 5, page: paginaAtual} ).query()
			$q.all([
			    posts.$promise
			]).then( function (data) { 
				var psts = data[0];
				var siteResults = [];
				psts.forEach(function(pst) {
					
					setMidia(pst);

					getImage(pst);

					pst.resumo = resumoPost(pst) // Resumo do post
          pst.occ = [];
          termos.forEach(function (pTermo) {
            var occContent = occurrences(pst.content.rendered.toLowerCase(), ' ' + pTermo.toLowerCase() + ' ', true);
            var occExcerpt = occurrences(pst.resumo.toLowerCase(), ' ' + pTermo.toLowerCase() + ' ', true);
            var occTitle = occurrences(pst.title.rendered.toLowerCase(), ' ' + pTermo.toLowerCase() + ' ', true);
            
            pst.occ[pTermo] = {
              title: occTitle,
              content: occContent,
              excerpt: occExcerpt,
            }
            termosBuscados[pTermo].relevancia += occContent + occTitle;
            pst.relevancia = 10 + occContent * 5 + occExcerpt * 8 + occTitle * 13;
          });

					// Dias atrás
					var today = new Date();
					var date_to_reply = new Date(pst.date);
					var daysFromToday = Math.ceil((today.getTime() - date_to_reply.getTime()) / (1000 * 60 * 60 * 24));


          console.log(pst)
          pst.ranking = pst.occ;
					pst.relevancia = pst.relevancia - daysFromToday * 0.01;
          if (pst.relevancia > 0) {siteResults.push(pst);}
					
				});
				// results.push(siteResults)
				Array.prototype.push.apply(results, siteResults);
				results.sort(function(a, b){
				    // var keyA = new Date(a.date),
				    //     keyB = new Date(b.date);
				    var keyA = a.relevancia;
				    var keyB = b.relevancia;
				    // Compare the 2 dates
				    if(keyA < keyB) return 1;
				    if(keyA > keyB) return -1;
				    return 0;
				});
			}).finally(function() {
				$('#loading').css('display', 'none');
		  });
		};
    console.log(results)
    console.log(termosBuscados)
    setTimeout(function () {
      results.forEach(function (result) {
        result.occ.forEach(function (term) {
          term += 100;
        })
        console.log(result.occ)

      })

    }, 5000)
		return results
	}
	return wp
});
app.controller('MainCtrl', ['$scope', '$q', 'wp','$location', function($scope, $q, wp, $location) {
	$scope.busca = {};
  $scope.busca.buscatermo = ''
	$scope.sites = wp.sites;
	$scope.sitesCultura = wp.sitesCultura;
	$scope.sitesGenero = wp.sitesGenero;
	$scope.sitesPolitica = wp.sitesPolitica;
	$scope.sitesMeioAmbiente = wp.sitesMeioAmbiente;	

	

  $scope.buscaPosts = []

	
  $scope.closeMenu = function() {
		$('#sections-nav').removeClass('navOpen');
		$('#wrapper').removeClass('navOpen');
		$('#nav-inner').removeClass('navOpen');
		$('#navlayer').removeClass('navOpen');
	}
	$scope.searchSubmit = function() {
	  	$location.url('/busca/' + $scope.busca.buscatermo);
	  	$scope.closeMenu();

	}

  $scope.saibaMais = function () {
  	$('.saibamais').toggleClass('hidden')
  }

  $scope.midiaClass = function (site) {
  	if (! site.status) {
  		return 'not-working'
  	};
  }


  $scope.$on("$routeChangeSuccess", 
    function (event, current, previous, rejection) {

       setTimeout(function() {
        $('#sidebar').stickySidebar({
          containerSelector: '.main-content',
          innerWrapperSelector: '.sidebar__inner',
        });
      }, 2500);
      
  });

	$scope.setPosts = function (getPosts) {
		$('#loading').css('display', 'inline');
		$("html, body").animate({ scrollTop: $("body") }, "slow");
		$scope.paginaAtual = 1;
		$scope.ultimosPosts = getPosts($scope.paginaAtual);
	  $scope.ultimosPostsProx = getPosts($scope.paginaAtual + 1);
		$scope.proxPag = function() {
			$('#loading').css('display', 'inline');
			$("html, body").animate({ scrollTop: $("#post-row").offset().top - 60 }, "slow");
		  $scope.paginaAtual++
		  $scope.ultimosPosts = getPosts($scope.paginaAtual);
		}
		$scope.prevPag = function() {
			$('#loading').css('display', 'inline');
			$("html, body").animate({ scrollTop: $("#post-row").offset().top - 60 }, "slow");
		  if ($scope.paginaAtual > 0) {$scope.paginaAtual--};
		  $scope.ultimosPosts = getPosts($scope.paginaAtual);
		}
  }
}]);
app.controller('Home', ['$scope', '$q', 'wp', '$routeParams', function($scope, $q, wp, $routeParams) {
	$scope.midia = {
		name: 'Todos os Sites',
		linhafina: 'Facilitar o acesso à informação e ao jornalismo independente; popularizar e conectar diversos coletivos espalhados pelo Brasil.',
		description: 'Não só o desenvolvimento tecnológico e a reestruturação do mercado do jornalismo são responsáveis pela expansão do movimento pela mídia livre. A crise do modelo de civilização em que vivemos traz uma série de urgências que têm na comunicação uma ferramenta para gerar mudança.<br><br>As vítimas da crise de refugiados, do racismo, do assédio, das chacinas nas favelas e nos presídios, da exploração do trabalho, do machismo e todas as formas de opressão têm usado a comunicação, sobretudo via internet, para apresentar suas visões da realidade e suas demandas. Todos os anos surgem centenas de coletivos no Brasil que buscam expandir os limites do jornalismo convencional, centralizado em poucos conglomerados que apresentam uma visão unidimensional de mundo.<br><br>Este site tem a missão de servir sobretudo a esses produtores de conteúdo, mas também à sua comunidades e ao público em geral, potencializando o alcance, as conexões e a colaboração no universo do jornalismo independente.',
	}
	var getPosts = function (page) {
		return wp.ultimas(wp.sites ,page, 1)
	}

  	$scope.setPosts(getPosts);

}]);
app.controller('Cat', ['$scope', '$q', 'wp', '$routeParams', function($scope, $q, wp, $routeParams) {
	$scope.midia = { name: $routeParams.catSlug };
	$scope.sitesLista = $scope.sites;
	if ($routeParams.catSlug == 'meioambiente') {
		var getPosts = function (page) {
      $scope.sitesCat = wp.sitesMeioAmbiente;
			return wp.ultimas(wp.sitesMeioAmbiente, page, 3)
		}
		$scope.midia = { name: 'Meio Ambiente' };
	};
	if ($routeParams.catSlug == 'politica') {
		var getPosts = function (page) {
      $scope.sitesCat = wp.sitesPolitica;
			return wp.ultimas(wp.sitesPolitica, page, 1)
		}
		$scope.midia = { name: 'Cidadania e Política' };
	};
	if ($routeParams.catSlug == 'cultura') {
		var getPosts = function (page) {
      $scope.sitesCat = wp.sitesCultura;
			return wp.ultimas(wp.sitesCultura, page, 2)
		}
		$scope.midia = { name: 'Cultura e Arte' };
	};
	if ($routeParams.catSlug == 'genero') {
		var getPosts = function (page) {
      $scope.sitesCat = wp.sitesGenero;
			return wp.ultimas(wp.sitesGenero, page, 4)
		}
		$scope.midia = { name: 'Gênero' };
	};

  	$scope.setPosts(getPosts);



    $scope.isThisCat = function(cat) {
      console.log($scope.sitesCat);
      console.log(cat, $scope.midia.name);
      if (cat != $scope.midia.name) {
        return 'isNot';
      }
    }

}]);
app.controller('Single', ['$scope', '$q', 'wp', '$routeParams', function($scope, $q, wp, $routeParams) {

	var midia = $scope.sites.filter(function( obj ) {
	  return obj.slug == $routeParams.source;
	});
	$scope.midia = midia[0];
	var getPosts = function (page) {
		return wp.singleSource(midia[0].apiUrl, page)
	}
  	$scope.setPosts(getPosts);
	initMapSingle();

  	var map;
	function initMapSingle() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 5,
          center: {lat: $scope.midia.lat, lng: $scope.midia.lng},
          draggable: false,
          fullscreenControl: false,
          scaleControl: false,
          streetViewControl: false,
          scrollwheel: false,
          mapTypeControl: false,
        });
       
    	var marker = new google.maps.Marker({
          position: {lat: $scope.midia.lat, lng: $scope.midia.lng},
          map: map,
        });
        var contentString = '<a href="/#/' + $scope.midia.slug + '"><h5>' + $scope.midia.name + '</h5></a><p>' + $scope.midia.linhafina + '</p>';
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		marker.addListener('click', function() {
			infowindow.open(map, marker);
		});

    }
}]);
app.controller('Busca', ['$scope', '$q', 'wp', '$routeParams', function($scope, $q, wp, $routeParams) {
	$scope.midia = {
		name: decodeURI($routeParams.termo)
	}
	$scope.termobuscado = $scope.busca.buscatermo;
	var getPosts = function (page) {
		return wp.busca($routeParams.termo, page)
	}
  	$scope.setPosts(getPosts);
}]);
app.controller('Mapa', ['$scope', '$q', 'wp', '$routeParams', function($scope, $q, wp, $routeParams) {

  	var map;
	function initMap() {
		var markers = [];
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: {lat: -16.1336219, lng: -51.9039046}
        });
        wp.sites.forEach(function(site) {
        	var marker = new google.maps.Marker({
	          position: {lat: site.lat, lng: site.lng},
	          map: map,
	        });
	        marker.addListener('click', function() {
	          map.setZoom(10);
	          map.setCenter(marker.getPosition());
	        });
	        var contentString = '<a href="/#/' + site.slug + '"><h5>' + site.name + '</h5></a><p>' + site.linhafina + '</p>';
			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
	        markers.push(marker);
        })
        var markerCluster = new MarkerClusterer(map, markers,
            {
            	imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            	maxZoom: 7,
        	});
    }
    initMap();
}]);
