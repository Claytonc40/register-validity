import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";

// Modo de depuração - ative para ver logs detalhados
const DEBUG = true;

// Configurações padrão para o calendário
export interface CalendarioConfig {
  lembreteDias: number; // Lembrete em dias antes (1 = 1 dia antes)
  lembreteHoras: number; // Lembrete em horas antes (1 = 1 hora antes)
  lembreteMinutos: number; // Lembrete em minutos antes (30 = 30 min antes)
  corEvento: string; // Cor do evento no calendário (se suportado)
  mostrarAlerta: boolean; // Mostrar alerta no app ao adicionar evento
  tipoLembrete: "padrao" | "email" | "alarme"; // Tipo de lembrete
}

// Configuração padrão
const configPadrao: CalendarioConfig = {
  lembreteDias: 1,
  lembreteHoras: 0,
  lembreteMinutos: 30,
  corEvento: "", // Cor padrão do calendário
  mostrarAlerta: true,
  tipoLembrete: "padrao",
};

// Função de log para depuração
const logDebug = (message: string, data?: any) => {
  if (DEBUG) {
    if (data) {
      console.log(`[CALENDAR] ${message}`, data);
    } else {
      console.log(`[CALENDAR] ${message}`);
    }
  }
};

// Verificar se a biblioteca está disponível
const checkCalendarModule = () => {
  try {
    // Tentar importar de forma dinâmica
    logDebug("Tentando importar react-native-calendar-events...");
    const RNCalendarEvents = require("react-native-calendar-events").default;
    logDebug("Módulo importado com sucesso");
    return { RNCalendarEvents, available: true };
  } catch (error) {
    console.warn("Módulo de calendário não disponível:", error);
    logDebug("ERRO ao importar módulo", error);
    // Retornar versão simulada para não quebrar o app
    return {
      RNCalendarEvents: createMockCalendarEvents(),
      available: false,
    };
  }
};

// Criar versão simulada da API
const createMockCalendarEvents = () => ({
  requestPermissions: async () => {
    logDebug("MOCK: Solicitando permissões");
    return "authorized";
  },
  findCalendars: async () => {
    logDebug("MOCK: Buscando calendários");
    return [
      {
        id: "demo-calendar-id",
        title: "Calendário de Demonstração",
        isPrimary: true,
      },
    ];
  },
  saveEvent: async (title: string, details: any) => {
    logDebug("MOCK: Salvando evento no calendário", { title, details });
    return "demo-event-id";
  },
});

// Obter a biblioteca ou seu mock
const { RNCalendarEvents, available } = checkCalendarModule();
logDebug(`Biblioteca de calendário disponível: ${available}`);

// Verifica se o calendário está ativo
const isCalendarEnabled = async (): Promise<boolean> => {
  try {
    const habilitado = await AsyncStorage.getItem("@calendario_ativo");
    logDebug(`Status do calendário: ${habilitado}`);
    return habilitado === "true";
  } catch (error) {
    console.error("Erro ao verificar estado do calendário:", error);
    logDebug("ERRO ao verificar estado", error);
    return false;
  }
};

// Ativar ou desativar o calendário
export const toggleCalendario = async (value: boolean): Promise<boolean> => {
  try {
    logDebug(`Tentando ${value ? "ativar" : "desativar"} sincronização`);

    if (value && available) {
      // Solicitar permissões de calendário
      logDebug("Solicitando permissões...");
      const permissao = await RNCalendarEvents.requestPermissions();
      logDebug(`Permissão retornada: ${permissao}`);

      if (permissao !== "authorized") {
        logDebug("Permissão negada!");
        Alert.alert(
          "Permissão Necessária",
          "O app precisa de permissão para acessar seu calendário. Por favor, habilite nas configurações do dispositivo."
        );
        return false;
      }
    }

    // Salvar estado
    await AsyncStorage.setItem("@calendario_ativo", value.toString());
    logDebug(
      `Sincronização com calendário ${value ? "ativada" : "desativada"}`
    );

    // Teste de salvamento de evento
    if (value && available) {
      logDebug("Testando salvamento de evento...");
      try {
        // Testar salvamento de evento
        await testarCalendario();
      } catch (testError) {
        logDebug("Erro no teste de salvamento", testError);
        // Não impedimos a ativação por causa do teste
      }
    }

    return true;
  } catch (error) {
    console.error("Erro ao configurar acesso ao calendário:", error);
    logDebug("ERRO ao configurar acesso", error);
    return false;
  }
};

// Função para testar o calendário
const testarCalendario = async (): Promise<boolean> => {
  try {
    logDebug("Iniciando teste de calendário");

    // Buscar calendários
    const calendarios = await RNCalendarEvents.findCalendars();
    logDebug(`Calendários encontrados: ${calendarios.length}`, calendarios);

    const defaultCalendar =
      calendarios.find(
        (cal: any) => cal.isPrimary || cal.allowsModifications
      ) || calendarios[0];

    if (!defaultCalendar) {
      logDebug("Nenhum calendário disponível para gravação");
      return false;
    }

    logDebug("Calendário selecionado:", defaultCalendar);

    // Data atual + 1 dia
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 1);

    // Data fim (final do dia)
    const endDate = new Date(testDate);
    endDate.setHours(23, 59, 59);

    // Salvar evento de teste
    const eventoId = await RNCalendarEvents.saveEvent(
      "Teste de Sincronização",
      {
        calendarId: defaultCalendar.id,
        startDate: testDate.toISOString(),
        endDate: endDate.toISOString(),
        allDay: true,
        description: "Evento de teste do aplicativo Expirai",
        notes: "Pode excluir este evento",
      }
    );

    logDebug("Evento de teste salvo com sucesso, ID:", eventoId);

    // Remover evento de teste
    // await RNCalendarEvents.removeEvent(eventoId);
    // logDebug("Evento de teste removido");

    return true;
  } catch (error) {
    console.error("Erro no teste de calendário:", error);
    logDebug("ERRO no teste de calendário", error);
    return false;
  }
};

// Buscar configurações atuais do calendário
export const buscarConfigCalendario = async (): Promise<CalendarioConfig> => {
  try {
    const configString = await AsyncStorage.getItem("@calendario_config");
    if (!configString) return configPadrao;

    const config = JSON.parse(configString);
    logDebug("Configurações do calendário carregadas", config);

    // Garantir que todas as propriedades existam
    return { ...configPadrao, ...config };
  } catch (error) {
    logDebug("Erro ao buscar configurações do calendário", error);
    return configPadrao;
  }
};

// Salvar configurações do calendário
export const salvarConfigCalendario = async (
  config: Partial<CalendarioConfig>
): Promise<boolean> => {
  try {
    // Buscar configurações atuais e mesclar com as novas
    const configAtual = await buscarConfigCalendario();
    const novaConfig = { ...configAtual, ...config };

    // Salvar configurações
    await AsyncStorage.setItem(
      "@calendario_config",
      JSON.stringify(novaConfig)
    );
    logDebug("Configurações do calendário salvas", novaConfig);
    return true;
  } catch (error) {
    logDebug("Erro ao salvar configurações do calendário", error);
    return false;
  }
};

// Adicionar evento ao calendário local
export const adicionarEventoAoCalendario = async (
  produto: { nome: string; validade: string },
  mostrarAlerta?: boolean
): Promise<boolean> => {
  logDebug("Tentando adicionar evento ao calendário", produto);

  try {
    // Carregar configurações
    const config = await buscarConfigCalendario();

    // Usar valor de mostrarAlerta se fornecido, caso contrário usar da configuração
    const exibirAlerta =
      mostrarAlerta !== undefined ? mostrarAlerta : config.mostrarAlerta;

    // Verificar se o calendário está ativo
    const calendarioAtivo = await isCalendarEnabled();
    logDebug(
      `Calendário ativo: ${calendarioAtivo}, Biblioteca disponível: ${available}`
    );

    if (!calendarioAtivo || !available) {
      logDebug("Calendário não ativo ou biblioteca não disponível");
      return false;
    }

    // Verificar permissões novamente por segurança
    logDebug("Verificando permissões novamente...");
    const permissao = await RNCalendarEvents.requestPermissions();
    logDebug(`Permissão: ${permissao}`);

    if (permissao !== "authorized") {
      logDebug("Permissão negada ao adicionar evento");
      return false;
    }

    // Formatar data com tratamento de erro robusto
    let dataValidade: Date;
    try {
      // Tentar converter diretamente
      dataValidade = new Date(produto.validade);
      logDebug(`Data inicial convertida: ${dataValidade.toISOString()}`);

      // Verificar se é uma data válida
      if (isNaN(dataValidade.getTime())) {
        throw new Error("Data inválida");
      }
    } catch (dateError) {
      logDebug("Erro ao converter data, tentando outro formato", dateError);

      try {
        // Tentar formato DD/MM/YYYY
        const partes = produto.validade.split("/");
        if (partes.length === 3) {
          const dia = parseInt(partes[0]);
          const mes = parseInt(partes[1]) - 1; // Mês em JS é 0-indexed
          const ano = parseInt(partes[2]);

          // Validar valores
          if (
            dia < 1 ||
            dia > 31 ||
            mes < 0 ||
            mes > 11 ||
            ano < 1900 ||
            ano > 2100
          ) {
            throw new Error("Valores de data fora dos limites");
          }

          dataValidade = new Date(ano, mes, dia);
          logDebug(`Data alternativa: ${dataValidade.toISOString()}`);

          // Verificar se a conversão foi válida
          if (isNaN(dataValidade.getTime())) {
            throw new Error("Data convertida inválida");
          }
        } else {
          throw new Error("Formato de data não reconhecido");
        }
      } catch (err) {
        logDebug(
          "Falha na conversão da data em todos os formatos",
          produto.validade
        );
        return false;
      }
    }

    // Adicionar ao calendário nativo
    logDebug("Buscando calendários disponíveis...");
    const calendarios = await RNCalendarEvents.findCalendars();
    logDebug(`Calendários encontrados: ${calendarios.length}`);

    // Encontrar um calendário que permite gravação
    const defaultCalendar =
      calendarios.find(
        (cal: any) =>
          (cal.isPrimary || cal.allowsModifications) && !cal.isReadOnly
      ) || calendarios[0];

    if (!defaultCalendar) {
      logDebug("Nenhum calendário disponível para gravação");
      return false;
    }

    logDebug("Usando calendário:", defaultCalendar);

    // Configurar data final (fim do dia)
    const dataFim = new Date(dataValidade);
    dataFim.setHours(23, 59, 59);

    // Criar nome do evento
    const tituloEvento = `Vencimento: ${produto.nome}`;

    // Configuração específica por plataforma
    const eventConfig: any = {
      calendarId: defaultCalendar.id,
      startDate: dataValidade.toISOString(),
      endDate: dataFim.toISOString(),
      allDay: true,
      description: `O produto ${produto.nome} vence nesta data.`,
      notes: "Adicionado pelo app ExpireAi",
    };

    // Adicionar cor se configurada
    if (config.corEvento) {
      eventConfig.color = config.corEvento;
    }

    // Configurar alarmes baseados nas configurações
    if (Platform.OS !== "web") {
      const alarmes = [];

      // Adicionar lembrete em dias (se > 0)
      if (config.lembreteDias > 0) {
        alarmes.push({ date: -config.lembreteDias * 24 * 60 }); // Converter para minutos
      }

      // Adicionar lembrete em horas (se > 0)
      if (config.lembreteHoras > 0) {
        alarmes.push({ date: -config.lembreteHoras * 60 }); // Converter para minutos
      }

      // Adicionar lembrete em minutos (se > 0)
      if (config.lembreteMinutos > 0) {
        alarmes.push({ date: -config.lembreteMinutos });
      }

      // Se nenhum alarme configurado, usar padrão
      if (alarmes.length === 0) {
        alarmes.push({ date: -1440 }); // 1 dia antes
      }

      // Configurar tipo de lembrete se suportado
      if (Platform.OS === "ios" && config.tipoLembrete !== "padrao") {
        // No iOS podemos especificar o tipo de alarme
        alarmes.forEach((alarme) => {
          if (config.tipoLembrete === "email") {
            (alarme as any).method = "email";
          } else if (config.tipoLembrete === "alarme") {
            (alarme as any).method = "alert";
          }
        });
      }

      eventConfig.alarms = alarmes;
    }

    logDebug("Configuração do evento:", eventConfig);

    // Salvar evento
    try {
      const eventId = await RNCalendarEvents.saveEvent(
        tituloEvento,
        eventConfig
      );
      logDebug("Evento adicionado ao calendário com ID:", eventId);

      // Só mostrar alerta se configurado
      if (exibirAlerta) {
        Alert.alert(
          "Evento Adicionado",
          `"${produto.nome}" foi adicionado ao seu calendário em ${dataValidade.toLocaleDateString()}`,
          [{ text: "OK" }],
          { cancelable: true }
        );
      }

      return true;
    } catch (saveError) {
      logDebug("ERRO ao salvar evento", saveError);
      return false;
    }
  } catch (error) {
    console.error("Erro ao adicionar evento ao calendário:", error);
    logDebug("ERRO CRÍTICO na adição de evento", error);
    return false;
  }
};

// Verificar status do calendário
export const verificarStatusCalendario = async (): Promise<boolean> => {
  const status = await isCalendarEnabled();
  logDebug(`Verificação de status: ${status}`);
  return status;
};

// Sincronizar todos os produtos existentes
export const sincronizarProdutosExistentes = async (
  produtos: Array<{ id: string; nome: string; validade: string }>
): Promise<number> => {
  try {
    logDebug("Iniciando sincronização de produtos existentes...", {
      count: produtos.length,
    });

    // Verificar se o calendário está ativo
    const calendarioAtivo = await isCalendarEnabled();
    if (!calendarioAtivo || !available) {
      logDebug("Calendário não está ativo ou biblioteca não disponível");
      return 0;
    }

    // Para controlar quantos produtos foram sincronizados com sucesso
    let produtosSincronizados = 0;

    // Obter eventos existentes para evitar duplicação
    const eventosExistentes = await buscarEventosExistentes();
    logDebug(
      `Encontrados ${eventosExistentes.length} eventos existentes no calendário`
    );

    // Tentar sincronizar cada produto
    for (const produto of produtos) {
      try {
        logDebug(
          `Tentando sincronizar produto: ${produto.nome} (validade: ${produto.validade})`
        );

        // Pular produtos sem data de validade válida
        if (!produto.validade) {
          logDebug(`Produto ${produto.nome} não tem data de validade`);
          continue;
        }

        // Verificar se já existe evento para este produto
        const eventoJaExiste = verificarEventoExistente(
          produto,
          eventosExistentes
        );

        if (eventoJaExiste) {
          logDebug(`Produto ${produto.nome} já possui evento no calendário`);
          continue;
        }

        // Adicionar ao calendário
        const sucesso = await adicionarEventoAoCalendario(produto, false); // false = não mostrar alerta

        if (sucesso) {
          produtosSincronizados++;
          logDebug(`Produto ${produto.nome} sincronizado com sucesso`);
        }
      } catch (produtoError) {
        // Continuar com o próximo produto mesmo se este falhar
        logDebug(`Erro ao sincronizar produto ${produto.nome}`, produtoError);
      }
    }

    logDebug(
      `Sincronização concluída. ${produtosSincronizados} produtos adicionados ao calendário`
    );
    return produtosSincronizados;
  } catch (error) {
    console.error("Erro ao sincronizar produtos existentes:", error);
    logDebug("ERRO na sincronização de produtos existentes", error);
    return 0;
  }
};

// Buscar eventos existentes no calendário
const buscarEventosExistentes = async (): Promise<any[]> => {
  try {
    if (!available) return [];

    // Buscar eventos dos próximos 365 dias
    const inicio = new Date();
    const fim = new Date();
    fim.setDate(fim.getDate() + 365);

    logDebug("Buscando eventos existentes no calendário");

    // Buscar eventos no intervalo
    const eventos = await RNCalendarEvents.fetchAllEvents(
      inicio.toISOString(),
      fim.toISOString()
    );

    // Filtrar apenas eventos que começam com "Vencimento:"
    return eventos.filter(
      (evento: any) => evento.title && evento.title.startsWith("Vencimento:")
    );
  } catch (error) {
    logDebug("Erro ao buscar eventos existentes", error);
    return [];
  }
};

// Verificar se já existe evento para um produto
const verificarEventoExistente = (
  produto: { nome: string; validade: string },
  eventosExistentes: any[]
): boolean => {
  // Título esperado
  const tituloEsperado = `Vencimento: ${produto.nome}`;

  // Normalizar a data de validade com tratamento de erro
  let dataFormatada: string;
  try {
    const dataValidade = new Date(produto.validade);

    // Verificar se a data é válida
    if (isNaN(dataValidade.getTime())) {
      throw new Error("Data inválida");
    }

    // Formato para comparação: YYYY-MM-DD
    dataFormatada = dataValidade.toISOString().split("T")[0];
  } catch (e) {
    // Tentar outros formatos de data
    try {
      // Tentar formato DD/MM/YYYY
      const partes = produto.validade.split("/");
      if (partes.length === 3) {
        const dia = parseInt(partes[0]);
        const mes = parseInt(partes[1]) - 1; // Mês em JS é 0-indexed
        const ano = parseInt(partes[2]);

        // Validar valores
        if (
          dia < 1 ||
          dia > 31 ||
          mes < 0 ||
          mes > 11 ||
          ano < 1900 ||
          ano > 2100
        ) {
          logDebug("Valores de data fora dos limites aceitáveis", {
            dia,
            mes,
            ano,
          });
          return false; // Data inválida
        }

        const data = new Date(ano, mes, dia);

        // Verificar se a conversão foi válida
        if (isNaN(data.getTime())) {
          logDebug("Data convertida inválida");
          return false;
        }

        dataFormatada = `${ano}-${(mes + 1).toString().padStart(2, "0")}-${dia.toString().padStart(2, "0")}`;
      } else {
        logDebug("Formato de data não reconhecido", produto.validade);
        return false;
      }
    } catch (err) {
      logDebug("Erro ao processar data de validade", err);
      return false;
    }
  }

  // Verificar se existe evento com mesmo título e data aproximada
  return eventosExistentes.some((evento: any) => {
    try {
      const eventoData = new Date(evento.startDate).toISOString().split("T")[0];
      return evento.title === tituloEsperado && eventoData === dataFormatada;
    } catch (err) {
      logDebug("Erro ao comparar data do evento", err);
      return false;
    }
  });
};

// Exportar um default para evitar warning do react-native
export default {
  toggleCalendario,
  adicionarEventoAoCalendario,
  verificarStatusCalendario,
  sincronizarProdutosExistentes,
  buscarConfigCalendario,
  salvarConfigCalendario,
};
