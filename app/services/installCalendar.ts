/**
 * INSTRUÇÕES PARA CONFIGURAR AS PERMISSÕES DE CALENDÁRIO
 *
 * Para que a sincronização de calendário funcione, siga estas instruções:
 *
 * 1. ANDROID:
 * Edite android/app/src/main/AndroidManifest.xml e adicione estas permissões:
 *
 * <uses-permission android:name="android.permission.READ_CALENDAR" />
 * <uses-permission android:name="android.permission.WRITE_CALENDAR" />
 *
 * Adicione-as logo após a tag <manifest> e antes de <application>
 *
 * 2. iOS:
 * Edite ios/[SeuProjeto]/Info.plist e adicione:
 *
 * <key>NSCalendarsUsageDescription</key>
 * <string>Precisamos acessar seu calendário para adicionar lembretes de produtos com data de vencimento</string>
 *
 * 3. INSTALE A BIBLIOTECA:
 * Execute o comando:
 *
 * npm install react-native-calendar-events --save
 *
 * 4. VINCULE A BIBLIOTECA (iOS APENAS):
 * Para iOS, execute:
 *
 * cd ios && pod install && cd ..
 *
 * 5. REINICIE O APLICATIVO:
 * Feche e reinicie o Metro bundler e o aplicativo.
 *
 * OBSERVAÇÕES IMPORTANTES:
 * - Após permitir acesso ao calendário no dispositivo, talvez seja necessário reiniciar o aplicativo.
 * - Todos os eventos criados terão lembretes configurados para 1 dia antes e 30 minutos antes.
 * - Os eventos são adicionados ao calendário padrão do dispositivo.
 * - No simulador, crie um evento de calendário manualmente primeiro.
 */

// Exportar funções dummy para que o arquivo seja carregado como módulo
export const getCalendarPermissionsInstructions = () => {
  return "Verifique as instruções no topo deste arquivo para configurar as permissões de calendário corretamente.";
};

export default {
  getCalendarPermissionsInstructions,
};
