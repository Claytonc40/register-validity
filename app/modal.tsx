import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
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

const converterMes = (mesTexto: string): string => {
  const meses: { [key: string]: string } = {
    JAN: "01",
    FEV: "02",
    MAR: "03",
    ABR: "04",
    MAI: "05",
    JUN: "06",
    JUL: "07",
    AGO: "08",
    SET: "09",
    OUT: "10",
    NOV: "11",
    DEZ: "12",
  };
  return meses[mesTexto.toUpperCase()] || "01";
};

const extrairData = (texto: string): string | null => {
  // Padrões comuns de data com rótulos
  const padroesComRotulo = [
    // Formato dd/MMM/yy
    /VAL:?\s*(\d{2})\/([A-Za-z]{3})\/(\d{2})/i, // VAL: dd/MMM/yy
    /VENC\.?:?\s*(\d{2})\/([A-Za-z]{3})\/(\d{2})/i, // VENC: dd/MMM/yy
    /VAL\.?\/VENC\.?:?\s*(\d{2})\/([A-Za-z]{3})\/(\d{2})/i, // VAL/VENC: dd/MMM/yy
    // Formatos numéricos
    /DATA DE VENCIMENTO:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/i, // DATA DE VENCIMENTO: dd/mm/yyyy
    /VAL\.?\/VENC\.?:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/i, // VAL/VENC: dd/mm/yyyy
    /VENC\.?:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/i, // VENC: dd/mm/yyyy
    /VAL\.?:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/i, // VAL: dd/mm/yyyy
    /VALIDADE:?\s*(\d{2})[\/-](\d{2})[\/-](\d{4})/i, // VALIDADE: dd/mm/yyyy
  ];

  // Primeiro tenta encontrar datas com rótulos
  for (const padrao of padroesComRotulo) {
    const match = texto.match(padrao);
    if (match && match.length === 4) {
      // Se o segundo grupo é um mês em texto
      if (isNaN(Number(match[2]))) {
        const mes = converterMes(match[2]);
        const ano = match[3].length === 2 ? "20" + match[3] : match[3];
        return `${match[1]}/${mes}/${ano}`;
      }
      return `${match[1]}/${match[2]}/${match[3]}`;
    }
  }

  // Se não encontrou com rótulos, procura por datas soltas
  const padroesData = [
    /(\d{2})[\/-]([A-Za-z]{3})[\/-](\d{2})/i, // dd/MMM/yy
    /(\d{2})[\/-](\d{2})[\/-](\d{4})/, // dd/mm/yyyy
  ];

  const linhas = texto.split("\n");
  for (const linha of linhas) {
    for (const padrao of padroesData) {
      const match = linha.match(padrao);
      if (match && match.length === 4) {
        if (
          linha.toLowerCase().includes("val") ||
          linha.toLowerCase().includes("venc") ||
          linha.toLowerCase().includes("validade")
        ) {
          // Se o segundo grupo é um mês em texto
          if (isNaN(Number(match[2]))) {
            const mes = converterMes(match[2]);
            const ano = match[3].length === 2 ? "20" + match[3] : match[3];
            return `${match[1]}/${mes}/${ano}`;
          }
          return `${match[1]}/${match[2]}/${match[3]}`;
        }
      }
    }
  }

  return null;
};

const extrairProduto = (texto: string): string | null => {
  const linhas = texto.split("\n");

  // Lista de palavras-chave que indicam nome de produto
  const palavrasChaveProduto = [
    "TIRAS",
    "MOLHO",
    "COBERTURA",
    "MAIONESE",
    "MAYONESA",
    "FEIJÃO",
    "FEIJAO",
    "PRETO",
  ];

  // Palavras a serem ignoradas
  const palavrasIgnoradas = [
    "LOTE",
    "FAB",
    "FABRICAÇÃO",
    "VALIDADE",
    "VENCIMENTO",
    "VAL",
    "VENC",
    "PREPARADO",
    "USAR",
    "CONTÉM",
    "CONSERVAR",
    "DATA",
    "WRIN",
    "WSI",
  ];

  // Primeiro procura por "Feijão Preto" especificamente
  for (const linha of linhas) {
    if (
      linha.toLowerCase().includes("feijão preto") ||
      linha.toLowerCase().includes("feijao preto")
    ) {
      return linha.trim();
    }
  }

  // Procura por linhas que podem ser nomes de produtos
  for (const linha of linhas) {
    const linhaUpperCase = linha.toUpperCase();

    // Verifica se a linha contém alguma palavra-chave de produto
    if (
      palavrasChaveProduto.some((palavra) => linhaUpperCase.includes(palavra))
    ) {
      // Remove possíveis códigos ou números no início da linha
      const produtoLimpo = linha.replace(/^[\d\-\/\\]+\s*/, "").trim();
      if (
        produtoLimpo &&
        !palavrasIgnoradas.some((p) => linhaUpperCase.includes(p))
      ) {
        return produtoLimpo;
      }
    }

    // Se a linha está em uma caixa (toda em maiúsculas e sem números)
    if (
      linha === linhaUpperCase &&
      !linha.match(/\d/) &&
      linha.length > 3 &&
      !palavrasIgnoradas.some((p) => linhaUpperCase.includes(p))
    ) {
      return linha.trim();
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
    saida += `📅 Vencimento: ${vencimento}\n\n`;
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
  const [produtos, setProdutos] = useState<ProdutoAlerta[]>([]);
  const [showManualInput, setShowManualInput] = useState(false);
  const [tempValidade, setTempValidade] = useState<string | null>(null);
  const [manualProdutoNome, setManualProdutoNome] = useState("");

  const salvarProduto = (nome: string, validade: string) => {
    const novoProduto: ProdutoAlerta = {
      id: Date.now().toString(),
      nome,
      validade,
      dataRegistro: new Date().toISOString(),
    };

    setProdutos((prevProdutos) => [...prevProdutos, novoProduto]);
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

          // Extrai as informações
          const nomeProduto = extrairProduto(textoCompleto);
          const dataVencimento = extrairData(textoCompleto);

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

  // Renderiza a lista de produtos registrados
  const renderProdutos = () => {
    if (produtos.length === 0) {
      return null;
    }

    return (
      <View style={styles.listContainer}>
        <Text style={styles.listHeader}>Produtos Registrados:</Text>
        {produtos.map((produto) => (
          <View key={produto.id} style={styles.produtoItem}>
            <Text style={styles.produtoNome}>📦 {produto.nome}</Text>
            <Text style={styles.produtoValidade}>
              📅 Validade: {produto.validade}
            </Text>
          </View>
        ))}
      </View>
    );
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

      {renderProdutos()}

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
  listContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  produtoItem: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  produtoValidade: {
    fontSize: 14,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ff6b6b",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
