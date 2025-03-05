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
  data: Date,
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: corpo,
    },
    trigger: {
      date: data,
    },
  });
};
