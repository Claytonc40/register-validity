import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MlkitOcr from "react-native-mlkit-ocr";
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
  textoContainer: {
    width: "100%",
    marginTop: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  textoExtraido: {
    fontSize: 16,
    lineHeight: 24,
    color: "#495057",
  },
  textoSelecionado: {
    backgroundColor: "#228be6",
    color: "white",
  },
});

interface Props {
  imagem: string;
  onRegionSelected: (regiao: RegiaoEtiqueta) => void;
  tipoRegiao: "nomeProduto" | "dataValidade";
  regiaoAtual?: RegiaoEtiqueta;
}

export function RegionSelector({
  imagem,
  onRegionSelected,
  tipoRegiao,
  regiaoAtual,
}: Props) {
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [current, setCurrent] = useState({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [textoExtraido, setTextoExtraido] = useState<string[]>([]);
  const [textoSelecionado, setTextoSelecionado] = useState<string>("");
  const imageRef = useRef<View>(null);
  const [imageLayout, setImageLayout] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    extrairTexto();
  }, [imagem]);

  const extrairTexto = async () => {
    try {
      const resultado = await MlkitOcr.detectFromUri(imagem);
      if (resultado && resultado.length > 0) {
        const textos = resultado.map((block) => block.text);
        setTextoExtraido(textos);
      }
    } catch (error) {
      console.error("Erro ao extrair texto:", error);
    }
  };

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

  const selecionarTexto = async (texto: string) => {
    setTextoSelecionado(texto);
    try {
      const textosSalvos = await AsyncStorage.getItem("@textos_selecionados");
      const textos = textosSalvos ? JSON.parse(textosSalvos) : [];
      textos.push({
        texto,
        tipo: tipoRegiao,
        data: new Date().toISOString(),
      });
      await AsyncStorage.setItem(
        "@textos_selecionados",
        JSON.stringify(textos)
      );
      Alert.alert("Sucesso", "Texto selecionado e salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar texto:", error);
      Alert.alert("Erro", "Não foi possível salvar o texto selecionado");
    }
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

      <View style={styles.textoContainer}>
        <ScrollView>
          {textoExtraido.map((texto, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => selecionarTexto(texto)}
            >
              <Text
                style={[
                  styles.textoExtraido,
                  textoSelecionado === texto && styles.textoSelecionado,
                ]}
              >
                {texto}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export default RegionSelector;
