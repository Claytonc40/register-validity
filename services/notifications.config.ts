import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

// Configuração para como as notificações devem ser manipuladas quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

// Adiciona listener para notificações recebidas
Notifications.addNotificationReceivedListener((notification) => {
  console.log("Notificação recebida:", notification);
  // Se for uma notificação de verificação diária, reagenda as notificações
  if (notification.request.content.title === "Verificação Automática") {
    agendarNotificacoesDiarias([]).catch(console.error);
  }
});

// Configurar notificações na inicialização do app
export const configurarNotificacoes = async () => {
  // Verifica se as notificações estão ativas
  const notificacoesAtivas = await AsyncStorage.getItem("@notificacoes_ativas");
  if (notificacoesAtivas === "false") {
    console.log("Notificações desativadas pelo usuário");
    return;
  }

  // Cancela notificações existentes e reagenda novas com base nas configurações atuais
  const produtos = await carregarProdutos();
  if (produtos && produtos.length > 0) {
    await agendarNotificacoesDiarias(produtos);
  }
};

// Carregar produtos do AsyncStorage
const carregarProdutos = async () => {
  try {
    const produtosJSON = await AsyncStorage.getItem("@produtos");
    if (produtosJSON) {
      return JSON.parse(produtosJSON);
    }
    return [];
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    return [];
  }
};

// Obter horário configurado para notificações
const getHorarioNotificacao = async (): Promise<Date> => {
  try {
    const horarioSalvo = await AsyncStorage.getItem("@horario_notificacao");
    if (horarioSalvo) {
      const timestamp = Number(horarioSalvo);
      const data = new Date(timestamp);
      return data;
    }
    // Horário padrão: 7h da manhã
    const horarioPadrao = new Date();
    horarioPadrao.setHours(7, 0, 0, 0);
    return horarioPadrao;
  } catch (error) {
    console.error("Erro ao obter horário de notificação:", error);
    const horarioPadrao = new Date();
    horarioPadrao.setHours(7, 0, 0, 0);
    return horarioPadrao;
  }
};

// Obter dias de antecedência configurados
const getDiasAntecedencia = async (): Promise<number> => {
  try {
    const diasSalvos = await AsyncStorage.getItem("@dias_antecedencia");
    if (diasSalvos) {
      return Number(diasSalvos);
    }
    return 1; // Padrão: 1 dia antes
  } catch (error) {
    console.error("Erro ao obter dias de antecedência:", error);
    return 1;
  }
};

// Função para converter string de data para objeto Date
const converterDataValidade = (dataString: string): Date => {
  try {
    // Verifica se a data está no formato DD/MM/YYYY
    if (dataString.includes("/")) {
      const partes = dataString.split("/");
      if (partes.length === 3) {
        const [dia, mes, ano] = partes.map(Number);
        // Ajuste para mês (0-11 em JavaScript)
        return new Date(ano, mes - 1, dia, 0, 0, 0, 0);
      }
    }

    // Tenta converter como ISO date (YYYY-MM-DD)
    if (dataString.includes("-")) {
      const data = new Date(dataString);
      if (!isNaN(data.getTime())) {
        return data;
      }
    }

    // Tenta converter como timestamp
    const timestamp = Number(dataString);
    if (!isNaN(timestamp)) {
      return new Date(timestamp);
    }

    // Última tentativa: converter normalmente
    const data = new Date(dataString);
    if (!isNaN(data.getTime())) {
      return data;
    }

    console.error(`Formato de data não reconhecido: ${dataString}`);
    // Retorna data atual para evitar erros fatais
    return new Date();
  } catch (error) {
    console.error(`Erro ao converter data "${dataString}":`, error);
    // Retorna data atual para evitar erros fatais
    return new Date();
  }
};

// Função para comparar apenas as datas (ignorando horas)
const mesmaData = (data1: Date, data2: Date) => {
  try {
    // Verifica se as datas são válidas
    if (!data1 || !data2 || isNaN(data1.getTime()) || isNaN(data2.getTime())) {
      console.warn("Comparação de data inválida");
      return false;
    }

    return (
      data1.getDate() === data2.getDate() &&
      data1.getMonth() === data2.getMonth() &&
      data1.getFullYear() === data2.getFullYear()
    );
  } catch (error) {
    console.error("Erro ao comparar datas:", error);
    return false;
  }
};

// Agendar notificações diárias com base nos produtos que estão próximos do vencimento
export const agendarNotificacoesDiarias = async (produtos: any[]) => {
  try {
    // Verifica se as notificações estão ativas
    const notificacoesAtivas = await AsyncStorage.getItem(
      "@notificacoes_ativas"
    );
    if (notificacoesAtivas === "false") {
      console.log("Notificações desativadas pelo usuário");
      return;
    }

    // Cancela todas as notificações existentes
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Obtém configurações
    const horarioNotificacao = await getHorarioNotificacao();
    const diasAntecedencia = await getDiasAntecedencia();
    const avisarNoDia = await AsyncStorage.getItem("@avisar_no_dia");
    const deveAvisarNoDia = avisarNoDia !== "false";

    // Configura as datas
    const agora = new Date();
    const hoje = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate()
    );

    // Filtra produtos por categoria de vencimento
    const produtosVencemHoje = produtos.filter((produto) => {
      if (!produto.validade) {
        return false;
      }

      try {
        const dataValidade = converterDataValidade(produto.validade);
        if (isNaN(dataValidade.getTime())) {
          return false;
        }
        return mesmaData(dataValidade, hoje);
      } catch (error) {
        console.error(`Erro ao verificar produto ${produto.nome}:`, error);
        return false;
      }
    });

    const produtosProximosVencimento = produtos.filter((produto) => {
      if (!produto.validade) {
        return false;
      }

      try {
        const dataValidade = converterDataValidade(produto.validade);
        if (isNaN(dataValidade.getTime())) {
          return false;
        }

        const diasAteVencimento = Math.ceil(
          (dataValidade.getTime() - hoje.getTime()) / (1000 * 3600 * 24)
        );

        return diasAteVencimento <= diasAntecedencia && diasAteVencimento > 0;
      } catch (error) {
        console.error(`Erro ao verificar produto ${produto.nome}:`, error);
        return false;
      }
    });

    // Configura a notificação
    const horaConfig = horarioNotificacao.getHours();
    const minutoConfig = horarioNotificacao.getMinutes();

    // Agenda notificações para produtos que vencem hoje
    if (deveAvisarNoDia && produtosVencemHoje.length > 0) {
      let mensagem;
      if (produtosVencemHoje.length === 1) {
        mensagem = `ATENÇÃO: O produto ${produtosVencemHoje[0].nome} vence HOJE!`;
      } else {
        const listaProdutos = produtosVencemHoje
          .map((produto) => produto.nome)
          .join(", ");
        mensagem = `ATENÇÃO: ${produtosVencemHoje.length} produtos vencem HOJE: ${listaProdutos}`;
      }

      try {
        // Configura data para o próximo horário de notificação
        const dataNotificacao = new Date();
        dataNotificacao.setHours(horaConfig, minutoConfig, 0, 0);

        // Se o horário já passou hoje, agenda para amanhã
        if (new Date() > dataNotificacao) {
          dataNotificacao.setDate(dataNotificacao.getDate() + 1);
        }

        // Agenda a notificação
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Produtos Vencendo Hoje!",
            body: mensagem,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: dataNotificacao,
          },
        });
      } catch (e) {
        console.error("Erro ao agendar notificação de hoje:", e);
      }
    }

    // Agenda notificações para produtos próximos do vencimento
    if (produtosProximosVencimento.length > 0) {
      let mensagem;
      if (produtosProximosVencimento.length === 1) {
        // Usar a função converterDataValidade para garantir que a data seja interpretada corretamente
        const dataValidade = converterDataValidade(
          produtosProximosVencimento[0].validade
        );
        const diasRestantes = Math.ceil(
          (dataValidade.getTime() - hoje.getTime()) / (1000 * 3600 * 24)
        );
        const textoDia = diasRestantes === 1 ? "dia" : "dias";
        mensagem = `AVISO: O produto ${produtosProximosVencimento[0].nome} vence em ${diasRestantes} ${textoDia}!`;
      } else {
        // Criar lista de produtos com os dias restantes corretamente calculados
        const listaProdutos = produtosProximosVencimento
          .map((produto) => {
            const dataValidade = converterDataValidade(produto.validade);
            const diasRestantes = Math.ceil(
              (dataValidade.getTime() - hoje.getTime()) / (1000 * 3600 * 24)
            );
            const textoDia = diasRestantes === 1 ? "dia" : "dias";
            return `${produto.nome} (${diasRestantes} ${textoDia})`;
          })
          .join(", ");

        mensagem = `AVISO: Produtos próximos do vencimento: ${listaProdutos}`;
      }

      try {
        // Configura data para o próximo horário de notificação
        // (adicionamos 2 minutos para evitar colisão com a notificação anterior)
        const dataNotificacao = new Date();
        dataNotificacao.setHours(horaConfig, minutoConfig + 2, 0, 0);

        // Se o horário já passou hoje, agenda para amanhã
        if (new Date() > dataNotificacao) {
          dataNotificacao.setDate(dataNotificacao.getDate() + 1);
        }

        // Agenda a notificação
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Aviso de Vencimento Próximo",
            body: mensagem,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: dataNotificacao,
          },
        });
      } catch (e) {
        console.error("Erro ao agendar notificação de produtos próximos:", e);
      }
    }
  } catch (error) {
    console.error("Erro ao agendar notificações diárias:", error);
    throw error;
  }
};
