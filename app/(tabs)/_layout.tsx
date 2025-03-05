import { FontAwesome } from "@expo/vector-icons";
import { router, Tabs } from "expo-router/";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTema } from "../contexts/TemaContext";

// Definições de cores simples para o app
const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

const Colors = {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};

/**
 * Você pode explorar o built-in icon families:
 * https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// Componente personalizado para o botão da câmera
function CameraButton() {
  const { cores } = useTema();
  const handleOpenCamera = () => {
    router.push("/modal");
  };

  return (
    <TouchableOpacity
      style={[styles.cameraButton, { backgroundColor: cores.primary }]}
      onPress={handleOpenCamera}
      activeOpacity={0.8}
    >
      <FontAwesome name="camera" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { cores } = useTema();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: cores.primary,
          tabBarInactiveTintColor: cores.textSecondary,
          tabBarStyle: {
            height: 60,
            backgroundColor: cores.card,
            borderTopColor: cores.border,
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarItemStyle: {
            flex: 1,
            justifyContent: "center",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <TabBarIcon name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="configuracoes"
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <TabBarIcon name="cog" color={color} />
            ),
          }}
        />
      </Tabs>
      <CameraButton />
    </View>
  );
}

const styles = StyleSheet.create({
  cameraButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
});
