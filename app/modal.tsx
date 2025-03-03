import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Remova a importação do TextRecognition por enquanto para resolver o erro
// import * as TextRecognition from "expo-text-recognition";

// Adicione o import do MlkitOcr
import MlkitOcr from "react-native-mlkit-ocr";

// Adicione estas funções auxiliares antes do componente
const extrairData = (texto: string): string | null => {
  // Padrões comuns de data, incluindo anos com 3 dígitos
  const padroes = [
    /(\d{2})\/(\d{2})\/(\d{4})/,           // dd/mm/yyyy
    /(\d{2})\/(\d{2})\/(\d{3})/,           // dd/mm/yyy (formato incompleto)
    /(\d{2})\.(\d{2})\.(\d{4})/,           // dd.mm.yyyy
    /(\d{2})\-(\d{2})\-(\d{4})/,           // dd-mm-yyyy
    /VALIDADE[.: ]+(\d{2})[\/-](\d{2})[\/-](\d{3,4})/i,  // VALIDADE dd/mm/yyy(y)
    /VAL[.: ]+(\d{2})[\/-](\d{2})[\/-](\d{3,4})/i,       // VAL dd/mm/yyy(y)
    /VENC[.: ]+(\d{2})[\/-](\d{2})[\/-](\d{3,4})/i       // VENC dd/mm/yyy(y)
  ];

  for (const padrao of padroes) {
    const match = texto.match(padrao);
    if (match) {
      if (match.length === 4) {
        let ano = match[3];
        // Se o ano tem 3 dígitos, assume que é 2023, 2024, etc.
        if (ano.length === 3) {
          ano = '202' + ano[2];
        }
        return `${match[1]}/${match[2]}/${ano}`;
      }
    }
  }
  return null;
};

const extrairProduto = (texto: string): string | null => {
  const linhas = texto.split('\n');
  
  // Procura por linhas que podem conter informações do produto
  const linhasProduto = linhas.filter(linha => {
    const ehData = /\d{2}[\/-]\d{2}[\/-]\d{3,4}/.test(linha);
    const ehCodigo = /^[0-9\-\/]+$/.test(linha.trim());
    const palavrasIgnoradas = ['VAL', 'VENC', 'VALIDADE', 'LOTE', 'FABRICAÇÃO', 'PREPARADO', 'USAR A PARTIR'];
    
    return !ehData && !ehCodigo && !palavrasIgnoradas.some(p => linha.toUpperCase().includes(p));
  });

  // Combina as primeiras linhas que parecem ser do produto
  const produtoCompleto = linhasProduto
    .slice(0, 2) // Pega até 2 linhas para formar o nome do produto
    .map(linha => linha.trim())
    .filter(linha => linha.length > 0)
    .join(' - ');

  return produtoCompleto || null;
};

const extrairTodasDatas = (texto: string): { [key: string]: string } => {
  const datas: { [key: string]: string } = {};
  const linhas = texto.split('\n');
  let dataTemp = '';

  // Função auxiliar para completar o ano
  const completarAno = (data: string) => {
    if (data.match(/\d{2}\/\d{2}\/\d{3}$/)) {
      return data.slice(0, -3) + '202' + data.slice(-1);
    }
    return data;
  };

  // Procura por datas soltas
  const datasEncontradas = linhas.filter(linha => 
    linha.trim().match(/^\d{2}\/\d{2}\/\d{3,4}$/));

  // Se encontrou datas soltas, associa com os rótulos anteriores
  if (datasEncontradas.length >= 3) {
    datas['Preparado'] = completarAno(datasEncontradas[0]);
    datas['Usar a partir'] = completarAno(datasEncontradas[1]);
    datas['Validade'] = completarAno(datasEncontradas[2]);
  } else {
    // Procura por datas com rótulos
    linhas.forEach(linha => {
      if (linha.includes('PREPARADO')) {
        const match = linha.match(/(\d{2}\/\d{2}\/\d{3,4})/);
        if (match) datas['Preparado'] = completarAno(match[1]);
      }
      else if (linha.includes('USAR A PARTIR')) {
        const match = linha.match(/(\d{2}\/\d{2}\/\d{3,4})/);
        if (match) datas['Usar a partir'] = completarAno(match[1]);
      }
      else if (linha.includes('VALIDADE')) {
        const match = linha.match(/(\d{2}\/\d{2}\/\d{3,4})/);
        if (match) datas['Validade'] = completarAno(match[1]);
      }
    });
  }

  return datas;
};

const extrairVencimento = (texto: string): string | null => {
  const datas = extrairTodasDatas(texto);
  return datas['Validade'] || null;
};

export default function CameraModal() {
  const [image, setImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const takePicture = async () => {
    // Solicita permissão para a câmera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Desculpe, precisamos de permissão para acessar a câmera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setRecognizedText(null); // Limpa texto anterior ao tirar nova foto
    }
  };

  const pickImage = async () => {
    // Solicita permissão para a galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Desculpe, precisamos de permissão para acessar suas fotos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setRecognizedText(null); // Limpa texto anterior ao selecionar nova imagem
    }
  };

  const extractTextFromImage = async () => {
    if (!image) return;

    try {
      setIsProcessing(true);

      try {
        const result = await MlkitOcr.detectFromUri(image);

        if (result && result.length > 0) {
          const textoCompleto = result.map((block) => block.text).join("\n");

          // Extrai todas as informações
          const nomeProduto = extrairProduto(textoCompleto);
          const todasDatas = extrairTodasDatas(textoCompleto);
          const vencimento = extrairVencimento(textoCompleto);

          // Formata o texto para exibição
          let textoFormatado = "";
          if (nomeProduto) {
            textoFormatado += `Produto: ${nomeProduto}\n\n`;
          }

          if (vencimento) {
            textoFormatado += `Data de Vencimento: ${vencimento}\n\n`;
          }

          // Adiciona todas as datas encontradas
          if (Object.keys(todasDatas).length > 0) {
            textoFormatado += "Todas as Datas:\n";
            for (const [tipo, data] of Object.entries(todasDatas)) {
              textoFormatado += `${tipo}: ${data}\n`;
            }
            textoFormatado += "\n";
          }

          textoFormatado += "---\nTexto completo:\n" + textoCompleto;

          setRecognizedText(textoFormatado);
        } else {
          setRecognizedText("Nenhum texto encontrado na imagem");
        }
      } catch (ocrError) {
        console.error("Erro no OCR:", ocrError);
        setTimeout(() => {
          setRecognizedText(
            "Texto de exemplo (OCR falhou - você precisa criar um build de desenvolvimento com EAS)"
          );
          setIsProcessing(false);
        }, 1500);
      }

      setIsProcessing(false);
    } catch (error) {
      console.error("Erro ao extrair texto:", error);
      Alert.alert(
        "Erro",
        "Houve um erro ao processar a imagem. Por favor, tente novamente."
      );
      setRecognizedText("Erro ao processar imagem");
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Capturar Imagem",
          headerShown: true,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />

      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <FontAwesome name="camera" size={80} color="#ccc" />
            <Text style={styles.placeholderText}>
              Nenhuma imagem selecionada
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <FontAwesome name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <FontAwesome name="image" size={24} color="white" />
          <Text style={styles.buttonText}>Galeria</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <TouchableOpacity
          style={styles.useButton}
          onPress={extractTextFromImage}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.useButtonText}>
              {recognizedText ? "Processar Novamente" : "Extrair Texto"}
            </Text>
          )}
        </TouchableOpacity>
      )}

      {recognizedText && (
        <View style={styles.textContainer}>
          <Text style={styles.textHeader}>Texto Extraído:</Text>
          <View style={styles.textBox}>
            <Text style={styles.extractedText}>{recognizedText}</Text>
          </View>
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "45%",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  useButton: {
    backgroundColor: "#4CAF50",
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  useButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  textContainer: {
    margin: 20,
  },
  textHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  extractedText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
