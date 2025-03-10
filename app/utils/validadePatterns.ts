export const validadePatterns = [
  // Padrões específicos para validade
  /Data\s+de\s+Validade:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,
  /Validade:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,
  /Val\.?:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,
  /Venc\.?:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,

  // Padrões específicos para excluir datas de produção
  /(?<!Produção[\s:]+)(?<!Fabricação[\s:]+)(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,

  // Padrão específico para VAL./VENC.
  /VAL\.?\/VENC\.?:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,
  /VALNENC\.?:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,

  // Padrões com rótulos completos
  /Data\s+de\s+[Vv]alidade:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /Data\s+de\s+[Vv]akidade:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /Data\s+de\s+[Vv]enc\.?:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /[Vv]álido\s+até:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /[Vv]alido\s+ate:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /[Vv]encimento:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /Data\s+de\s+[Ee]xpiração:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,

  // Padrões com abreviações
  /VAL:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,
  /VAL:?\s*(\d{2})[\/-]([A-Za-z]{3})[\/-](\d{2,4})/gi,
  /VENC:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,
  /VENC:?\s*(\d{2})[\/-]([A-Za-z]{3})[\/-](\d{2,4})/gi,

  // Padrões específicos para Val/Venc com variações de OCR
  /[Vv]al[\/-][Vv][eE][nN][cC]\.?:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,
  /[Vv]al[\/-][Vv][eE][mM][cC]\.?:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,
  /[Vv]al[\/-][Nn][eE][nN][cC]\.?:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,

  // Outros padrões de validade
  /[Vv]al\.\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /[Vv]enc\.\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /[Ee]xp\.\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,

  // Padrões com "Consumir" ou "Melhor antes"
  /[Cc]onsumir\s+até:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /[Mm]elhor\s+antes\s+de:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /[Cc]onsumir\s+preferencialmente\s+até:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /[Mm]elhor\s+consumir\s+antes\s+de:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /[Cc]onsumir\s+antes\s+de:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /[Mm]elhor\s+consumir\s+até:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /[Uu]sar\s+até:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,

  // Padrões com "Expiração"
  /[Ee]xpira\s+em:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /[Ee]xpira:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /[Ee]xpiração:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/g,

  // Padrões internacionais
  /EXP:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,
  /BEST\s+BEFORE:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,
  /BBE:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,

  // Padrões específicos (GS1-128, ISO)
  /\(17\)(\d{2})(\d{2})(\d{2})/,
  /(\d{4})-(\d{2})-(\d{2})/, // ISO 8601

  // Padrões de data sem rótulo
  /(\d{2})[\/-](\d{2})[\/-](\d{4})/g,
  /(\d{2})[\/-]([A-Za-z]{3})[\/-](\d{2,4})/g,
  /(\d{2})[\/-](\d{2})[\/-](\d{2})/g,
  /(\d{2})\s+de\s+([A-Za-z]+)\s+de\s+(\d{4})/gi,

  // Padrões com fabricação e validade
  /Lote\/Fab\.?:?\s*\d{2}[\/-]\d{2}[\/-]\d{4}\s*Val\/Venc\.?:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,
  /FAB:?\s*\d{2}[\/-]\d{2}[\/-]\d{4}\s*VAL:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,
  /FABR?:?\s*\d{2}[\/-]\d{2}[\/-]\d{4}\s*VENC:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,

  // Padrões com hora
  /VAL:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})\s*(\d{2}):(\d{2})/gi,
  /VENC:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})\s*(\d{2}):(\d{2})/gi,

  // Padrões para capturar datas com JANI e variações de OCR
  /LOTE\/FAB:?(\d{2})\/([A-Za-z]{4})(\d{1}[A-Za-z0-9]{1})\s*VAL:?(\d{2})\/([A-Za-z]{4})(\d{1}[A-Za-z0-9]{1})/gi,
  /FAB:?(\d{2})\/([A-Za-z]{4})(\d{1}[A-Za-z0-9]{1})\s*VAL:?(\d{2})\/([A-Za-z]{4})(\d{1}[A-Za-z0-9]{1})/gi,
  /(\d{2})\/([A-Za-z]{4})(\d{1}[A-Za-z0-9]{1})/gi,

  // Padrões específicos para validade com variações de OCR
  /Data\s+de\s+[Vv]a[il]?dade:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/gi,

  // Padrão específico para "Val: DD/MM/YY" (formato usado nos produtos McCain)
  /[Vv]al:?\s*(\d{1,2})[\/-](\d{1,2})[\/-](\d{2})/gi,

  // Padrões específicos para produtos Sadia com "VÁLIDO ATÉ"
  /[Vv][aá]lido\s+at[eé]:?\s*(\d{1,2})[\.\/\-](\d{1,2})[\.\/\-](\d{2,4})/gi,

  // Padrões específicos para "VENC: DD MM YY" (sem separadores)
  /[Vv][Ee][Nn][Cc]:?\s*(\d{1,2})\s+(\d{1,2})\s+(\d{2})/gi,

  // Padrões para datas com meses escritos por extenso em maiúsculas (DEZ, JUN)
  /[Vv][Aa][Ll]:?\s*(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{2,4})/gi,
  /[Ff][Aa][Bb]:?\s*(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{2,4})/gi,

  // Padrão para capturar datas em formato VAL sem espaço (VAL16/07/2025)
  /VAL(\d{1,2})[\.\/\-](\d{1,2})[\.\/\-](\d{2,4})/gi,

  // Padrões para capturar datas de validade específicas para temperaturas
  /Validade\s+em\s+temperatura\s+ambiente:?\s*(\d{1,2})[\.\/\-](\d{1,2})[\.\/\-](\d{2,4})/gi,
  /Validade\s+resfriado\s+\([^)]+\):?\s*(\d{1,2})[\.\/\-](\d{1,2})[\.\/\-](\d{2,4})/gi,

  // Padrões para o formato "Data de Validade" sem dois pontos (encontrado na etiqueta de Bebida Láctea)
  /Data\s+de\s+Validade\s*(\d{1,2})[\.\/\-](\d{1,2})[\.\/\-](\d{2,4})/gi,

  // Padrões para capturar datas de produtos Mars e M&Ms
  /[Vv]:(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{2})/gi,
  /[Vv]:(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{2})\s+\d{2}:\d{2}/gi,
  /[Uu]:(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{2})/gi,

  // Padrão para DATA DE VENCIMENTO formatado (com as palavras separadas)
  /DATA\s+DE\s+VENCIMENTO:?\s*(\d{1,2})[\.\/\-](\d{1,2})[\.\/\-](\d{2,4})/gi,

  // Padrão para capturar datas em etiquetas invertidas (texto de cabeça para baixo)
  /[Vv]a[l1][i1]dade:?\s*(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{2,4})/gi,
  /[Dd]ata\s+de\s+[Vv]a[l1][i1]dade\s*(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{2,4})/gi,

  // Padrão para formato com pontos em vez de barras (xx.xx.xxxx)
  /DATA\s+DE\s+VALIDADE\s*(\d{1,2})\.(\d{1,2})\.(\d{2,4})/gi,
];

// Mapeamento de meses em texto para números
const mesesMap: { [key: string]: string } = {
  JAN: "01",
  FEV: "02",
  FEB: "02",
  MAR: "03",
  ABR: "04",
  APR: "04",
  MAI: "05",
  MAY: "05",
  JUN: "06",
  JUL: "07",
  AGO: "08",
  AUG: "08",
  SET: "09",
  SEP: "09",
  OUT: "10",
  OCT: "10",
  NOV: "11",
  DEZ: "12",
  DEC: "12",
  JANEIRO: "01",
  FEVEREIRO: "02",
  MARCO: "03",
  MARÇO: "03",
  ABRIL: "04",
  MAIO: "05",
  JUNHO: "06",
  JULHO: "07",
  AGOSTO: "08",
  SETEMBRO: "09",
  OUTUBRO: "10",
  NOVEMBRO: "11",
  DEZEMBRO: "12",
  JANI: "01",
  FEVE: "02",
  MARC: "03",
  ABRI: "04",
  JUNH: "06",
  JULH: "07",
  AGOS: "08",
  SETE: "09",
  OUTU: "10",
  NOVE: "11",
  DEZE: "12",
};

// Função para normalizar uma data para o formato DD/MM/YYYY
const normalizarData = (
  dia: string,
  mes: string,
  ano: string
): string | null => {
  // Verifica se todos os parâmetros existem
  if (!dia || !mes || !ano) {
    return null;
  }

  try {
    // Se o mês está em texto, converte para número
    if (isNaN(Number(mes))) {
      // Remove acentos e converte para maiúsculas
      const mesNormalizado = mes
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
      mes = mesesMap[mesNormalizado] || mes;
    }

    // Corrige o problema do OCR que confunde '6' com 'S'
    if (ano.toUpperCase().endsWith("S")) {
      ano = ano.slice(0, -1) + "6";
    }

    // Garante que o ano tenha 4 dígitos
    if (ano.length === 2) {
      ano = "20" + ano;
    }

    // Garante que dia e mês tenham 2 dígitos
    dia = dia.toString().padStart(2, "0");
    mes = mes.toString().padStart(2, "0");

    // Valida se a data é válida
    const data = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    if (isNaN(data.getTime())) {
      return null;
    }

    return `${dia}/${mes}/${ano}`;
  } catch (error) {
    return null;
  }
};

// Função auxiliar para extrair e formatar a data
export const extrairDataValidade = (texto: string): string | null => {
  if (!texto) return null;

  const datas: string[] = [];
  const datasProducao: Set<string> = new Set();

  // Primeiro identifica datas de produção para excluí-las
  const padraoProducao =
    /(?:Produção|Fabricação|Prod|Fab)[\s:]+(\d{2})[\/-](\d{2})[\/-](\d{4})/gi;
  let match;
  while ((match = padraoProducao.exec(texto)) !== null) {
    const dataProducao = `${match[1]}/${match[2]}/${match[3]}`;
    datasProducao.add(dataProducao);
  }

  // Procura por todas as datas no texto
  for (const pattern of validadePatterns) {
    try {
      const matches = texto.matchAll(pattern);
      for (const match of Array.from(matches)) {
        const data = normalizarData(match[1], match[2], match[3]);
        if (data && !datasProducao.has(data)) {
          datas.push(data);
        }
      }
    } catch (error) {
      continue;
    }
  }

  if (datas.length === 0) {
    return null;
  }

  // Se encontrou mais de uma data, retorna a mais distante (futura)
  if (datas.length > 1) {
    return datas.reduce((dataMaxima, dataAtual) => {
      const [diaMax, mesMax, anoMax] = dataMaxima.split("/").map(Number);
      const [diaAtual, mesAtual, anoAtual] = dataAtual.split("/").map(Number);

      const dataMax = new Date(anoMax, mesMax - 1, diaMax);
      const dataAt = new Date(anoAtual, mesAtual - 1, diaAtual);

      return dataAt > dataMax ? dataAtual : dataMaxima;
    });
  }

  return datas[0];
};

// Exportação padrão com todas as funções e constantes principais
export default {
  validadePatterns,
  extrairDataValidade,
};
