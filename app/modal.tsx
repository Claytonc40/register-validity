import { extrairProduto } from "@/app/utils/produtoPatterns";
import { extrairDataValidade } from "@/app/utils/validadePatterns";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router/stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { usePadroes } from "./contexts/PadroesContext";
import { useProdutos } from "./contexts/ProdutosContext";

// Remova a importação do TextRecognition por enquanto para resolver o erro
// import * as TextRecognition from "expo-text-recognition";

// Adicione o import do MlkitOcr
import MlkitOcr from "react-native-mlkit-ocr";

// Adicione estas funções auxiliares antes do componente
interface ProdutoAlerta {
  id: string;
  nome: string;
  validade: string;
  dataRegistro: string;
}

const extrairData = (texto: string, padroes: any[]): string | null => {
  // Primeiro tenta extrair usando o novo componente de padrões
  const dataValidade = extrairDataValidade(texto);
  if (dataValidade) {
    return dataValidade;
  }

  // Se não encontrar, tenta usar os padrões salvos
  for (const padrao of padroes) {
    for (const padraoData of padrao.configuracao.padroesData) {
      const regex = new RegExp(
        padraoData.replace(/dd\/mm\/yy/g, "\\d{2}\\/\\d{2}\\/\\d{2}"),
        "i"
      );
      const match = texto.match(regex);
      if (match) {
        return match[0];
      }
    }
  }

  return null;
};

const formatarSaida = (
  produto: string | null,
  vencimento: string | null,
  textoCompleto: string
): string => {
  let saida = "";

  if (produto) {
    saida += `📦 Produto: ${produto}\n\n`;
  }

  if (vencimento) {
    saida += `📅 Validade: ${vencimento}\n\n`;
  }

  // Adicionar informações sobre peso se encontradas
  const pesoMatch = textoCompleto.match(/(\d+[.,]\d+)\s*kg/i);
  if (pesoMatch) {
    saida += `⚖️ Peso: ${pesoMatch[1]} kg\n\n`;
  }

  // Adicionar informações sobre quantidade de unidades se encontradas
  const qtUnidadeMatch = textoCompleto.match(/Qt\.\s*Unidade:?\s*(\d+)/i);
  if (qtUnidadeMatch) {
    saida += `📦 Quantidade: ${qtUnidadeMatch[1]} unidades\n\n`;
  }

  // Adicionar informações sobre data de produção se encontrada
  const producaoMatch = textoCompleto.match(
    /Data\s+de\s+Produção:?\s*(\d{2}\/\d{2}\/\d{4})/i
  );
  if (producaoMatch) {
    saida += `🏭 Produção: ${producaoMatch[1]}\n\n`;
  }

  if (!produto && !vencimento) {
    saida +=
      "⚠️ Não foi possível identificar o produto ou a data de vencimento.\n\n";
  }

  saida += "---\nTexto detectado:\n" + textoCompleto;

  return saida;
};

export default function CameraModal() {
  const [image, setImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [tempValidade, setTempValidade] = useState<string | null>(null);
  const [manualProdutoNome, setManualProdutoNome] = useState("");

  const { adicionarProduto, produtos } = useProdutos();
  const { padroes } = usePadroes();

  const salvarProduto = async (nome: string, validade: string) => {
    // Verifica se já existe um produto com o mesmo nome e data de validade
    const produtoExistente = produtos.find(
      (produto) =>
        produto.nome.toLowerCase() === nome.toLowerCase() &&
        produto.validade === validade
    );

    if (produtoExistente) {
      Alert.alert(
        "Produto já cadastrado",
        "Já existe um produto com este nome e data de validade."
      );
      return;
    }

    const novoProduto: ProdutoAlerta = {
      id: Date.now().toString(),
      nome,
      validade,
      dataRegistro: new Date().toISOString(),
    };

    await adicionarProduto(novoProduto);
    Alert.alert(
      "Produto Registrado",
      `O produto ${nome} foi registrado com sucesso!\nValidade: ${validade}`,
      [{ text: "OK" }]
    );
  };

  const handleManualSave = () => {
    if (manualProdutoNome.trim() && tempValidade) {
      salvarProduto(manualProdutoNome.trim(), tempValidade);
      setShowManualInput(false);
      setManualProdutoNome("");
      setTempValidade(null);
    } else {
      Alert.alert("Erro", "Por favor, insira o nome do produto.");
    }
  };

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

          // Extrai as informações usando os padrões salvos
          const nomeProduto = extrairProduto(textoCompleto, padroes);
          const dataVencimento = extrairData(textoCompleto, padroes);

          // Se encontrou ambos, salva direto
          if (nomeProduto && dataVencimento) {
            salvarProduto(nomeProduto, dataVencimento);
          }
          // Se encontrou só a data, mostra input manual
          else if (!nomeProduto && dataVencimento) {
            setTempValidade(dataVencimento);
            setShowManualInput(true);
          }

          // Formata a saída
          const textoFormatado = formatarSaida(
            nomeProduto,
            dataVencimento,
            textoCompleto
          );

          setRecognizedText(textoFormatado);
        } else {
          setRecognizedText("Nenhum texto encontrado na imagem");
        }
      } catch (ocrError) {
        console.error("Erro no OCR:", ocrError);
        setRecognizedText("Erro ao processar o texto da imagem");
        setIsProcessing(false);
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

      {/* Modal para input manual */}
      <Modal
        visible={showManualInput}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowManualInput(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Inserir Nome do Produto</Text>

            <Text style={styles.modalText}>
              Data de Validade Encontrada: {tempValidade}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do Produto"
              value={manualProdutoNome}
              onChangeText={setManualProdutoNome}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowManualInput(false);
                  setManualProdutoNome("");
                  setTempValidade(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleManualSave}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    backgroundColor: "#f8f9fa",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginTop: 16,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f3f5",
    width: "100%",
    height: 300,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e9ecef",
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 16,
    color: "#868e96",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    marginTop: 8,
  },
  button: {
    backgroundColor: "#228be6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "45%",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  useButton: {
    backgroundColor: "#40c057",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  useButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  textContainer: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#343a40",
  },
  textBox: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  extractedText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#495057",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#343a40",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    color: "#495057",
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: "#fa5252",
  },
  saveButton: {
    backgroundColor: "#40c057",
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
