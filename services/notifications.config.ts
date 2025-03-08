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

export const configurarNotificacoes = async () => {
  try {
    // Configura como as notificações devem aparecer no Android
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    console.log("Status atual das permissões:", existingStatus);

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log("Novo status após solicitar permissão:", finalStatus);
    }

    if (finalStatus !== "granted") {
      console.log("Permissão negada para notificações");
      throw new Error("Permissão para notificações não concedida");
    }

    console.log("Permissão concedida para notificações");
    return true;
  } catch (error) {
    console.error("Erro ao configurar notificações:", error);
    throw error;
  }
};

export const agendarNotificacao = async (
  titulo: string,
  corpo: string,
  data: Date
) => {
  try {
    // Verificar se a data é válida e futura
    const agora = new Date();
    if (isNaN(data.getTime())) {
      console.error("Data inválida para agendamento:", data);
      return;
    }

    if (data < agora) {
      console.warn("Data de notificação no passado, ajustando para amanhã");
      data = new Date(agora.getTime() + 24 * 60 * 60 * 1000);
    }

    // Criar identificador único
    const identificador = `notificacao-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // Logar informações da notificação
    console.log("Agendando notificação:");
    console.log("Título:", titulo);
    console.log("Corpo:", corpo);
    console.log("Data:", data.toLocaleString());
    console.log("ID:", identificador);

    // Agendar a notificação
    await Notifications.scheduleNotificationAsync({
      content: {
        title: titulo,
        body: corpo,
        data: { tipo: "produto" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: data,
      },
      identifier: identificador,
    });

    console.log(
      "Notificação agendada com sucesso para:",
      data.toLocaleString()
    );

    // Verificar notificações agendadas
    const notificacoesAgendadas =
      await Notifications.getAllScheduledNotificationsAsync();
    console.log(
      `Total de notificações agendadas: ${notificacoesAgendadas.length}`
    );

    return identificador;
  } catch (error) {
    console.error("Erro ao agendar notificação:", error);
    throw error;
  }
};

// Função para obter o horário configurado pelo usuário
const getHorarioNotificacao = async (): Promise<Date> => {
  try {
    const horarioSalvo = await AsyncStorage.getItem("@horario_notificacao");
    if (horarioSalvo) {
      const horario = new Date(Number(horarioSalvo));
      return horario;
    }
    // Horário padrão: 7h da manhã
    return new Date(new Date().setHours(7, 0, 0, 0));
  } catch (error) {
    console.error("Erro ao obter horário das notificações:", error);
    return new Date(new Date().setHours(7, 0, 0, 0));
  }
};

// Função para ajustar a data para o horário de notificação
const ajustarDataParaHorarioNotificacao = async (data: Date): Promise<Date> => {
  const horarioNotificacao = await getHorarioNotificacao();
  const dataAjustada = new Date(data);
  dataAjustada.setHours(
    horarioNotificacao.getHours(),
    horarioNotificacao.getMinutes(),
    0,
    0
  );
  return dataAjustada;
};

// Função para formatar a lista de produtos
const formatarListaProdutos = (produtos: any[]) => {
  if (produtos.length <= 3) {
    return produtos.map((p) => p.nome).join(", ");
  } else {
    // Se houver mais de 3 produtos, mostra os 3 primeiros e indica quantos mais
    const primeiros = produtos
      .slice(0, 3)
      .map((p) => p.nome)
      .join(", ");
    return `${primeiros} e mais ${produtos.length - 3} produto(s)`;
  }
};

// Função para comparar apenas as datas (ignorando horas)
const mesmaData = (data1: Date, data2: Date) => {
  // Verifica se as datas são válidas
  if (!data1 || !data2 || isNaN(data1.getTime()) || isNaN(data2.getTime())) {
    console.warn("Comparação de data inválida:", data1, data2);
    return false;
  }

  // Normaliza as datas para ignorar horas, minutos, segundos
  const d1 = new Date(data1.getFullYear(), data1.getMonth(), data1.getDate());
  const d2 = new Date(data2.getFullYear(), data2.getMonth(), data2.getDate());

  const resultado = d1.getTime() === d2.getTime();

  if (resultado) {
    console.log(
      "Datas iguais:",
      d1.toLocaleDateString(),
      "=",
      d2.toLocaleDateString()
    );
  }

  return resultado;
};

// Função para obter os dias de antecedência configurados
const getDiasAntecedencia = async (): Promise<number> => {
  try {
    const dias = await AsyncStorage.getItem("@dias_antecedencia");
    return dias ? parseInt(dias) : 1; // Padrão: 1 dia
  } catch (error) {
    console.error("Erro ao obter dias de antecedência:", error);
    return 1; // Padrão em caso de erro
  }
};

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
    console.log("Notificações anteriores canceladas");

    // Obtém configurações
    const horarioNotificacao = await getHorarioNotificacao();
    const diasAntecedencia = await getDiasAntecedencia();
    const avisarNoDia = await AsyncStorage.getItem("@avisar_no_dia");
    const deveAvisarNoDia = avisarNoDia !== "false";

    console.log(
      "Horário configurado:",
      horarioNotificacao.toLocaleTimeString()
    );
    console.log("Dias de antecedência:", diasAntecedencia);
    console.log("Avisar no dia do vencimento:", deveAvisarNoDia);

    // Configura as datas
    const agora = new Date();
    const hoje = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate()
    );

    console.log("Data atual:", hoje.toLocaleDateString());
    console.log("Total de produtos a verificar:", produtos.length);

    // Função para converter string de data para objeto Date
    const converterDataValidade = (dataString: string): Date => {
      try {
        // Verifica se a data está no formato DD/MM/YYYY
        if (dataString.includes("/")) {
          const [dia, mes, ano] = dataString.split("/").map(Number);
          return new Date(ano, mes - 1, dia);
        }

        // Tenta converter normalmente
        return new Date(dataString);
      } catch (error) {
        console.error(`Erro ao converter data "${dataString}":`, error);
        return new Date(0); // Data inválida
      }
    };

    // Log de todos os produtos e suas datas para diagnóstico
    produtos.forEach((produto, index) => {
      try {
        const dataValidade = converterDataValidade(produto.validade);
        console.log(
          `Produto ${index + 1}: ${
            produto.nome
          }, Validade: ${dataValidade.toLocaleDateString()}`
        );
      } catch (error) {
        console.error(`Erro ao processar produto ${index + 1}:`, error);
      }
    });

    // Filtra produtos por categoria de vencimento
    const produtosVencemHoje = produtos.filter((produto) => {
      if (!produto.validade) {
        console.log(`Produto sem data de validade: ${produto.nome}`);
        return false;
      }

      try {
        const dataValidade = converterDataValidade(produto.validade);

        if (isNaN(dataValidade.getTime())) {
          console.log(`Data inválida para produto: ${produto.nome}`);
          return false;
        }

        const resultado = mesmaData(dataValidade, hoje);

        if (resultado) {
          console.log(
            `Produto vence hoje: ${
              produto.nome
            } - ${dataValidade.toLocaleDateString()}`
          );
        }

        return resultado;
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

        const resultado =
          diasAteVencimento <= diasAntecedencia && diasAteVencimento > 0;

        if (resultado) {
          console.log(
            `Produto próximo do vencimento: ${produto.nome} - Dias restantes: ${diasAteVencimento}`
          );
        }

        return resultado;
      } catch (error) {
        console.error(`Erro ao verificar produto ${produto.nome}:`, error);
        return false;
      }
    });

    console.log(`Produtos que vencem hoje: ${produtosVencemHoje.length}`);
    console.log(
      `Produtos próximos do vencimento: ${produtosProximosVencimento.length}`
    );

    // Configura a notificação diária repetida
    const horaConfig = horarioNotificacao.getHours();
    const minutoConfig = horarioNotificacao.getMinutes();

    console.log(
      `Configurando notificação diária para ${horaConfig}:${minutoConfig}`
    );

    // Agenda notificações para produtos que vencem hoje
    if (deveAvisarNoDia && produtosVencemHoje.length > 0) {
      let mensagem;
      if (produtosVencemHoje.length === 1) {
        mensagem = `O produto ${produtosVencemHoje[0].nome} vence HOJE!`;
      } else {
        const listaProdutos = formatarListaProdutos(produtosVencemHoje);
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

        console.log(
          "Agendando notificação para:",
          dataNotificacao.toLocaleString()
        );

        // Agenda usando o objeto Date diretamente como trigger
        const identifier = await Notifications.scheduleNotificationAsync({
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
        console.log(
          `Notificação de produtos hoje agendada com ID: ${identifier}`
        );
      } catch (e) {
        console.error("Erro ao agendar notificação de hoje:", e);
      }
    }

    // Agenda notificações para produtos próximos do vencimento
    if (produtosProximosVencimento.length > 0) {
      let mensagem;
      if (produtosProximosVencimento.length === 1) {
        const diasRestantes = Math.ceil(
          (new Date(produtosProximosVencimento[0].validade).getTime() -
            hoje.getTime()) /
            (1000 * 3600 * 24)
        );
        mensagem = `O produto ${produtosProximosVencimento[0].nome} vence em ${diasRestantes} dia(s)!`;
      } else {
        const listaProdutos = formatarListaProdutos(produtosProximosVencimento);
        mensagem = `Produtos próximos do vencimento: ${listaProdutos}`;
      }

      try {
        // Configura data para o próximo horário de notificação
        // (adicionamos 2 minuto para evitar colisão com a notificação anterior)
        const dataNotificacao = new Date();
        dataNotificacao.setHours(horaConfig, minutoConfig + 2, 0, 0);

        // Se o horário já passou hoje, agenda para amanhã
        if (new Date() > dataNotificacao) {
          dataNotificacao.setDate(dataNotificacao.getDate() + 1);
        }

        console.log(
          "Agendando notificação próximos para:",
          dataNotificacao.toLocaleString()
        );

        // Agenda usando o objeto Date diretamente como trigger
        const identifier = await Notifications.scheduleNotificationAsync({
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
        console.log(
          `Notificação de produtos próximos agendada com ID: ${identifier}`
        );
      } catch (e) {
        console.error("Erro ao agendar notificação de produtos próximos:", e);
      }
    }

    // Verifica notificações agendadas
    const notificacoesAgendadas =
      await Notifications.getAllScheduledNotificationsAsync();
    console.log(
      `Total de notificações agendadas: ${notificacoesAgendadas.length}`
    );
    console.log("Notificações agendadas com sucesso");
  } catch (error) {
    console.error("Erro ao agendar notificações diárias:", error);
    throw error;
  }
};

// Função específica para testar notificações imediatamente
export const testarNotificacao = async (): Promise<void> => {
  try {
    // Limpa notificações existentes
    await Notifications.dismissAllNotificationsAsync();

    console.log("Enviando notificação de teste imediata");

    // Em vez de usar presentNotificationAsync (que está obsoleto),
    // usamos scheduleNotificationAsync com um trigger null
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notificação de Teste",
        body: "Esta é uma notificação de teste. Se você está vendo isso, o sistema de notificações está funcionando!",
        sound: true,
      },
      trigger: null, // Exibe imediatamente
    });

    console.log("Notificação de teste enviada com sucesso");
    return;
  } catch (error) {
    console.error("Erro ao testar notificação:", error);
    throw error;
  }
};

// Função para agendar uma notificação temporária (para fins de teste)
export const agendarNotificacaoTeste = async (
  segundos: number = 5
): Promise<void> => {
  try {
    console.log(`Agendando notificação de teste para ${segundos} segundos`);

    // A forma correta de definir um trigger baseado em segundos é usar DATE
    const dataFutura = new Date(Date.now() + segundos * 1000);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notificação Agendada de Teste",
        body: `Esta notificação foi agendada para aparecer após ${segundos} segundos`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: dataFutura,
      },
    });

    console.log(`Notificação agendada com ID: ${id}`);
  } catch (error) {
    console.error("Erro ao agendar notificação de teste:", error);
  }
};
