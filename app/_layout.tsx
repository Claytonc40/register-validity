import { PadroesProvider } from "@/app/contexts/PadroesContext";
import { ProdutosProvider } from "@/app/contexts/ProdutosContext";
import { TemaProvider, useTema } from "@/app/contexts/TemaContext";
import { AnimatedSplash } from "@/components/AnimatedSplash";
import { registrarTarefaSegundoPlano } from "@/services/notifications.config";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { temaAtual } = useTema();
  const isDark = temaAtual === "dark";
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  if (isSplashVisible) {
    return (
      <AnimatedSplash onAnimationComplete={() => setIsSplashVisible(false)} />
    );
  }
  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <PadroesProvider>
        <ProdutosProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="treinamento"
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
          </Stack>
        </ProdutosProvider>
      </PadroesProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      // Registra a tarefa em segundo plano na inicialização
      const iniciarTarefasSegundoPlano = async () => {
        try {
          // Verificar se as notificações estão ativas
          const notificacoesAtivas = await AsyncStorage.getItem(
            "@notificacoes_ativas"
          );
          if (notificacoesAtivas === "false") {
            console.log(
              "Notificações desativadas, não inicializando tarefas em segundo plano"
            );
            return;
          }

          // Verificar se a verificação em segundo plano está ativa
          const verificacaoSegundoPlano = await AsyncStorage.getItem(
            "@verificacao_segundo_plano"
          );
          if (verificacaoSegundoPlano === "false") {
            console.log(
              "Verificação em segundo plano desativada nas configurações"
            );
            return;
          }

          // Tentar registrar tarefa em segundo plano
          const sucesso = await registrarTarefaSegundoPlano();
          if (sucesso) {
            console.log("Tarefas em segundo plano iniciadas com sucesso");
          } else {
            console.log("Falha ao iniciar tarefas em segundo plano");
          }
        } catch (error) {
          console.error("Erro ao iniciar tarefas em segundo plano:", error);
        }
      };

      iniciarTarefasSegundoPlano();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TemaProvider>
      <RootLayoutNav />
    </TemaProvider>
  );
}
