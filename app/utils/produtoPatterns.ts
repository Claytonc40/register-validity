// Tipos de produtos
export interface ProdutoPattern {
  nome: string;
  palavrasChave: string[];
  categoria: string;
}

// Lista de produtos conhecidos
export const produtosConhecidos: ProdutoPattern[] = [
  {
    nome: "PÃO REGULAR",
    palavrasChave: [
      "BB PAO REGULAR",
      "BB PÃO REGULAR",
      "PAO REGULAR",
      "PÃO REGULAR",
      "PAO REGULAR",
      "PÃO REGULAR",
    ],
    categoria: "Pães",
  },
  {
    nome: "PÃO QUARTERÃO",
    palavrasChave: [
      "BB PAO QUARTERAO",
      "BB PÃO QUARTERÃO",
      "PAO QUARTERAO",
      "PÃO QUARTERÃO",
    ],
    categoria: "Pães",
  },
  {
    nome: "PÃO BIG MAC",
    palavrasChave: [
      "BB PAO BIG MAC",
      "PAO BIG MAC",
      "BB PÃO BIG MAC",
      "PÃO BIG MAC",
      "PAO BIG MAC",
      "PÃO BIG MAC",
    ],
    categoria: "Pães",
  },
  {
    nome: "COBERTURA DE MORANGO",
    palavrasChave: [
      "COBERTURA DE MORANGO",
      "COBERTURA MORANGO",
      "SALSA DULCE",
      "AZUCAR Y FRUTILLAS",
      "BASE DE AZUCAR",
    ],
    categoria: "Coberturas",
  },
  {
    nome: "COBERTURA DE CHOCOLATE",
    palavrasChave: [
      "COBERTURA DE CHOCOLATE",
      "COBERTURA CHOCOLATE",
      "CHOCOLATE TOPPING",
      "SALSA DE CHOCOLATE",
      "COBERTURA SABOR CHOCOLATE",
    ],
    categoria: "Coberturas",
  },
  {
    nome: "ALFACE",
    palavrasChave: ["ALFACE", "ALFACAS", "TIRAS", "AMERICANA"],
    categoria: "Hortifruti",
  },
  {
    nome: "MOLHO MAIONESE",
    palavrasChave: [
      "MAIONESE",
      "MAYONESA",
      "MAIONESE POUCH",
      "MAYONESA POUCH",
      "MAIONESE/MAYONESA",
      "MAIONESE/MAYONESA POUCH",
    ],
    categoria: "Molhos e condimentos",
  },
  {
    nome: "MOLHO AGRIDOCE",
    palavrasChave: [
      "MOLHO",
      "AGRIDOCE",
      "MOLHO AGRIDOCE",
      "MOLHO AGRIDOCE MOLHO NÃO EMULSIONADO",
      "MOLHO AGRIDOCE MOLHO NÃO EMULSIONADO SABOR AGRIDOCE",
    ],
    categoria: "Molhos e condimentos",
  },
  {
    nome: "FEIJÃO PRETO",
    palavrasChave: ["FEIJÃO", "FEIJAO", "PRETO"],
    categoria: "Grãos e legumes",
  },
  {
    nome: "HAMBÚRGUER 10.1",
    palavrasChave: [
      "HAMBURGUER CONGELADO DE BOVINO",
      "HAMBURGUER BOVINO",
      "HAMBURGER BOVINO",
      "HAMBÚRGUER BOVINO",
      "CARNE REG 10.1",
      "CARNE 10.1",
      "CARNE REG",
      "HAMBURGUER DE BOVINO",
      "HAMBURGER DE BOVINO",
      "HAMBÚRGUER DE BOVINO",
    ],
    categoria: "Carnes",
  },
  {
    nome: "HAMBÚRGUER 4.1",
    palavrasChave: [
      "HAMBURGUER CONGELADO DE BOVINO",
      "HAMBURGUER BOVINO",
      "HAMBURGER BOVINO",
      "HAMBÚRGUER BOVINO",
      "CARNE REG 4.1",
      "CARNE 4.1",
      "PARA CIMA",
      "HAMBURGUER DE BOVINO",
      "HAMBURGER DE BOVINO",
      "HAMBÚRGUER DE BOVINO",
    ],
    categoria: "Carnes",
  },
  {
    nome: "MEDIALUNAS DE MANTECA",
    palavrasChave: [
      "MEDIALUNAS DE MANTECA",
      "MEDIALUNA DE MANTECA",
      "FACTURAS DE PASTELERIA",
      "MEDIALUNAS CONGELADAS",
      "FACTURAS CONGELADAS",
      "MEDIALUNA CONGELADA",
      "MEDIALUNA MANTECA",
      "FACTURAS MANTECA",
      "FACTURAS DE PASTELERIA - MEDIALUNAS DE MANTECA CONGELADAS",
      "FACTURAS Y MASAS HOJALDRADAS",
      "CARDA S.A.",
      "INDUSTRIA ARGENTINA",
    ],
    categoria: "Padaria",
  },
  {
    nome: "COOKIE BAUNILHA COM GOTAS DE CHOCOLATE",
    palavrasChave: [
      "COOKIE ASSADO BAUNILHA COM GOTAS",
      "COOKIE BAUNILHA",
      "COOKIE DE BAUNILHA",
      "COOKIE ASSADO",
      "1005 - COOKIE",
      "COOKIE GOTAS",
      "COOKIE BAUNILHA GOTAS",
      "COOKIE BAUNILHA CHOCOLATE",
    ],
    categoria: "Padaria",
  },
  {
    nome: "COOKIE CHOCOLATE COM GOTAS DE CHOCOLATE",
    palavrasChave: [
      "40.23.1004 - COOKIE ASSADO",
      "COOKIE ASSADO CONG. CHOCOLATE",
      "COOKIE CHOCOLATE",
      "COOKIE DE CHOCOLATE",
      "COOKIE CHOCOLATE COM GOTAS",
      "COOKIE ASSADO CHOCOLATE",
      "COOKIE CONG. CHOCOLATE",
      "COOKIE GOTAS DE CHOCOLATE",
      "40.23.1004",
    ],
    categoria: "Padaria",
  },
  {
    nome: "WAFFLE DE PÃO DE QUEIJO",
    palavrasChave: [
      "40.05.1602 - WAFFLE DE PÃO DE QUEIJO",
      "WAFFLE DE PAO DE QUEIJO",
      "WAFFLE PÃO DE QUEIJO",
      "WAFFLE PAO DE QUEIJO",
      "40.05.1602",
      "WAFFLE DE QUEIJO",
      "WAFFLE ASSADO E CONG",
      "WAFFLE DE PÃO DE QUEIJO ASSADO E CONG",
      "WAFFLE DE PAO DE QUEIJO ASSADO E CONG",
    ],
    categoria: "Padaria",
  },
  {
    nome: "PÃO DE QUEIJO CRU CONGELADO",
    palavrasChave: [
      "40.05.1011 - PÃO DE QUEIJO",
      "40.05.1011",
      "PÃO DE QUEIJO CRU CONGELADO",
      "PAO DE QUEIJO CRU CONGELADO",
      "PÃO DE QUEIJO CONGELADO",
      "PAO DE QUEIJO CONGELADO",
      "PÃO DE QUEIJO CRU",
      "PAO DE QUEIJO CRU",
    ],
    categoria: "Padaria",
  },
  {
    nome: "BOLO DE BANANA E NOZES",
    palavrasChave: [
      "BOLO DE BANANA E NOZES",
      "BOLO DE BANANA E NOZES CONGELADO",
      "BUDIN DE BANANA Y NUEZ",
      "BUDIN DE BANANA Y NUEZ COCIDO CONGELADO",
      "BOLO SABOR BAUNILHA COM BANANA E NOZES",
      "WRIN-02642-042",
      "CARDA S.A.",
      "BOLO AROMATIZADO ARTIFICIALMENTE",
    ],
    categoria: "Padaria",
  },
  {
    nome: "BUDÍN DE BANANA Y NUEZ",
    palavrasChave: [
      "BUDIN DE BANANA Y NUEZ",
      "BUDIN DE BANANA Y NUEZ COCIDO CONGELADO",
      "BUDINES Y TORTAS",
      "MUFFINS BUDINES Y TORTAS",
      "BUDIN CONGELADO",
      "CARDA S.A.",
      "INDUSTRIA ARGENTINA",
    ],
    categoria: "Padaria",
  },
  {
    nome: "BOLO DE LARANJA COM GLAZE",
    palavrasChave: [
      "BOLO DE LARANJA COM GLAZE",
      "BOLO DE LARANJA COM COBERTURA",
      "BOLO DE LARANJA CONGELADO",
      "BOLO AROMATIZADO",
      "BOLO COM COBERTURA CONGELADO",
      "BOLO LARANJA GLAZE",
    ],
    categoria: "Padaria",
  },
  {
    nome: "PÃO TIPO BRIOCHE",
    palavrasChave: [
      "PÃO TIPO BRIOCHE",
      "PAO TIPO BRIOCHE",
      "PÃO PARA SANDUICHE TIPO BRIOCHE",
      "PAO PARA SANDUICHE TIPO BRIOCHE",
      "BRIOCHE CONGELADO",
      "BRIOCHE M",
    ],
    categoria: "Pães",
  },
  {
    nome: "PÃO TASTY",
    palavrasChave: [
      "PÃO TASTY",
      "PAO TASTY",
      "PÃO PARA SANDUICHE VITAMINADO COM GERGELIM",
      "PAO PARA SANDUICHE VITAMINADO COM GERGELIM",
      "TASTY CONGELADO",
      "TASTY GERGELIM",
    ],
    categoria: "Pães",
  },
  {
    nome: "PÃO ESCURO",
    palavrasChave: [
      "PÃO ESCURO",
      "PAO ESCURO",
      "PÃO ESCURO PARA SANDUICHE",
      "PAO ESCURO PARA SANDUICHE",
      "PÃO ESCURO VITAMINADO COM GERGELIM",
      "PAO ESCURO VITAMINADO COM GERGELIM",
      "ESCURO M",
    ],
    categoria: "Pães",
  },
  {
    nome: "ANÉIS DE CEBOLA CONGELADOS",
    palavrasChave: [
      "ANÉIS DE CEBOLA CONGELADOS",
      "ANEIS DE CEBOLA CONGELADOS",
      "ANÉIS DE CEBOLA EMPANADOS PRÉ FRITOS",
      "ANEIS DE CEBOLA EMPANADOS PRE FRITOS",
      "VEGGIE PICKERS",
      "ONION RINGS",
      "MCCAIN",
    ],
    categoria: "Congelados",
  },
  {
    nome: "CARNE DE MCNUGGETS",
    palavrasChave: [
      "MCNGS1CX16.9",
      "EMPANADO À BASE DE CARNE DE FRANGO GLACEADA",
      "EMPANADO A BASE DE CARNE DE FRANGO GLACEADA",
      "CARNE DE FRANGO GLACEADA",
      "SADIA",
    ],
    categoria: "Carnes",
  },
  {
    nome: "CARNE CRISPY",
    palavrasChave: [
      "MCRISPY10.125",
      "FILÉ DE PEITO DE FRANGO EMPANADO",
      "FILE DE PEITO DE FRANGO EMPANADO",
      "MCRISPY",
      "SADIA",
    ],
    categoria: "Carnes",
  },
  {
    nome: "CARNE DE JUNIOR",
    palavrasChave: [
      "MCJNRTX4.6",
      "CARNE DE FRANGO MOIDA TEMPERADA EMPANADA",
      "CARNE DE FRANGO TEMPERADA",
      "SADIA",
    ],
    categoria: "Carnes",
  },
  {
    nome: "CARNE DE MCCHICKEN",
    palavrasChave: [
      "MCMCH",
      "MC CHICKEN",
      "CARNE DE FRANGO MOIDA TEMPERADA MOLDADA",
      "CARNE DE FRANGO EMPANADA COZIDA CONGELADA",
    ],
    categoria: "Carnes",
  },
  {
    nome: "TORTA BANANA",
    palavrasChave: [
      "TORTA BANANA M",
      "TORTA DE BANANA CONGELADA",
      "TORTA BANANA CONGELADA",
      "03851-001",
      "BIMBO DO BRASIL",
      "CPQ Brasil",
    ],
    categoria: "Padaria",
  },
  {
    nome: "MOLHO DE QUEIJO TIPO CHEDDAR",
    palavrasChave: [
      "MOLHO LÁCTEO COM QUEIJO TIPO CHEDDAR",
      "MOLHO LACTEO COM QUEIJO TIPO CHEDDAR",
      "SALSA LÁCTEA CON QUESO TIPO CHEDDAR",
      "CHEDDAR",
      "MOLHO DE QUEIJO",
    ],
    categoria: "Lácteos",
  },
  {
    nome: "CAFÉ BARISTA EM GRÃO",
    palavrasChave: [
      "CAFÉ BARISTA PRIME",
      "CAFE BARISTA PRIME",
      "BRASIL ESPRESSO COMERCIO",
      "CAFÉ 1KG",
    ],
    categoria: "Alimentos",
  },
  {
    nome: "MOLHO COM QUEIJO TIPO CHEDDAR",
    palavrasChave: [
      "MOLHO COM QUEIJO TIPO CHEDDAR",
      "SALSA CON QUESO TIPO CHEDDAR",
      "11003085 CHEDDAR",
      "CHEDDAR",
    ],
    categoria: "Lácteos",
  },
  {
    nome: "CONCENTRADO LÍQUIDO DEL VALLE",
    palavrasChave: [
      "CONCENTRADO LÍQUIDO PARA BEBIDA DE FRUTA ADOÇADO",
      "CONCENTRADO LIQUIDO PARA BEBIDA DE FRUTA ADOCADO",
      "DEL VALLE",
      "UVA",
    ],
    categoria: "Bebidas",
  },
  {
    nome: "CONCENTRADO LÍQUIDO DEL VALLE",
    palavrasChave: [
      "CONCENTRADO LÍQUIDO PARA BEBIDA DE FRUTA ADOÇADO",
      "CONCENTRADO LIQUIDO PARA BEBIDA DE FRUTA ADOCADO",
      "DEL VALLE",
      "LARANJA",
    ],
    categoria: "Bebidas",
  },
  {
    nome: "CONCENTRADO LÍQUIDO DEL VALLE",
    palavrasChave: [
      "CONCENTRADO LÍQUIDO PARA BEBIDA DE FRUTA ADOÇADO",
      "CONCENTRADO LIQUIDO PARA BEBIDA DE FRUTA ADOCADO",
      "DEL VALLE",
      "MARACUJÁ",
      "MARACUJA",
    ],
    categoria: "Bebidas",
  },
  {
    nome: "TABLETE DE CHOCOLATE AO LEITE",
    palavrasChave: [
      "TABLETE DE CHOCOLATE AO LEITE",
      "CRM INDÚSTRIA E COMÉRCIO",
      "TABLETE DE CHOCOLATE",
    ],
    categoria: "Alimentos",
  },
  {
    nome: "OVO GRANDE VERMELHO",
    palavrasChave: [
      "OVO GRANDE VERMELHO CATEGORIA A",
      "OVO HAPPY EGGS GR VERM",
      "GRANDE CINTA",
    ],
    categoria: "Alimentos",
  },
  {
    nome: "MIX DE BAUNILHA",
    palavrasChave: [
      "BEBIDA LÁCTEA UHT SABOR BAUNILHA",
      "BEBIDA LACTEA UHT SABOR BAUNILHA",
      "SABOR BAUNILHA",
      "BEBIDA LÁCTEA UHT BAUNILHA",
    ],
    categoria: "Lácteos",
  },
  {
    nome: "QUEIJO EMMENTAL",
    palavrasChave: [
      "QUEIJO PROCESSADO PASTEURIZADO SABOR EMMENTAL",
      "QUESO PROCESADO PASTEURIZADO SABOR EMMENTAL",
      "EMMENTAL",
    ],
    categoria: "Lácteos",
  },
  {
    nome: "MIX DE CHOCOLATE",
    palavrasChave: [
      "BEBIDA LÁCTEA UHT SABOR CHOCOLATE",
      "BEBIDA LACTEA UHT SABOR CHOCOLATE",
      "BEBIDA LACTEA UHT CHOCOLATE",
      "SABOR CHOCOLATE",
    ],
    categoria: "Lácteos",
  },
  {
    nome: "CEBOLA FRESCA",
    palavrasChave: [
      "CEBOLA BRANCA",
      "WSI: 29218",
      "MANTER REFRIGERADO DE 1°C a 4°C",
    ],
    categoria: "Hortifruti",
  },
  {
    nome: "TIRAS DE ALFACE",
    palavrasChave: [
      "TIRAS DE ALFACE AMERICANA",
      "ALFACE AMERICANA",
      "WSI: 29218",
    ],
    categoria: "Hortifruti",
  },
  {
    nome: "CHOCOLATES M&MS",
    palavrasChave: [
      "M&MS",
      "CHOCOLATE M&MS",
      "M&M'S",
      "AMENDOIM",
      "CRISPY",
      "LACTOSE",
    ],
    categoria: "Doces",
  },
  {
    nome: "MANTEIGA COM SAL",
    palavrasChave: [
      "MANTEIGA COM SAL",
      "MANTEIGA COM SAL POTE 500G",
      "ELEGÊ",
      "ELEGE",
      "MANTEIGA EXTRA",
    ],
    categoria: "Lácteos",
  },
  {
    nome: "PETIT SUISSE",
    palavrasChave: [
      "PETIT SUISSE DO MÉQUI",
      "PETIT SUISSE DO MEQUI",
      "CX 18",
      "PETIT SUISSE",
    ],
    categoria: "Lácteos",
  },
  {
    nome: "PÃO TIPO BRIOCHE COM BATATA",
    palavrasChave: [
      "PÃO TIPO BRIOCHE COM BATATA",
      "PAO TIPO BRIOCHE COM BATATA",
      "BRIOCHE COM BATATA",
    ],
    categoria: "Pães",
  },
];

// Palavras-chave para identificação de produtos
export const palavrasChaveProduto = [
  // Pães e hambúrgueres
  "PAO",
  "PÃO",
  "QUARTERAO",
  "QUARTEIRÃO",
  "BB",
  "REGULAR",
  "BIG",
  "MAC",
  "SANDUICHE",
  "SANDUÍCHE",
  "CONGELADO",
  "HAMBURGER",
  "HAMBURGUER",
  "HAMBÚRGUER",
  "HAMBURGUERES",

  // Molhos e condimentos
  "TIRAS",
  "MOLHO",
  "COBERTURA",
  "MAIONESE",
  "MAYONESA",
  "MAIONESE",

  // Grãos e legumes
  "FEIJÃO",
  "FEIJAO",
  "PRETO",
];

// Palavras a serem ignoradas na identificação
export const palavrasIgnoradas = [
  // Informações de lote e fabricação
  "LOTE",
  "FAB",
  "FABRICAÇÃO",
  "PRODUCAO",
  "PRODUÇÃO",
  "LOTE/FAB",
  "VAL/VENC",

  // Instruções e informações adicionais
  "PREPARADO",
  "USAR",
  "CONTÉM",
  "CONSERVAR",
  "DATA",
  "PESO",
  "KG",
  "G",
  "MC",

  // Códigos e identificadores
  "PROD",
  "PCU",
  "QT",
  "PACOTE",
  "UNIDADE",
  "LIQUIDO",
  "CÓDIGO",
  "CODIGO",
  "CX",
];

// Função para encontrar produto por palavra-chave
const encontrarProdutoPorPalavraChave = (
  texto: string
): ProdutoPattern | null => {
  const textoUpperCase = texto.toUpperCase();

  for (const produto of produtosConhecidos) {
    if (
      produto.palavrasChave.some((palavra) =>
        textoUpperCase.includes(palavra.toUpperCase())
      )
    ) {
      return produto;
    }
  }
  return null;
};

// Função para adicionar novo produto
export const adicionarNovoProduto = (produto: ProdutoPattern) => {
  // Converte o nome para maiúsculas para padronização
  produto.nome = produto.nome.toUpperCase();
  // Garante que todas as palavras-chave estejam em maiúsculas
  produto.palavrasChave = produto.palavrasChave.map((palavra) =>
    palavra.toUpperCase()
  );
  produtosConhecidos.push(produto);
};

// Função auxiliar para extrair nome do produto
export const extrairProduto = (
  texto: string,
  padroes: any[]
): string | null => {
  if (!texto) return null;

  // Dividir o texto em linhas
  const linhas = texto.split("\n");

  // Procurar por produtos conhecidos
  const produtoEncontrado = encontrarProdutoPorPalavraChave(texto);
  if (produtoEncontrado) {
    return produtoEncontrado.nome;
  }

  // Para produtos Del Valle, tentar identificar qual sabor está marcado
  if (
    texto.includes("DEL VALLE") ||
    texto.includes("CONCENTRADO LÍQUIDO") ||
    texto.includes("CONCENTRADO LIQUIDO")
  ) {
    // Buscar por indicadores de marcação próximos aos sabores
    const linhasComMarcacao = linhas.filter(
      (linha) =>
        /[✓✔☑]/i.test(linha) ||
        /[\[\(\{][xX✓✔][\]\)\}]/i.test(linha) ||
        /[☐☑☒■□]/.test(linha)
    );

    // Verificar qual sabor está nas linhas marcadas
    if (linhasComMarcacao.length > 0) {
      if (
        linhasComMarcacao.some(
          (linha) => linha.includes("UVA") || linha.includes("08662-020")
        )
      ) {
        return "CONCENTRADO LÍQUIDO DEL VALLE UVA";
      } else if (
        linhasComMarcacao.some(
          (linha) => linha.includes("LARANJA") || linha.includes("00132-072")
        )
      ) {
        return "CONCENTRADO LÍQUIDO DEL VALLE LARANJA";
      } else if (
        linhasComMarcacao.some(
          (linha) =>
            linha.includes("MARACUJÁ") ||
            linha.includes("MARACUJA") ||
            linha.includes("08663-010")
        )
      ) {
        return "CONCENTRADO LÍQUIDO DEL VALLE MARACUJÁ";
      }
    }

    // Se não encontrar marcação explícita, procurar por códigos dos sabores no texto todo
    if (texto.includes("08662-020")) {
      return "CONCENTRADO LÍQUIDO DEL VALLE UVA";
    } else if (texto.includes("00132-072")) {
      return "CONCENTRADO LÍQUIDO DEL VALLE LARANJA";
    } else if (texto.includes("08663-010")) {
      return "CONCENTRADO LÍQUIDO DEL VALLE MARACUJÁ";
    }
  }

  // Procurar por palavras-chave no texto
  let melhorDescrição = "";
  let pontuaçãoMáxima = 0;

  for (const linha of linhas) {
    // Ignora linhas que contenham palavras a serem ignoradas
    if (
      /LOTE|LOT:|FAB[:\.]|FABR[:\.]|PRODUÇ[AÃ]O|INDUSTRIA|DISTRIBUIDO|FABRICADO|REGISTRO/i.test(
        linha
      )
    ) {
      continue;
    }

    // Calcula uma pontuação para a linha
    let pontuação = 0;
    if (/produto|descriç[aã]o|nome/i.test(linha)) pontuação += 3;
    if (/[\d]+(kg|g|mg|ml|l)\b/i.test(linha)) pontuação += 1;
    pontuação += linha.length / 20; // Linhas mais longas têm maior pontuação

    if (pontuação > pontuaçãoMáxima) {
      pontuaçãoMáxima = pontuação;
      melhorDescrição = linha.trim();
    }
  }

  return melhorDescrição || null;
};

// Exportação padrão
export default {
  produtosConhecidos,
  palavrasIgnoradas,
  adicionarNovoProduto,
  extrairProduto,
};
