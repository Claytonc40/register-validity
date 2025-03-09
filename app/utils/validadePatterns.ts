export const validadePatterns = [
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

  // Procura por todas as datas no texto
  for (const pattern of validadePatterns) {
    try {
      const matches = texto.matchAll(pattern);
      for (const match of Array.from(matches)) {
        let data: string | null;

        // Para padrões que capturam data de fabricação e validade
        if (match.length > 4) {
          data = normalizarData(match[4], match[5], match[6]);
        } else {
          // Para padrões simples de data
          data = normalizarData(match[1], match[2], match[3]);
        }

        if (data) {
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
      try {
        const [diaMax, mesMax, anoMax] = dataMaxima.split("/").map(Number);
        const [diaAtual, mesAtual, anoAtual] = dataAtual.split("/").map(Number);

        const dataMax = new Date(anoMax, mesMax - 1, diaMax);
        const dataAt = new Date(anoAtual, mesAtual - 1, diaAtual);

        return dataAt > dataMax ? dataAtual : dataMaxima;
      } catch (error) {
        return dataMaxima;
      }
    });
  }

  // Se encontrou apenas uma data, retorna ela
  return datas[0];
};

// Exportação padrão com todas as funções e constantes principais
export default {
  validadePatterns,
  extrairDataValidade,
};
