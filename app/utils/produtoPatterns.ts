// Tipos de produtos
export interface ProdutoPattern {
  nome: string;
  palavrasChave: string[];
  categoria: string;
}

// Lista de produtos conhecidos
export const produtosConhecidos: ProdutoPattern[] = [
  {
    nome: "BB PÃO REGULAR",
    palavrasChave: [
      "BB PAO REGULAR",
      "BB PÃO REGULAR",
      "PAO REGULAR",
      "PÃO REGULAR",
    ],
    categoria: "Pães",
  },
  {
    nome: "BB PÃO QUARTERÃO",
    palavrasChave: [
      "BB PAO QUARTERAO",
      "BB PÃO QUARTERÃO",
      "PAO QUARTERAO",
      "PÃO QUARTERÃO",
    ],
    categoria: "Pães",
  },
  {
    nome: "BB PÃO BIG MAC",
    palavrasChave: [
      "BB PAO BIG MAC",
      "BB PÃO BIG MAC",
      "PAO BIG MAC",
      "PÃO BIG MAC",
    ],
    categoria: "Pães",
  },
  {
    nome: "BB PÃO SANDUÍCHE",
    palavrasChave: [
      "BB PAO SANDUICHE",
      "BB PÃO SANDUÍCHE",
      "PAO SANDUICHE",
      "PÃO SANDUÍCHE",
      "PAO PARA SANDUICHE",
      "PÃO PARA SANDUÍCHE",
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
      "CHOCOLATE",
      "COBERTURA",
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

  // Molhos e condimentos
  "TIRAS",
  "MOLHO",
  "COBERTURA",
  "MAIONESE",
  "MAYONESA",

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
  const linhas = texto.split("\n");

  // Procura em cada linha do texto
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];

    // Tenta encontrar um produto conhecido
    const produtoEncontrado = encontrarProdutoPorPalavraChave(linha);
    if (produtoEncontrado) {
      // Retorna sempre o nome padronizado do produto
      return produtoEncontrado.nome;
    }
  }

  // Se não encontrou nos produtos conhecidos, procura por linhas que podem ser nomes de produtos
  for (const linha of linhas) {
    const linhaUpperCase = linha.toUpperCase();

    // Se a linha está em maiúsculas, não contém números e não tem palavras ignoradas
    if (
      linha === linhaUpperCase &&
      !linha.match(/\d/) &&
      linha.length > 3 &&
      !palavrasIgnoradas.some((p) => linhaUpperCase.includes(p))
    ) {
      return linha.trim();
    }
  }

  return null;
};

// Exportação padrão
export default {
  produtosConhecidos,
  palavrasIgnoradas,
  adicionarNovoProduto,
  extrairProduto,
};
