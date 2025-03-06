import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

export function useNotifications() {
  const [permission, setPermission] = useState(false);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    requestPermission();

    // Listener para notificações recebidas enquanto o app está aberto
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notificação recebida:", notification);
      });

    // Listener para quando o usuário clica em uma notificação
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Usuário interagiu com a notificação:", response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Solicita permissão para notificações
  const requestPermission = async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === "granted";
    setPermission(granted);
    return granted;
  };

  // Agenda uma notificação para um produto com validade
  const scheduleProductNotification = async (
    productName: string,
    expirationDate: Date
  ) => {
    if (!permission) {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        Alert.alert(
          "Permissão negada",
          "Ative as notificações nas configurações do dispositivo."
        );
        return;
      }
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alerta de Validade",
        body: `O produto ${productName} está próximo do vencimento!`,
        sound: "notification.wav",
        priority: "max",
        vibrate: [0, 500, 500, 500],
        sticky: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: expirationDate,
      },
    });
  };

  // Cancela todas as notificações agendadas
  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  // Obtém todas as notificações agendadas
  const getScheduledNotifications = async () => {
    return await Notifications.getAllScheduledNotificationsAsync();
  };

  return {
    permission,
    scheduleProductNotification,
    cancelAllNotifications,
    getScheduledNotifications,
  };
}
