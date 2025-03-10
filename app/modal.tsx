import { extrairProduto } from "@/app/utils/produtoPatterns";
import { extrairDataValidade } from "@/app/utils/validadePatterns";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router/stack";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { usePadroes } from "./contexts/PadroesContext";
import { useProdutos } from "./contexts/ProdutosContext";
import { useTema } from "./contexts/TemaContext";

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
  // Removendo a exibição do texto original temporariamente
  // saida += "---\nTexto detectado:\n" + textoCompleto;

  return saida;
};

export default function CameraModal() {
  const [image, setImage] = useState<string | null>(null);
  const [imageQueue, setImageQueue] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [imageHistory, setImageHistory] = useState<string[]>([]);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [tempValidade, setTempValidade] = useState<string | null>(null);
  const [manualProdutoNome, setManualProdutoNome] = useState("");
  const [hasError, setHasError] = useState(false);
  const [filteredProdutos, setFilteredProdutos] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showManualProductModal, setShowManualProductModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dataValidade, setDataValidade] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { adicionarProduto, produtos } = useProdutos();
  const { padroes } = usePadroes();
  const { cores, temaAtual } = useTema();

  // Determinar o tema baseado no tema do sistema e do contexto
  const colorScheme = useColorScheme();
  const isDark = temaAtual === "dark";

  // Definir cores para temas claro e escuro
  const temaSystem = {
    light: {
      background: "#ffffff",
      cardBackground: "#f8f9fa",
      text: "#212529",
      textSecondary: "#6c757d",
      border: "#dee2e6",
      primary: "#228be6",
      success: "#40c057",
      danger: "#fa5252",
      warning: "#ffd43b",
      card: "#ffffff",
    },
    dark: {
      background: "#212529",
      cardBackground: "#343a40",
      text: "#f8f9fa",
      textSecondary: "#adb5bd",
      border: "#495057",
      primary: "#339af0",
      success: "#51cf66",
      danger: "#ff6b6b",
      warning: "#fcc419",
      card: "#343a40",
    },
  };

  // Mesclamos as cores do contexto com as do tema do sistema
  const coresCombinadas = {
    ...cores,
    ...(isDark ? temaSystem.dark : temaSystem.light),
  };

  const processImage = async (imageUri: string) => {
    try {
      setImage(imageUri);
      setRecognizedText(null);
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      Alert.alert("Erro", "Houve um erro ao processar a imagem.");
    }
  };

  const processNextImage = () => {
    if (imageQueue.length > 0) {
      if (image) {
        setImageHistory([...imageHistory, image]);
      }

      const nextImage = imageQueue[0];
      const remainingImages = imageQueue.slice(1);
      setImageQueue(remainingImages);
      processImage(nextImage);
      setImageIndex(imageIndex + 1);
    }
  };

  const processPreviousImage = () => {
    if (imageHistory.length > 0) {
      if (image) {
        setImageQueue([image, ...imageQueue]);
      }

      const previousImage = imageHistory[imageHistory.length - 1];
      const newHistory = imageHistory.slice(0, -1);
      setImageHistory(newHistory);
      processImage(previousImage);
      setImageIndex(imageIndex - 1);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Desculpe, precisamos de permissão para acessar a câmera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled) {
      if (!image) {
        setImage(result.assets[0].uri);
      } else {
        setImageQueue([...imageQueue, result.assets[0].uri]);
      }
      setRecognizedText(null);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Desculpe, precisamos de permissão para acessar suas fotos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);

      if (!image) {
        setImage(selectedImages[0]);
        if (selectedImages.length > 1) {
          setImageQueue(selectedImages.slice(1));
        }
      } else {
        setImageQueue([...imageQueue, ...selectedImages]);
      }
      setRecognizedText(null);
    }
  };

  const showCameraOptions = () => {
    takePicture();
  };

  const showGalleryOptions = () => {
    pickImage();
  };

  const showEditOptions = (imageUri: string) => {
    processImage(imageUri);
  };

  const formatarData = (data: Date): string => {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = String(data.getFullYear());
    return `${dia}/${mes}/${ano}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setDataValidade(formatarData(selectedDate));
    }
  };

  const showManualInputModal = () => {
    setManualProdutoNome("");
    setDataValidade("");
    setDate(new Date());
    setShowManualProductModal(true);
  };

  const handleSaveManualProduct = async () => {
    if (!manualProdutoNome.trim() || !dataValidade.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    // Verifica se já existe um produto com o mesmo nome e data de validade
    const produtoExistente = produtos.find(
      (produto) =>
        produto.nome.toLowerCase() === manualProdutoNome.trim().toLowerCase() &&
        produto.validade === dataValidade
    );

    if (produtoExistente) {
      Alert.alert(
        "Produto já cadastrado",
        "Já existe um produto com este nome e data de validade."
      );
      return;
    }

    // Verifica se o produto está vencido
    const hoje = new Date();
    const validadeData = new Date(dataValidade.split("/").reverse().join("-"));
    const diferenca = validadeData.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diferenca / (1000 * 3600 * 24));

    if (diasRestantes < 0) {
      Alert.alert(
        "Produto Vencido",
        "O produto que você está tentando registrar já está vencido. Deseja registrá-lo mesmo assim?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Registrar Mesmo Assim",
            onPress: async () => {
              const novoProduto: ProdutoAlerta = {
                id: Date.now().toString(),
                nome: manualProdutoNome.trim(),
                validade: dataValidade,
                dataRegistro: new Date().toISOString(),
              };

              await adicionarProduto(novoProduto);
              Alert.alert(
                "Produto Registrado",
                `O produto ${manualProdutoNome.trim()} foi registrado com sucesso!\nValidade: ${dataValidade}`,
                [{ text: "OK" }]
              );
              setShowManualProductModal(false);
            },
          },
        ]
      );
      return;
    }

    const novoProduto: ProdutoAlerta = {
      id: Date.now().toString(),
      nome: manualProdutoNome.trim(),
      validade: dataValidade,
      dataRegistro: new Date().toISOString(),
    };

    await adicionarProduto(novoProduto);
    Alert.alert(
      "Produto Registrado",
      `O produto ${manualProdutoNome.trim()} foi registrado com sucesso!\nValidade: ${dataValidade}`,
      [{ text: "OK" }]
    );
    setShowManualProductModal(false);
  };

  const filterProdutosSugestoes = (text: string) => {
    setManualProdutoNome(text);

    // Extrai nomes únicos de produtos existentes
    const nomesUnicos = [...new Set(produtos.map((p) => p.nome))];

    // Filtra os produtos que contenham o texto digitado
    const filtered = nomesUnicos.filter((nome) =>
      nome.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredProdutos(filtered);
    setShowSuggestions(filtered.length > 0 && text.length > 0);
  };

  const selectProduto = (nome: string) => {
    setManualProdutoNome(nome);
    setShowSuggestions(false);
  };

  const isCurrentImageProcessed = () => {
    return image ? processedImages.includes(image) : false;
  };

  const shouldShowNavigation = () => {
    // Mostrar navegação se houver imagens na fila OU se houver histórico
    // E a imagem atual não foi processada
    return (
      (imageQueue.length > 0 || imageHistory.length > 0) &&
      !isCurrentImageProcessed()
    );
  };

  const extractTextFromImage = async () => {
    if (!image) return;

    try {
      setIsProcessing(true);
      setHasError(false);

      try {
        const result = await MlkitOcr.detectFromUri(image);

        if (result && result.length > 0) {
          const textoCompleto = result.map((block) => block.text).join("\n");

          // Extrai as informações usando os padrões salvos
          const nomeProduto = extrairProduto(textoCompleto, padroes);
          const dataVencimento = extrairData(textoCompleto, padroes);

          // Se encontrou ambos, salva direto
          if (nomeProduto && dataVencimento) {
            const salvou = await salvarProduto(nomeProduto, dataVencimento);
            if (salvou) {
              // Marcar a imagem como processada com sucesso
              setProcessedImages([...processedImages, image]);
              processNextImage();
            }
          }
          // Se encontrou só a data, mostra input manual
          else if (!nomeProduto && dataVencimento) {
            setTempValidade(dataVencimento);
            setShowManualInput(true);
          } else {
            setHasError(true);
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
          setHasError(true);
        }
      } catch (ocrError) {
        console.error("Erro no OCR:", ocrError);
        setRecognizedText("Erro ao processar o texto da imagem");
        setHasError(true);
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
      setHasError(true);
    }
  };

  const handleManualSave = async () => {
    if (manualProdutoNome.trim() && tempValidade) {
      const salvou = await salvarProduto(
        manualProdutoNome.trim(),
        tempValidade
      );
      if (salvou) {
        setShowManualInput(false);
        setManualProdutoNome("");
        setTempValidade(null);
        processNextImage();
      }
    } else {
      Alert.alert("Erro", "Por favor, insira o nome do produto.");
    }
  };

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
      return false;
    }

    // Verifica se o produto está vencido
    const validadeData = new Date(validade.split("/").reverse().join("-"));
    const hoje = new Date();
    const diferenca = validadeData.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diferenca / (1000 * 3600 * 24));

    if (diasRestantes < 0) {
      return new Promise((resolve) => {
        Alert.alert(
          "Produto Vencido",
          "O produto que você está tentando registrar já está vencido. Deseja registrá-lo mesmo assim?",
          [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => resolve(false),
            },
            {
              text: "Registrar Mesmo Assim",
              onPress: async () => {
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
                resolve(true);
              },
            },
          ]
        );
      });
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
    return true;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Limpar o estado atual
    setImage(null);
    setImageQueue([]);
    setImageHistory([]);
    setRecognizedText(null);
    setHasError(false);
    setIsProcessing(false);
    setProcessedImages([]);

    // Simular um tempo de carregamento
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: coresCombinadas.background },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[coresCombinadas.primary]}
          tintColor={coresCombinadas.primary}
          title="Atualizando..."
          titleColor={coresCombinadas.text}
        />
      }
    >
      <Stack.Screen
        options={{
          title: "Capturar Imagem",
          headerShown: true,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />

      {/* Modal para adicionar produto manualmente */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showManualProductModal}
        onRequestClose={() => setShowManualProductModal(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: coresCombinadas.cardBackground },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  paddingBottom: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: coresCombinadas.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.modalHeader,
                  {
                    color: coresCombinadas.text,
                    marginBottom: 0,
                    fontSize: 22,
                    fontWeight: "700",
                  },
                ]}
              >
                Adicionar Produto
              </Text>
              <TouchableOpacity
                onPress={() => setShowManualProductModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <FontAwesome
                  name="times"
                  size={24}
                  color={coresCombinadas.text}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.modalText,
                {
                  color: coresCombinadas.text,
                  fontWeight: "500",
                  marginBottom: 8,
                },
              ]}
            >
              Nome do Produto
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: coresCombinadas.background,
                    color: coresCombinadas.text,
                    borderColor: coresCombinadas.border,
                  },
                ]}
                placeholder="Digite o nome do produto"
                placeholderTextColor={coresCombinadas.textSecondary}
                value={manualProdutoNome}
                onChangeText={filterProdutosSugestoes}
              />

              {showSuggestions && (
                <View
                  style={[
                    styles.suggestionsContainer,
                    {
                      backgroundColor: coresCombinadas.cardBackground,
                      borderColor: coresCombinadas.border,
                    },
                  ]}
                >
                  <ScrollView
                    style={styles.suggestionsList}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    {filteredProdutos.map((nome, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.suggestionItem,
                          { borderBottomColor: coresCombinadas.border },
                        ]}
                        onPress={() => selectProduto(nome)}
                      >
                        <Text
                          style={[
                            styles.suggestionText,
                            { color: coresCombinadas.text },
                          ]}
                        >
                          {nome}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {filteredProdutos.length === 0 &&
                      manualProdutoNome.trim().length > 0 && (
                        <Text
                          style={[
                            styles.noResultsText,
                            { color: coresCombinadas.textSecondary },
                          ]}
                        >
                          Nenhum produto encontrado. Use o nome digitado.
                        </Text>
                      )}
                  </ScrollView>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.modalText,
                {
                  color: coresCombinadas.text,
                  fontWeight: "500",
                  marginBottom: 8,
                },
              ]}
            >
              Data de Validade
            </Text>
            <TouchableOpacity
              style={[
                styles.input,
                {
                  backgroundColor: coresCombinadas.background,
                  borderColor: coresCombinadas.border,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                  marginBottom: 24,
                },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={{
                  color: dataValidade
                    ? coresCombinadas.text
                    : coresCombinadas.textSecondary,
                  fontSize: 16,
                }}
              >
                {dataValidade || "Selecionar data de validade"}
              </Text>
              <FontAwesome
                name="calendar"
                size={20}
                color={coresCombinadas.textSecondary}
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowManualProductModal(false);
                  setManualProdutoNome("");
                  setDataValidade("");
                }}
                activeOpacity={0.7}
              >
                <FontAwesome
                  name="times"
                  size={16}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveManualProduct}
                activeOpacity={0.7}
              >
                <FontAwesome
                  name="check"
                  size={16}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para input manual */}
      <Modal
        visible={showManualInput}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowManualInput(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: coresCombinadas.cardBackground },
            ]}
          >
            <Text style={[styles.modalHeader, { color: coresCombinadas.text }]}>
              Inserir Nome do Produto
            </Text>

            <Text style={[styles.modalText, { color: coresCombinadas.text }]}>
              Data de Validade Encontrada: {tempValidade}
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: coresCombinadas.background,
                    color: coresCombinadas.text,
                    borderColor: coresCombinadas.border,
                  },
                ]}
                placeholder="Nome do Produto"
                placeholderTextColor={coresCombinadas.textSecondary}
                value={manualProdutoNome}
                onChangeText={filterProdutosSugestoes}
                autoFocus
              />

              {showSuggestions && (
                <View
                  style={[
                    styles.suggestionsContainer,
                    {
                      backgroundColor: coresCombinadas.cardBackground,
                      borderColor: coresCombinadas.border,
                    },
                  ]}
                >
                  <ScrollView
                    style={styles.suggestionsList}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    {filteredProdutos.map((nome, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.suggestionItem,
                          { borderBottomColor: coresCombinadas.border },
                        ]}
                        onPress={() => selectProduto(nome)}
                      >
                        <Text
                          style={[
                            styles.suggestionText,
                            { color: coresCombinadas.text },
                          ]}
                        >
                          {nome}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {filteredProdutos.length === 0 &&
                      manualProdutoNome.trim().length > 0 && (
                        <Text
                          style={[
                            styles.noResultsText,
                            { color: coresCombinadas.textSecondary },
                          ]}
                        >
                          Nenhum produto encontrado. Use o nome digitado.
                        </Text>
                      )}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowManualInput(false);
                  setManualProdutoNome("");
                  setTempValidade(null);
                }}
                activeOpacity={0.7}
              >
                <FontAwesome
                  name="times"
                  size={16}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleManualSave}
                activeOpacity={0.7}
              >
                <FontAwesome
                  name="check"
                  size={16}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View
        style={[
          styles.imageContainer,
          { backgroundColor: coresCombinadas.card },
        ]}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View
            style={[
              styles.placeholder,
              {
                backgroundColor: coresCombinadas.cardBackground,
                borderColor: coresCombinadas.border,
              },
            ]}
          >
            <FontAwesome
              name="camera"
              size={80}
              color={coresCombinadas.textSecondary}
            />
            <Text
              style={[
                styles.placeholderText,
                { color: coresCombinadas.textSecondary },
              ]}
            >
              Nenhuma imagem selecionada
            </Text>
          </View>
        )}
      </View>

      {image && hasError && (
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <FontAwesome name="exclamation-triangle" size={24} color="white" />
          </View>
          <View style={styles.errorTextContainer}>
            <Text style={styles.errorTitle}>
              Não foi possível processar esta imagem
            </Text>
            <Text style={styles.errorMessage}>
              Tente outra foto ou adicione o produto manualmente utilizando o
              botão "Manual".
            </Text>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={showCameraOptions}
          activeOpacity={0.7}
        >
          <View style={styles.buttonIconContainer}>
            <FontAwesome name="camera" size={22} color="white" />
          </View>
          <Text style={styles.buttonText}>Câmera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={showGalleryOptions}
          activeOpacity={0.7}
        >
          <View style={styles.buttonIconContainer}>
            <FontAwesome name="image" size={22} color="white" />
          </View>
          <Text style={styles.buttonText}>Galeria</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#9c36b5" }]}
          onPress={showManualInputModal}
          activeOpacity={0.7}
        >
          <View style={styles.buttonIconContainer}>
            <FontAwesome name="pencil" size={22} color="white" />
          </View>
          <Text style={styles.buttonText}>Manual</Text>
        </TouchableOpacity>

        {image && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#40c057" }]}
            onPress={extractTextFromImage}
            disabled={isProcessing}
            activeOpacity={0.7}
          >
            <View style={styles.buttonIconContainer}>
              {isProcessing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <FontAwesome name="magic" size={22} color="white" />
              )}
            </View>
            <Text style={styles.buttonText}>Processar</Text>
          </TouchableOpacity>
        )}
      </View>

      {shouldShowNavigation() && (
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              { opacity: imageHistory.length > 0 ? 1 : 0.4 },
            ]}
            onPress={processPreviousImage}
            disabled={imageHistory.length === 0}
            activeOpacity={0.7}
          >
            <FontAwesome name="chevron-left" size={16} color="white" />
          </TouchableOpacity>

          <View
            style={[
              styles.queueInfo,
              { backgroundColor: coresCombinadas.cardBackground, flex: 1 },
            ]}
          >
            <FontAwesome
              name="list"
              size={16}
              color={coresCombinadas.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.queueText, { color: coresCombinadas.text }]}>
              {imageQueue.length > 0
                ? `${imageQueue.length} ${imageQueue.length === 1 ? "imagem" : "imagens"} na fila`
                : "Última imagem"}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.navButton,
              { opacity: imageQueue.length > 0 ? 1 : 0.4 },
            ]}
            onPress={processNextImage}
            disabled={imageQueue.length === 0}
            activeOpacity={0.7}
          >
            <FontAwesome name="chevron-right" size={16} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {recognizedText && (
        <View
          style={[
            styles.textContainer,
            { backgroundColor: coresCombinadas.card },
          ]}
        >
          <Text style={[styles.textHeader, { color: coresCombinadas.text }]}>
            Dados Encontrados:
          </Text>
          <View
            style={[
              styles.textBox,
              {
                backgroundColor: coresCombinadas.cardBackground,
                borderColor: coresCombinadas.border,
              },
            ]}
          >
            <Text
              style={[styles.extractedText, { color: coresCombinadas.text }]}
            >
              {recognizedText}
            </Text>
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
    height: 400,
  },
  image: {
    width: "100%",
    height: 380,
    borderRadius: 12,
    resizeMode: "contain",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f3f5",
    width: "100%",
    height: 380,
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
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    marginTop: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#228be6",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    width: "22%",
    margin: "1%",
    flexDirection: "column",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  buttonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  useButton: {
    backgroundColor: "#40c057",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
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
  inputContainer: {
    position: "relative",
    marginBottom: 20,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f5",
  },
  suggestionText: {
    fontSize: 16,
    color: "#495057",
  },
  noResultsText: {
    fontSize: 14,
    color: "#868e96",
    padding: 12,
    fontStyle: "italic",
    textAlign: "center",
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cancelButton: {
    backgroundColor: "#fa5252",
  },
  saveButton: {
    backgroundColor: "#40c057",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  queueInfo: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
  },
  queueText: {
    color: "#495057",
    fontSize: 14,
    fontWeight: "500",
  },
  errorContainer: {
    backgroundColor: "#ff6b6b",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  errorIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 2,
  },
  errorMessage: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    lineHeight: 18,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 2,
  },
  navButton: {
    backgroundColor: "#228be6",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    margin: 2,
  },
  processButton: {
    backgroundColor: "#40c057",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
