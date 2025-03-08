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
import { PadroesProvider } from "./contexts/PadroesContext";
import { ProdutosProvider } from "./contexts/ProdutosContext";
import { TemaProvider, useTema } from "./contexts/TemaContext";
import { AnimatedSplash } from "@/components/AnimatedSplash";

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
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
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
