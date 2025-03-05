// import * as Notifications from "expo-notifications";
// import { useEffect, useRef, useState } from "react";
// import { NotificationService } from "../services/NotificationService";

// export function useNotifications() {
//   const [permission, setPermission] = useState(false);
//   const notificationListener = useRef<Notifications.Subscription>();
//   const responseListener = useRef<Notifications.Subscription>();

//   useEffect(() => {
//     requestPermission();

//     // Listener para receber notificações quando o app está aberto
//     notificationListener.current =
//       Notifications.addNotificationReceivedListener((notification: any) => {
//         console.log("Notificação recebida:", notification);
//       });

//     // Listener para quando o usuário interage com a notificação
//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener((response: any) => {
//         console.log("Resposta da notificação:", response);
//         // Aqui você pode adicionar lógica para navegar para uma tela específica
//         // baseado na notificação que o usuário clicou
//       });

//     return () => {
//       if (notificationListener.current) {
//         Notifications.removeNotificationSubscription(
//           notificationListener.current,
//         );
//       }
//       if (responseListener.current) {
//         Notifications.removeNotificationSubscription(responseListener.current);
//       }
//     };
//   }, []);

//   const requestPermission = async (): Promise<boolean> => {
//     const hasPermission = await NotificationService.requestPermissions();
//     setPermission(hasPermission);
//     return hasPermission;
//   };

//   const scheduleProductNotification = async (
//     productName: string,
//     expirationDate: Date,
//   ) => {
//     if (!permission) {
//       const hasPermission = await requestPermission();
//       if (hasPermission === false) {
//         throw new Error("Permissão para notificações não concedida");
//       }
//     }

//     await NotificationService.scheduleProductExpirationNotification(
//       productName,
//       expirationDate,
//     );
//   };

//   const cancelAllNotifications = async () => {
//     await NotificationService.cancelAllNotifications();
//   };

//   const getScheduledNotifications = async () => {
//     return await NotificationService.getScheduledNotifications();
//   };

//   return {
//     permission,
//     scheduleProductNotification,
//     cancelAllNotifications,
//     getScheduledNotifications,
//   };
// }
