import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { configurarNotificacoes } from "./notifications.config";

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
  }

  static async scheduleProductExpirationNotification(
    productName: string,
    expirationDate: Date
  ): Promise<void> {
    try {
      // Verificar se as notificações estão ativas
      const notificacoesAtivas = await AsyncStorage.getItem(
        "@notificacoes_ativas"
      );
      if (notificacoesAtivas === "false") {
        console.log("Notificações desativadas pelo usuário");
        return;
      }

      // Obter horário de notificação configurado
      const horarioNotificacao = await this.getNotificationTime();

      // Ajustar a data de expiração para o horário configurado
      const dataNotificacao = new Date(expirationDate);
      dataNotificacao.setHours(
        horarioNotificacao.getHours(),
        horarioNotificacao.getMinutes(),
        0,
        0
      );

      // Se a data já passou, não agendar
      if (dataNotificacao < new Date()) {
        console.log("Data de notificação no passado, ignorando");
        return;
      }

      // Agendar notificação diretamente
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Produto Próximo do Vencimento",
          body: `O produto ${productName} está próximo da data de validade!`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: dataNotificacao,
        },
      });

      console.log(
        `Notificação agendada para produto ${productName} na data ${dataNotificacao.toLocaleString()}`
      );
    } catch (error) {
      console.error("Erro ao agendar notificação de produto:", error);
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
