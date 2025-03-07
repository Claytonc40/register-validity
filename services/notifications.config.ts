import * as Notifications from "expo-notifications";

// Configuração para como as notificações devem ser manipuladas quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const configurarNotificacoes = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    throw new Error("Permissão para notificações não concedida");
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: "d52b2dfe-ab41-4d4f-a803-8a41f2d938bf",
  });

  return token;
};

export const agendarNotificacao = async (
  titulo: string,
  corpo: string,
  data: Date
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: corpo,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: data,
    },
  });
};

export const agendarNotificacoesDiarias = async (produtos: any[]) => {
  // Cancela todas as notificações existentes
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Configura as notificações para 7h da manhã (produtos vencendo hoje)
  const hoje = new Date();
  hoje.setHours(7, 0, 0, 0);

  // Configura as notificações para 16h (produtos vencendo amanhã)
  const hoje16h = new Date();
  hoje16h.setHours(16, 0, 0, 0);

  // Filtra produtos que vencem hoje
  const produtosVencendoHoje = produtos.filter((produto) => {
    const dataValidade = new Date(produto.validade);
    return (
      dataValidade.getDate() === hoje.getDate() &&
      dataValidade.getMonth() === hoje.getMonth() &&
      dataValidade.getFullYear() === hoje.getFullYear()
    );
  });

  // Filtra produtos que vencem amanhã
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  const produtosVencendoAmanha = produtos.filter((produto) => {
    const dataValidade = new Date(produto.validade);
    return (
      dataValidade.getDate() === amanha.getDate() &&
      dataValidade.getMonth() === amanha.getMonth() &&
      dataValidade.getFullYear() === amanha.getFullYear()
    );
  });

  // Agenda notificação para produtos vencendo hoje (7h)
  if (produtosVencendoHoje.length > 0) {
    const mensagem =
      produtosVencendoHoje.length === 1
        ? `O produto ${produtosVencendoHoje[0].nome} vence hoje!`
        : `${produtosVencendoHoje.length} produtos vencem hoje!`;

    await agendarNotificacao("Produtos Vencendo Hoje", mensagem, hoje);
  }

  // Agenda notificação para produtos vencendo amanhã (16h)
  if (produtosVencendoAmanha.length > 0) {
    const mensagem =
      produtosVencendoAmanha.length === 1
        ? `O produto ${produtosVencendoAmanha[0].nome} vence amanhã!`
        : `${produtosVencendoAmanha.length} produtos vencem amanhã!`;

    await agendarNotificacao("Produtos Vencendo Amanhã", mensagem, hoje16h);
  }

  // Configura para repetir diariamente
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Verificação de Validade",
      body: "Verificando produtos próximos do vencimento...",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 7,
      minute: 0,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Verificação de Validade",
      body: "Verificando produtos que vencem amanhã...",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 16,
      minute: 0,
    },
  });
};
