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
        contentFit="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Ajuste a cor de fundo conforme necessário
    alignItems: "center",
    justifyContent: "center",
  },
  gif: {
    width: width,
    height: height,
  },
});
