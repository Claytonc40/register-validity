import AsyncStorage from "@react-native-async-storage/async-storage";
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

  static async getNotificationTime(): Promise<Date> {
    try {
      const horarioSalvo = await AsyncStorage.getItem("@horario_notificacao");
      if (horarioSalvo) {
        return new Date(Number(horarioSalvo));
      }
      return new Date(new Date().setHours(7, 0, 0, 0)); // Padrão: 7h da manhã
    } catch (error) {
      console.error("Erro ao obter horário das notificações:", error);
      return new Date(new Date().setHours(7, 0, 0, 0));
    }
  }

  static async scheduleProductExpirationNotification(
    productName: string,
    expirationDate: Date
  ): Promise<void> {
    try {
      const notificacoesAtivas = await AsyncStorage.getItem(
        "@notificacoes_ativas"
      );
      if (notificacoesAtivas === "false") {
        console.log("Notificações desativadas pelo usuário");
        return;
      }

      const horarioNotificacao = await this.getNotificationTime();
      const dataNotificacao = new Date(expirationDate);
      dataNotificacao.setHours(
        horarioNotificacao.getHours(),
        horarioNotificacao.getMinutes(),
        0,
        0
      );

      const message = `O produto ${productName} está próximo do vencimento!`;
      await agendarNotificacao("Aviso de Vencimento", message, dataNotificacao);
    } catch (error) {
      console.error("Erro ao agendar notificação de vencimento:", error);
      throw error;
    }
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
