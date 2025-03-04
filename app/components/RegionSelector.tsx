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
import { useTema } from "../contexts/TemaContext";

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
  const { cores } = useTema();
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.background,
    },
    imageContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    image: {
      width: "100%",
      height: Dimensions.get("window").height * 0.6,
      resizeMode: "contain",
    },
    selectionBox: {
      position: "absolute",
      borderWidth: 2,
      borderColor: cores.primary,
      backgroundColor: `${cores.primary}33`,
    },
    instruction: {
      position: "absolute",
      top: 20,
      left: 20,
      right: 20,
      backgroundColor: cores.card,
      padding: 16,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    instructionText: {
      color: cores.text,
      fontSize: 16,
      textAlign: "center",
      lineHeight: 24,
    },
    instructionHighlight: {
      color: cores.primary,
      fontWeight: "bold",
    },
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
      const relativeX = Math.max(
        0,
        Math.min(pageX - imageLayout.x, imageLayout.width)
      );
      const relativeY = Math.max(
        0,
        Math.min(pageY - imageLayout.y, imageLayout.height)
      );

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
    if (!isSelecting) return {};

    const left = Math.min(start.x, current.x);
    const top = Math.min(start.y, current.y);
    const width = Math.abs(current.x - start.x);
    const height = Math.abs(current.y - start.y);

    return {
      left,
      top,
      width,
      height,
    };
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.imageContainer}
        ref={imageRef}
        onLayout={(event) => {
          imageRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setImageLayout({ width, height, x: pageX, y: pageY });
          });
        }}
        {...panResponder.panHandlers}
      >
        <Image source={{ uri: imagem }} style={styles.image} />
        {isSelecting && (
          <View style={[styles.selectionBox, getSelectionStyle()]} />
        )}
      </View>

      <View style={styles.instruction}>
        <Text style={styles.instructionText}>
          Selecione a região onde está{" "}
          <Text style={styles.instructionHighlight}>
            {tipoRegiao === "nomeProduto"
              ? "o nome do produto"
              : "a data de validade"}
          </Text>
        </Text>
      </View>
    </View>
  );
}
