import { Image } from "expo-image";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
}

const { width, height } = Dimensions.get("window");

export const AnimatedSplash: React.FC<AnimatedSplashProps> = ({
  onAnimationComplete,
}) => {
  useEffect(() => {
    // Tempo que o splash ficará visível (ajuste conforme necessário)
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash.gif")}
        style={styles.gif}
        contentFit="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000", // Ajuste a cor de fundo conforme necessário
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999, // Garante que fique acima de outros elementos
  },
  gif: {
    width: "100%",
    height: "100%",
  },
});
