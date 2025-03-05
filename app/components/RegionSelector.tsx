import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RegiaoEtiqueta } from "../contexts/PadroesContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  instrucao: {
    fontSize: 16,
    fontWeight: "600",
    color: "#343a40",
    marginBottom: 16,
    textAlign: "center",
  },
  imageContainer: {
    width: Dimensions.get("window").width - 32,
    height: 300,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  selection: {
    position: "absolute",
  },
});

interface Props {
  imagem: string;
  onRegionSelected: (regiao: RegiaoEtiqueta) => void;
  tipoRegiao: "nomeProduto" | "dataValidade";
}

export function RegionSelector({
  imagem,
  onRegionSelected,
  tipoRegiao,
}: Props) {
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [current, setCurrent] = useState({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const imageRef = useRef<View>(null);
  const [imageLayout, setImageLayout] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { pageX, pageY } = evt.nativeEvent;
      const relativeX = pageX - imageLayout.x;
      const relativeY = pageY - imageLayout.y;

      setStart({ x: relativeX, y: relativeY });
      setCurrent({ x: relativeX, y: relativeY });
      setIsSelecting(true);
    },
    onPanResponderMove: (evt) => {
      const { pageX, pageY } = evt.nativeEvent;
      const relativeX = pageX - imageLayout.x;
      const relativeY = pageY - imageLayout.y;

      setCurrent({ x: relativeX, y: relativeY });
    },
    onPanResponderRelease: () => {
      setIsSelecting(false);

      // Calcular a região selecionada
      const region: RegiaoEtiqueta = {
        x: Math.min(start.x, current.x),
        y: Math.min(start.y, current.y),
        width: Math.abs(current.x - start.x),
        height: Math.abs(current.y - start.y),
      };

      onRegionSelected(region);
    },
  });

  const getSelectionStyle = () => {
    if (!isSelecting) return null;

    return {
      position: "absolute" as const,
      left: Math.min(start.x, current.x),
      top: Math.min(start.y, current.y),
      width: Math.abs(current.x - start.x),
      height: Math.abs(current.y - start.y),
      borderWidth: 2,
      borderColor: tipoRegiao === "nomeProduto" ? "#228be6" : "#40c057",
      backgroundColor:
        tipoRegiao === "nomeProduto"
          ? "rgba(34, 139, 230, 0.2)"
          : "rgba(64, 192, 87, 0.2)",
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instrucao}>
        {tipoRegiao === "nomeProduto"
          ? "Selecione a região onde está o nome do produto"
          : "Selecione a região onde está a data de validade"}
      </Text>

      <View
        ref={imageRef}
        style={styles.imageContainer}
        onLayout={(event) => {
          const { width, height, x, y } = event.nativeEvent.layout;
          setImageLayout({ width, height, x, y });
        }}
        {...panResponder.panHandlers}
      >
        <Image
          source={{ uri: imagem }}
          style={styles.image}
          resizeMode="contain"
        />
        {isSelecting && (
          <View style={[styles.selection, getSelectionStyle()]} />
        )}
      </View>
    </View>
  );
}

export default RegionSelector;
