import * as Notifications from "expo-notifications";
import {
  agendarNotificacao,
  configurarNotificacoes,
} from "./notifications.config";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      await configurarNotificacoes();
      return true;
    } catch (error) {
      console.error("Erro ao solicitar permissões:", error);
      return false;
    }
  }

  static async scheduleProductExpirationNotification(
    productName: string,
    expirationDate: Date,
  ): Promise<void> {
    const message = `O produto ${productName} está próximo do vencimento!`;
    await agendarNotificacao("Aviso de Vencimento", message, expirationDate);
  }

  static async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  static async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}
