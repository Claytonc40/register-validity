import { ProdutoAlerta, useProdutos } from "@/app/contexts/ProdutosContext";
import { useTema } from "@/app/contexts/TemaContext";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

// Definição dos estilos movida para o início
const createStyles = (cores: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.background,
    },
    header: {
      padding: 20,
      backgroundColor: cores.card,
      borderBottomWidth: 1,
      borderBottomColor: cores.border,
      paddingTop: 60,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: {
      flex: 1,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerButton: {
      padding: 8,
      marginLeft: 15,
    },
    menuModal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    menuContent: {
      backgroundColor: cores.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingBottom: 30,
      paddingTop: 15,
      width: "100%",
      maxHeight: "85%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 20,
    },
    menuHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: cores.border,
    },
    menuTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: cores.text,
    },
    menuSection: {
      marginBottom: 20,
    },
    menuSectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: cores.text,
      marginBottom: 12,
    },
    searchInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: cores.cardBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: cores.border,
      paddingHorizontal: 12,
    },
    searchIcon: {
      marginRight: 8,
    },
    clearSearchButton: {
      padding: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 15,
      color: cores.text,
    },
    filterButtons: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginTop: 4,
    },
    filterOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginVertical: 6,
      width: "48%",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: cores.border,
      backgroundColor: cores.cardBackground,
    },
    filterOptionActive: {
      backgroundColor: `${cores.cardBackground}`,
      borderWidth: 2,
    },
    filterOptionText: {
      marginLeft: 8,
      fontSize: 14,
      color: cores.text,
      fontWeight: "500",
    },
    themeOptions: {
      marginTop: 8,
    },
    menuOptionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: cores.border,
    },
    menuOptionText: {
      fontSize: 16,
      color: cores.text,
      marginLeft: 12,
    },
    applyButtonContainer: {
      marginTop: 10,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: cores.border,
    },
    applyButton: {
      backgroundColor: cores.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    applyButtonText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: cores.text,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 14,
      color: cores.textSecondary,
      marginTop: 4,
    },
    contentContainer: {
      flexGrow: 1,
      paddingBottom: 80,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      marginTop: 50,
    },
    emptyText: {
      fontSize: 18,
      color: cores.textSecondary,
      marginTop: 10,
    },
    emptySubtext: {
      fontSize: 14,
      color: cores.textSecondary,
      textAlign: "center",
      marginTop: 5,
    },
    produtoCard: {
      backgroundColor: cores.card,
      marginHorizontal: 15,
      marginTop: 15,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    statusIndicator: {
      width: 8,
      height: "100%",
      borderRadius: 4,
      marginRight: 15,
    },
    produtoInfo: {
      flex: 1,
    },
    produtoNome: {
      fontSize: 16,
      fontWeight: "600",
      color: cores.text,
      marginBottom: 4,
    },
    produtoValidade: {
      fontSize: 14,
      color: cores.textSecondary,
      marginBottom: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500",
    },
    deleteButton: {
      padding: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      width: "90%",
      backgroundColor: cores.background,
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
      maxWidth: 450,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: cores.border,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: cores.text,
    },
    inputContainer: {
      position: "relative",
      marginBottom: 20,
      zIndex: 10,
    },
    inputLabel: {
      fontSize: 16,
      marginBottom: 8,
      color: cores.text,
      fontWeight: "500",
    },
    input: {
      backgroundColor: cores.cardBackground,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      fontSize: 16,
      color: cores.text,
      borderWidth: 1,
      borderColor: cores.border,
    },
    dateInput: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: cores.cardBackground,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: cores.border,
      marginBottom: 24,
    },
    dateText: {
      fontSize: 16,
      color: cores.text,
    },
    datePlaceholder: {
      fontSize: 16,
      color: cores.textSecondary,
    },
    suggestionsContainer: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: cores.cardBackground,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 8,
      maxHeight: 200,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      zIndex: 20,
    },
    suggestionsList: {
      maxHeight: 200,
    },
    suggestionItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: cores.border,
    },
    suggestionText: {
      fontSize: 16,
      color: cores.text,
    },
    noResultsText: {
      fontSize: 14,
      color: cores.textSecondary,
      padding: 12,
      fontStyle: "italic",
      textAlign: "center",
    },
    modalButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    modalButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      flex: 0.48,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: cores.errorLight,
    },
    saveButton: {
      backgroundColor: cores.successDark,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#fff",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    observacoesModalContent: {
      width: "90%",
      borderRadius: 12,
      padding: 20,
      maxHeight: "80%",
    },
    observacoesTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 15,
      textAlign: "center",
    },
    observacoesProdutoInfo: {
      marginBottom: 15,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    observacoesProdutoNome: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 5,
    },
    observacoesProdutoData: {
      fontSize: 14,
    },
    observacoesInput: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      height: 120,
      fontSize: 16,
      marginBottom: 20,
    },
    observacoesButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    observacoesButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      flex: 0.48,
      alignItems: "center",
    },
    observacoesCancelButton: {
      borderWidth: 1,
    },
    observacoesSaveButton: {
      borderWidth: 0,
    },
    acoesModalContent: {
      width: "90%",
      borderRadius: 16,
      overflow: "hidden",
      maxHeight: "80%",
    },
    acoesModalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: cores.border,
    },
    acoesModalTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    closeButton: {
      padding: 4,
    },
    produtoDetalhes: {
      padding: 20,
    },
    produtoDetalheNome: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 6,
    },
    produtoDetalheValidade: {
      fontSize: 16,
      marginBottom: 20,
    },
    divider: {
      height: 1,
      marginVertical: 15,
    },
    observacoesLabel: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 10,
    },
    acoesButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    acaoButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      flex: 0.48,
    },
    acaoDeleteButton: {
      backgroundColor: cores.danger,
    },
    acaoSaveButton: {
      backgroundColor: cores.primary,
    },
    acaoShareButton: {
      backgroundColor: cores.warning,
    },
    acaoButtonText: {
      color: "#fff",
      fontWeight: "bold",
      marginLeft: 8,
    },
    acaoButtonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
    },
    observacaoPreview: {
      flex: 1,
      marginLeft: 8,
      justifyContent: "center",
      maxWidth: "30%",
      borderLeftWidth: 1,
      borderLeftColor: cores.border,
      paddingLeft: 8,
    },
    observacaoPreviewText: {
      fontSize: 12,
      color: cores.textSecondary,
      fontStyle: "italic",
    },
    compartilharModalContent: {
      width: "90%",
      borderRadius: 20,
      padding: 24,
      maxHeight: "85%",
      backgroundColor: cores.card,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 8,
    },
    compartilharModalTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: "center",
      color: cores.text,
    },
    compartilharModalSubtitle: {
      fontSize: 16,
      marginBottom: 24,
      textAlign: "center",
      color: cores.textSecondary,
      paddingHorizontal: 10,
    },
    compartilharOptions: {
      marginBottom: 20,
    },
    compartilharOptionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
      color: cores.text,
    },
    compartilharOption: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 12,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    compartilharOptionActive: {
      borderWidth: 2,
      backgroundColor: `${cores.primary}10`,
    },
    compartilharOptionText: {
      fontSize: 16,
      color: cores.text,
      marginLeft: 12,
    },
    compartilharButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    compartilharButton: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      flex: 0.48,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    compartilharCancelButton: {
      borderWidth: 1,
    },
    compartilharConfirmButton: {
      backgroundColor: cores.primary,
    },
    compartilharButtonIcon: {
      marginRight: 8,
    },
  });

export default function HomeScreen() {
  const { produtos, carregarProdutos, removerProduto, adicionarProduto } =
    useProdutos();
  const { cores, tema, mudarTema, temaAtual } = useTema();
  const [showModal, setShowModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [nomeProduto, setNomeProduto] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "todos" | "vencidos" | "proximos" | "ok"
  >("todos");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [filteredProdutosSugestoes, setFilteredProdutosSugestoes] = useState<
    string[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showObservacoesModal, setShowObservacoesModal] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<ProdutoAlerta | null>(null);
  const [observacao, setObservacao] = useState("");
  const [showAcoesModal, setShowAcoesModal] = useState(false);
  const [todasObservacoes, setTodasObservacoes] = useState<{
    [key: string]: string;
  }>({});
  const [showCompartilharModal, setShowCompartilharModal] = useState(false);
  const [tipoCompartilhamento, setTipoCompartilhamento] = useState<
    "todos" | "vencidos" | "proximos7" | "proximos15" | "proximos30"
  >("todos");

  // Determinar o tema baseado no tema do sistema
  const colorScheme = useColorScheme();
  const isDark = temaAtual === "dark";
  const usingSystemTheme = tema === "system";

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

  // Criar os estilos usando as cores do tema
  const styles = createStyles(coresCombinadas);

  const navigation = useNavigation<any>();

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    if (showMenuModal) {
      // Quando o modal abre
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 70,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Quando o modal fecha
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 400,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showMenuModal, slideAnim, fadeAnim, scaleAnim]);

  const formatarData = (data: Date): string => {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setDataValidade(formatarData(selectedDate));
    }
  };

  const handleSaveManual = () => {
    if (!nomeProduto.trim() || !dataValidade.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    // Verifica se já existe um produto com o mesmo nome e data de validade
    const produtoExistente = produtos.find(
      (produto) =>
        produto.nome.toLowerCase() === nomeProduto.trim().toLowerCase() &&
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
    const diasRestantes = calcularDiasRestantes(dataValidade);
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
            onPress: () => {
              const novoProduto = {
                id: Date.now().toString(),
                nome: nomeProduto.trim(),
                validade: dataValidade,
                dataRegistro: new Date().toISOString(),
              };

              adicionarProduto(novoProduto);
              setShowModal(false);
              setNomeProduto("");
              setDataValidade("");
              setDate(new Date());
            },
          },
        ]
      );
      return;
    }

    const novoProduto = {
      id: Date.now().toString(),
      nome: nomeProduto.trim(),
      validade: dataValidade,
      dataRegistro: new Date().toISOString(),
    };

    adicionarProduto(novoProduto);
    setShowModal(false);
    setNomeProduto("");
    setDataValidade("");
    setDate(new Date());
  };

  const calcularDiasRestantes = (dataValidade: string) => {
    const hoje = new Date();
    const validade = new Date(dataValidade.split("/").reverse().join("-"));
    const diferenca = validade.getTime() - hoje.getTime();
    return Math.ceil(diferenca / (1000 * 3600 * 24));
  };

  const getStatusColor = (diasRestantes: number) => {
    if (diasRestantes < 0) return "#ff6b6b";
    if (diasRestantes <= 30) return "#ffd93d";
    return "#4CAF50";
  };

  const produtosFiltrados = useMemo(() => {
    let filtered = [...produtos];

    // Aplicar filtro de busca
    if (searchTerm.trim()) {
      filtered = filtered.filter((produto) =>
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro de status
    if (filterStatus !== "todos") {
      filtered = filtered.filter((produto) => {
        const diasRestantes = calcularDiasRestantes(produto.validade);
        if (filterStatus === "vencidos") return diasRestantes < 0;
        if (filterStatus === "proximos")
          return diasRestantes >= 0 && diasRestantes <= 30;
        if (filterStatus === "ok") return diasRestantes > 30;
        return true;
      });
    }

    // Aplicar ordenação por data de validade
    filtered.sort((a, b) => {
      const diasRestantesA = calcularDiasRestantes(a.validade);
      const diasRestantesB = calcularDiasRestantes(b.validade);
      return sortOrder === "asc"
        ? diasRestantesA - diasRestantesB
        : diasRestantesB - diasRestantesA;
    });

    return filtered;
  }, [produtos, searchTerm, filterStatus, sortOrder]);

  const handleNomeProdutoChange = (text: string) => {
    setNomeProduto(text);

    // Extrai nomes únicos de produtos existentes
    const nomesUnicos = [...new Set(produtos.map((p) => p.nome))];

    // Filtra os produtos que contenham o texto digitado
    const filtered = nomesUnicos.filter((nome) =>
      nome.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredProdutosSugestoes(filtered);
    setShowSuggestions(filtered.length > 0 && text.length > 0);
  };

  const selectProduto = (nome: string) => {
    setNomeProduto(nome);
    setShowSuggestions(false);
  };

  const toggleTheme = async () => {
    const newTheme = isDark ? "light" : "dark";
    await mudarTema(newTheme);
  };

  const resetToSystemTheme = async () => {
    await mudarTema("system");
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Recarregar a lista de produtos
    carregarProdutos()
      .then(() => {
        setRefreshing(false);
      })
      .catch((error) => {
        console.error("Erro ao atualizar produtos:", error);
        setRefreshing(false);
      });
  }, [carregarProdutos]);

  // Função para fechar o modal ao clicar fora dele
  const handleBackdropPress = () => {
    setShowMenuModal(false);
  };

  // Função para abrir o modal de observações de um produto
  const abrirObservacoesModal = (produto: ProdutoAlerta) => {
    setProdutoSelecionado(produto);
    // Carregar observação existente, se houver
    carregarObservacao(produto.id);
    setShowObservacoesModal(true);
  };

  // Função para carregar a observação de um produto
  const carregarObservacao = async (produtoId: string) => {
    try {
      const observacaoSalva = await AsyncStorage.getItem(
        `@observacao_${produtoId}`
      );
      setObservacao(observacaoSalva || "");
    } catch (error) {
      console.error("Erro ao carregar observação:", error);
      setObservacao("");
    }
  };

  // Função para salvar a observação
  const salvarObservacao = async () => {
    try {
      if (!produtoSelecionado) return;

      await AsyncStorage.setItem(
        `@observacao_${produtoSelecionado.id}`,
        observacao
      );

      // Atualizar o objeto de todas as observações
      setTodasObservacoes((prev) => ({
        ...prev,
        [produtoSelecionado.id]: observacao,
      }));

      Alert.alert(
        "Observação Salva",
        "A observação do produto foi salva com sucesso."
      );
      setShowAcoesModal(false);
      setShowObservacoesModal(false);
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar a observação. Tente novamente."
      );
    }
  };

  // Função para carregar todas as observações quando a lista de produtos for carregada
  const carregarTodasObservacoes = async () => {
    try {
      const observacoesObj: { [key: string]: string } = {};
      for (const produto of produtos) {
        const observacao = await AsyncStorage.getItem(
          `@observacao_${produto.id}`
        );
        if (observacao) {
          observacoesObj[produto.id] = observacao;
        }
      }
      setTodasObservacoes(observacoesObj);
    } catch (error) {
      console.error("Erro ao carregar observações:", error);
    }
  };

  // Chamar a função para carregar todas as observações quando os produtos mudarem
  useEffect(() => {
    carregarTodasObservacoes();
  }, [produtos]);

  // Função para limitar o tamanho do texto das observações
  const limitarTexto = (texto: string, limite: number) => {
    if (!texto) return "";
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + "...";
  };

  // Modificar a função que é chamada ao clicar no produto
  const handleProdutoPress = (produto: ProdutoAlerta) => {
    setProdutoSelecionado(produto);
    carregarObservacao(produto.id);
    setShowAcoesModal(true);
  };

  // Função para abrir o modal de compartilhamento
  const abrirModalCompartilhamento = () => {
    setTipoCompartilhamento("todos");
    setShowCompartilharModal(true);
  };

  // Função para compartilhar produtos
  const compartilharProdutos = async (produtos: ProdutoAlerta[]) => {
    try {
      if (produtos.length === 0) {
        Alert.alert("Aviso", "Não há produtos para compartilhar.");
        return;
      }

      // Criar texto para compartilhar
      let mensagem = "📆 *PRODUTOS A VENCER* 📆\n\n";

      // Ordenar produtos por data de validade (do mais próximo ao vencimento ao mais distante)
      const produtosOrdenados = [...produtos].sort((a, b) => {
        const diasA = calcularDiasRestantes(a.validade);
        const diasB = calcularDiasRestantes(b.validade);
        return diasA - diasB;
      });

      // Limitar a 15 produtos para não sobrecarregar a mensagem
      const produtosParaCompartilhar = produtosOrdenados.slice(0, 15);

      produtosParaCompartilhar.forEach((produto, index) => {
        const diasRestantes = calcularDiasRestantes(produto.validade);
        const status =
          diasRestantes < 0
            ? "❌ VENCIDO"
            : diasRestantes <= 7
              ? "⚠️ PRÓXIMO AO VENCIMENTO"
              : "✅ OK";

        mensagem += `*${index + 1}. ${produto.nome}*\n`;
        mensagem += `   Validade: ${produto.validade}\n`;
        mensagem += `   Status: ${status}\n`;

        // Adicionar dias restantes
        if (diasRestantes < 0) {
          mensagem += `   Vencido há ${Math.abs(diasRestantes)} dias\n`;
        } else {
          mensagem += `   Faltam ${diasRestantes} dias\n`;
        }

        // Adicionar observações se existirem
        if (todasObservacoes[produto.id]) {
          mensagem += `   📝 *Observações:* ${todasObservacoes[produto.id]}\n`;
        }

        mensagem += "\n";
      });

      if (produtosOrdenados.length > 15) {
        mensagem += `... e mais ${produtosOrdenados.length - 15} produtos não exibidos.`;
      }

      mensagem += "\n_Enviado pelo aplicativo ExpiReAí_";

      // Tentar compartilhar primeiro usando a API de compartilhamento nativa
      try {
        await Share.share({
          message: mensagem,
        });
      } catch (error) {
        // Fallback para compartilhar via WhatsApp diretamente
        let whatsappUrl = `whatsapp://send?text=${encodeURIComponent(mensagem)}`;
        const canOpen = await Linking.canOpenURL(whatsappUrl);

        if (canOpen) {
          await Linking.openURL(whatsappUrl);
        } else {
          Alert.alert(
            "Erro",
            "Não foi possível abrir o WhatsApp. Verifique se o aplicativo está instalado."
          );
        }
      }
    } catch (error) {
      console.error("Erro ao compartilhar produtos:", error);
      Alert.alert(
        "Erro",
        "Não foi possível compartilhar os produtos. Tente novamente."
      );
    }
  };

  // Função para filtrar produtos com base na opção selecionada
  const filtrarProdutosParaCompartilhar = () => {
    let produtosSelecionados = [...produtosFiltrados];

    if (tipoCompartilhamento === "vencidos") {
      produtosSelecionados = produtosSelecionados.filter(
        (produto) => calcularDiasRestantes(produto.validade) < 0
      );
    } else if (tipoCompartilhamento === "proximos7") {
      produtosSelecionados = produtosSelecionados.filter((produto) => {
        const dias = calcularDiasRestantes(produto.validade);
        return dias >= 0 && dias <= 7;
      });
    } else if (tipoCompartilhamento === "proximos15") {
      produtosSelecionados = produtosSelecionados.filter((produto) => {
        const dias = calcularDiasRestantes(produto.validade);
        return dias >= 0 && dias <= 15;
      });
    } else if (tipoCompartilhamento === "proximos30") {
      produtosSelecionados = produtosSelecionados.filter((produto) => {
        const dias = calcularDiasRestantes(produto.validade);
        return dias >= 0 && dias <= 30;
      });
    }

    return produtosSelecionados;
  };

  // Função para compartilhar produtos filtrados
  const compartilharProdutosFiltrados = async () => {
    // Filtrar produtos com base na opção selecionada
    const produtosSelecionados = filtrarProdutosParaCompartilhar();

    // Fechar o modal e compartilhar
    setShowCompartilharModal(false);
    compartilharProdutos(produtosSelecionados);
  };

  // Função para compartilhar um único produto
  const compartilharProdutoUnico = async () => {
    if (!produtoSelecionado) return;

    try {
      // Criar texto para compartilhar
      let mensagem = "🗓️ *PRODUTO A VENCER* 🗓️\n\n";

      const diasRestantes = calcularDiasRestantes(produtoSelecionado.validade);
      const status =
        diasRestantes < 0
          ? "❌ VENCIDO"
          : diasRestantes <= 7
            ? "⚠️ PRÓXIMO AO VENCIMENTO"
            : "✅ OK";

      mensagem += `*${produtoSelecionado.nome}*\n`;
      mensagem += `Validade: ${produtoSelecionado.validade}\n`;
      mensagem += `Status: ${status}\n`;

      // Adicionar dias restantes
      if (diasRestantes < 0) {
        mensagem += `Vencido há ${Math.abs(diasRestantes)} dias\n`;
      } else {
        mensagem += `Faltam ${diasRestantes} dias\n`;
      }

      // Adicionar observações se existirem
      if (observacao) {
        mensagem += `\n📝 *Observações:* ${observacao}\n`;
      }

      mensagem += "\n_Enviado pelo aplicativo ExpiReAí_";

      // Compartilhar usando a API nativa
      await Share.share({
        message: mensagem,
      });

      // Fechar o modal após compartilhar
      setShowAcoesModal(false);
    } catch (error) {
      console.error("Erro ao compartilhar produto:", error);
      Alert.alert(
        "Erro",
        "Não foi possível compartilhar o produto. Tente novamente."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Lista de Produtos</Text>
          <Text style={styles.subtitle}>
            {produtos.length} {produtos.length === 1 ? "produto" : "produtos"}{" "}
            cadastrados
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowModal(true)}
          >
            <FontAwesome name="plus" size={20} color={coresCombinadas.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={abrirModalCompartilhamento}
          >
            <FontAwesome
              name="share-alt"
              size={20}
              color={coresCombinadas.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowMenuModal(true)}
          >
            <FontAwesome
              name="ellipsis-v"
              size={20}
              color={coresCombinadas.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[coresCombinadas.primary]}
            tintColor={coresCombinadas.primary}
            title="Atualizando lista..."
            titleColor={coresCombinadas.text}
          />
        }
      >
        {produtosFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome
              name="inbox"
              size={50}
              color={coresCombinadas.textSecondary}
            />
            <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
            <Text style={styles.emptySubtext}>
              Tire uma foto do produto para começar a monitorar
            </Text>
          </View>
        ) : (
          produtosFiltrados.map((produto) => {
            const diasRestantes = calcularDiasRestantes(produto.validade);
            const statusColor = getStatusColor(diasRestantes);

            return (
              <TouchableOpacity
                style={[styles.produtoCard, { backgroundColor: cores.card }]}
                key={produto.id}
                onPress={() => handleProdutoPress(produto)}
                onLongPress={() => abrirObservacoesModal(produto)}
              >
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: statusColor },
                  ]}
                />
                <View style={styles.produtoInfo}>
                  <Text style={styles.produtoNome}>{produto.nome}</Text>
                  <Text style={styles.produtoValidade}>
                    Validade: {produto.validade}
                  </Text>
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {diasRestantes < 0
                      ? "Produto vencido"
                      : `${diasRestantes} dias restantes`}
                  </Text>
                </View>

                {/* Exibir observações se houver */}
                {todasObservacoes[produto.id] && (
                  <View style={styles.observacaoPreview}>
                    <Text
                      style={styles.observacaoPreviewText}
                      numberOfLines={2}
                    >
                      {limitarTexto(todasObservacoes[produto.id], 50)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <Modal
        transparent={true}
        visible={showMenuModal}
        animationType="none"
        onRequestClose={() => setShowMenuModal(false)}
      >
        <TouchableOpacity
          style={styles.menuModal}
          activeOpacity={1}
          onPress={handleBackdropPress}
        >
          <Animated.View
            style={[
              styles.menuContent,
              {
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={{ width: "100%" }}
            >
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Opções</Text>
                <TouchableOpacity
                  onPress={() => setShowMenuModal(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome
                    name="close"
                    size={20}
                    color={coresCombinadas.text}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Buscar</Text>
                <View style={styles.searchInputContainer}>
                  <FontAwesome
                    name="search"
                    size={16}
                    color={coresCombinadas.textSecondary}
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar produtos..."
                    placeholderTextColor={coresCombinadas.textSecondary}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                  />
                  {searchTerm.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSearchTerm("")}
                      style={styles.clearSearchButton}
                    >
                      <FontAwesome
                        name="times-circle"
                        size={16}
                        color={coresCombinadas.textSecondary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Filtrar por Status</Text>
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filterStatus === "todos" && styles.filterOptionActive,
                      filterStatus === "todos" && {
                        borderColor: coresCombinadas.primary,
                      },
                    ]}
                    onPress={() => setFilterStatus("todos")}
                  >
                    <FontAwesome
                      name="list"
                      size={16}
                      color={
                        filterStatus === "todos"
                          ? coresCombinadas.primary
                          : coresCombinadas.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filterStatus === "todos" && {
                          color: coresCombinadas.primary,
                        },
                      ]}
                    >
                      Todos
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filterStatus === "vencidos" && styles.filterOptionActive,
                      filterStatus === "vencidos" && { borderColor: "#ff6b6b" },
                    ]}
                    onPress={() => setFilterStatus("vencidos")}
                  >
                    <FontAwesome
                      name="exclamation-circle"
                      size={16}
                      color={
                        filterStatus === "vencidos"
                          ? "#ff6b6b"
                          : coresCombinadas.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filterStatus === "vencidos" && { color: "#ff6b6b" },
                      ]}
                    >
                      Vencidos
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filterStatus === "proximos" && styles.filterOptionActive,
                      filterStatus === "proximos" && { borderColor: "#ffd93d" },
                    ]}
                    onPress={() => setFilterStatus("proximos")}
                  >
                    <FontAwesome
                      name="clock-o"
                      size={16}
                      color={
                        filterStatus === "proximos"
                          ? "#ffd93d"
                          : coresCombinadas.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filterStatus === "proximos" && { color: "#ffd93d" },
                      ]}
                    >
                      Próximos
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filterStatus === "ok" && styles.filterOptionActive,
                      filterStatus === "ok" && { borderColor: "#4CAF50" },
                    ]}
                    onPress={() => setFilterStatus("ok")}
                  >
                    <FontAwesome
                      name="check-circle"
                      size={16}
                      color={
                        filterStatus === "ok"
                          ? "#4CAF50"
                          : coresCombinadas.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filterStatus === "ok" && { color: "#4CAF50" },
                      ]}
                    >
                      Válidos
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>
                  Ordenar por Validade
                </Text>
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      sortOrder === "asc" && styles.filterOptionActive,
                      sortOrder === "asc" && {
                        borderColor: coresCombinadas.primary,
                      },
                    ]}
                    onPress={() => setSortOrder("asc")}
                  >
                    <FontAwesome
                      name="sort-amount-asc"
                      size={16}
                      color={
                        sortOrder === "asc"
                          ? coresCombinadas.primary
                          : coresCombinadas.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        sortOrder === "asc" && {
                          color: coresCombinadas.primary,
                        },
                      ]}
                    >
                      Mais próximos
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      sortOrder === "desc" && styles.filterOptionActive,
                      sortOrder === "desc" && {
                        borderColor: coresCombinadas.primary,
                      },
                    ]}
                    onPress={() => setSortOrder("desc")}
                  >
                    <FontAwesome
                      name="sort-amount-desc"
                      size={16}
                      color={
                        sortOrder === "desc"
                          ? coresCombinadas.primary
                          : coresCombinadas.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        sortOrder === "desc" && {
                          color: coresCombinadas.primary,
                        },
                      ]}
                    >
                      Mais distantes
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Tema</Text>
                <View style={styles.themeOptions}>
                  <TouchableOpacity
                    style={styles.menuOptionButton}
                    onPress={toggleTheme}
                  >
                    <FontAwesome
                      name={isDark ? "sun-o" : "moon-o"}
                      size={16}
                      color={coresCombinadas.text}
                    />
                    <Text style={styles.menuOptionText}>
                      {isDark
                        ? "Mudar para Tema Claro"
                        : "Mudar para Tema Escuro"}
                    </Text>
                  </TouchableOpacity>

                  {!usingSystemTheme && (
                    <TouchableOpacity
                      style={styles.menuOptionButton}
                      onPress={resetToSystemTheme}
                    >
                      <FontAwesome
                        name="refresh"
                        size={16}
                        color={coresCombinadas.text}
                      />
                      <Text style={styles.menuOptionText}>
                        Usar Tema do Sistema
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.applyButtonContainer}>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => setShowMenuModal(false)}
                >
                  <Text style={styles.applyButtonText}>Aplicar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Produto</Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <FontAwesome
                  name="times"
                  size={24}
                  color={coresCombinadas.text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome do Produto</Text>
              <TextInput
                style={styles.input}
                value={nomeProduto}
                onChangeText={handleNomeProdutoChange}
                placeholder="Digite o nome do produto"
                placeholderTextColor={coresCombinadas.textSecondary}
              />

              {showSuggestions && (
                <View style={styles.suggestionsContainer}>
                  <ScrollView
                    style={styles.suggestionsList}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    {filteredProdutosSugestoes.map((nome, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => selectProduto(nome)}
                      >
                        <Text style={styles.suggestionText}>{nome}</Text>
                      </TouchableOpacity>
                    ))}
                    {filteredProdutosSugestoes.length === 0 &&
                      nomeProduto.trim().length > 0 && (
                        <Text style={styles.noResultsText}>
                          Nenhum produto encontrado. Use o nome digitado.
                        </Text>
                      )}
                  </ScrollView>
                </View>
              )}
            </View>

            <Text style={styles.inputLabel}>Data de Validade</Text>
            <TouchableOpacity
              style={[
                styles.dateInput,
                { backgroundColor: cores.card, borderColor: cores.border },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={dataValidade ? styles.dateText : styles.datePlaceholder}
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

            <View style={[styles.modalButtonsContainer, { marginTop: 30 }]}>
              <TouchableOpacity
                style={{
                  backgroundColor: isDark ? "#444" : "#f0f0f0",
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  flex: 0.48,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  borderWidth: 1,
                  borderColor: isDark ? "#555" : "#ddd",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                }}
                onPress={() => {
                  setShowModal(false);
                  setNomeProduto("");
                  setDataValidade("");
                  setDate(new Date());
                }}
              >
                <Text style={{ color: cores.text, fontWeight: "bold" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: cores.primary,
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  flex: 0.48,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  borderWidth: 1,
                  borderColor: cores.primary,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                }}
                onPress={handleSaveManual}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Salvar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Observações */}
      <Modal
        visible={showObservacoesModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowObservacoesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.observacoesModalContent,
              { backgroundColor: cores.card },
            ]}
          >
            <Text style={[styles.observacoesTitle, { color: cores.text }]}>
              Observações
            </Text>

            {produtoSelecionado && (
              <View style={styles.observacoesProdutoInfo}>
                <Text
                  style={[styles.observacoesProdutoNome, { color: cores.text }]}
                >
                  {produtoSelecionado.nome}
                </Text>
                <Text
                  style={[
                    styles.observacoesProdutoData,
                    { color: cores.textSecondary },
                  ]}
                >
                  Validade: {produtoSelecionado.validade}
                </Text>
              </View>
            )}

            <TextInput
              style={[
                styles.observacoesInput,
                {
                  backgroundColor: cores.background,
                  color: cores.text,
                  borderColor: cores.border,
                },
              ]}
              value={observacao}
              onChangeText={setObservacao}
              placeholder="Digite suas observações sobre este produto..."
              placeholderTextColor={cores.textSecondary}
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
            />

            <View style={styles.observacoesButtons}>
              <TouchableOpacity
                style={[
                  styles.observacoesButton,
                  styles.observacoesCancelButton,
                  { borderColor: cores.border },
                ]}
                onPress={() => setShowObservacoesModal(false)}
              >
                <Text style={{ color: cores.text }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.observacoesButton,
                  styles.observacoesSaveButton,
                  { backgroundColor: cores.primary },
                ]}
                onPress={salvarObservacao}
              >
                <Text style={{ color: "#fff" }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Ações do Produto */}
      <Modal
        visible={showAcoesModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAcoesModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAcoesModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={[styles.acoesModalContent, { backgroundColor: cores.card }]}
          >
            <View style={styles.acoesModalHeader}>
              <Text style={[styles.acoesModalTitle, { color: cores.text }]}>
                Detalhes do Produto
              </Text>

              <TouchableOpacity
                onPress={() => setShowAcoesModal(false)}
                style={styles.closeButton}
              >
                <FontAwesome
                  name="times"
                  size={20}
                  color={cores.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {produtoSelecionado && (
              <View style={styles.produtoDetalhes}>
                <Text
                  style={[styles.produtoDetalheNome, { color: cores.text }]}
                >
                  {produtoSelecionado.nome}
                </Text>
                <Text
                  style={[
                    styles.produtoDetalheValidade,
                    { color: cores.textSecondary },
                  ]}
                >
                  Validade: {produtoSelecionado.validade}
                </Text>

                <View
                  style={[styles.divider, { backgroundColor: cores.border }]}
                />

                <Text style={[styles.observacoesLabel, { color: cores.text }]}>
                  Observações:
                </Text>

                <TextInput
                  style={[
                    styles.observacoesInput,
                    {
                      backgroundColor: cores.background,
                      color: cores.text,
                      borderColor: cores.border,
                    },
                  ]}
                  value={observacao}
                  onChangeText={setObservacao}
                  placeholder="Adicione informações importantes sobre este produto..."
                  placeholderTextColor={cores.textSecondary}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                {/* Botão de compartilhar */}
                <TouchableOpacity
                  style={{
                    backgroundColor: "#25D366",
                    borderRadius: 10,
                    paddingVertical: 15,
                    paddingHorizontal: 15,
                    marginTop: 20,
                    marginBottom: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                  onPress={compartilharProdutoUnico}
                >
                  <FontAwesome
                    name="whatsapp"
                    size={22}
                    color="#fff"
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Compartilhar via WhatsApp
                  </Text>
                </TouchableOpacity>

                <View style={[styles.acaoButtonsRow, { marginTop: 10 }]}>
                  <TouchableOpacity
                    style={[
                      styles.acaoButton,
                      styles.acaoDeleteButton,
                      { backgroundColor: cores.danger },
                    ]}
                    onPress={() => {
                      Alert.alert(
                        "Confirmar Exclusão",
                        "Tem certeza que deseja excluir este produto?",
                        [
                          {
                            text: "Cancelar",
                            style: "cancel",
                          },
                          {
                            text: "Excluir",
                            style: "destructive",
                            onPress: () => {
                              if (produtoSelecionado) {
                                removerProduto(produtoSelecionado.id);
                                setShowAcoesModal(false);
                              }
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <FontAwesome name="trash" size={16} color="#fff" />
                    <Text style={styles.acaoButtonText}>Excluir</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.acaoButton,
                      styles.acaoSaveButton,
                      { backgroundColor: cores.primary },
                    ]}
                    onPress={salvarObservacao}
                  >
                    <FontAwesome name="save" size={16} color="#fff" />
                    <Text style={styles.acaoButtonText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal de Compartilhamento */}
      <Modal
        visible={showCompartilharModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCompartilharModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.compartilharModalContent}>
            <Text style={styles.compartilharModalTitle}>
              Compartilhar Produtos
            </Text>

            <Text style={styles.compartilharModalSubtitle}>
              Selecione quais produtos deseja compartilhar via WhatsApp:
            </Text>

            <View style={styles.compartilharOptions}>
              <Text style={styles.compartilharOptionTitle}>Filtrar por:</Text>

              <TouchableOpacity
                style={[
                  styles.compartilharOption,
                  tipoCompartilhamento === "todos" &&
                    styles.compartilharOptionActive,
                  tipoCompartilhamento === "todos" && {
                    borderColor: cores.primary,
                  },
                ]}
                onPress={() => setTipoCompartilhamento("todos")}
              >
                <FontAwesome
                  name="list"
                  size={18}
                  color={
                    tipoCompartilhamento === "todos"
                      ? cores.primary
                      : cores.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.compartilharOptionText,
                    tipoCompartilhamento === "todos" && {
                      color: cores.primary,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Todos os produtos ({produtosFiltrados.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.compartilharOption,
                  tipoCompartilhamento === "vencidos" &&
                    styles.compartilharOptionActive,
                  tipoCompartilhamento === "vencidos" && {
                    borderColor: cores.danger,
                  },
                ]}
                onPress={() => setTipoCompartilhamento("vencidos")}
              >
                <FontAwesome
                  name="exclamation-circle"
                  size={18}
                  color={
                    tipoCompartilhamento === "vencidos"
                      ? cores.danger
                      : cores.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.compartilharOptionText,
                    tipoCompartilhamento === "vencidos" && {
                      color: cores.danger,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Produtos vencidos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.compartilharOption,
                  tipoCompartilhamento === "proximos7" &&
                    styles.compartilharOptionActive,
                  tipoCompartilhamento === "proximos7" && {
                    borderColor: cores.warning,
                  },
                ]}
                onPress={() => setTipoCompartilhamento("proximos7")}
              >
                <FontAwesome
                  name="clock-o"
                  size={18}
                  color={
                    tipoCompartilhamento === "proximos7"
                      ? cores.warning
                      : cores.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.compartilharOptionText,
                    tipoCompartilhamento === "proximos7" && {
                      color: cores.warning,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Próximos 7 dias
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.compartilharOption,
                  tipoCompartilhamento === "proximos15" &&
                    styles.compartilharOptionActive,
                  tipoCompartilhamento === "proximos15" && {
                    borderColor: cores.warning,
                  },
                ]}
                onPress={() => setTipoCompartilhamento("proximos15")}
              >
                <FontAwesome
                  name="calendar-check-o"
                  size={18}
                  color={
                    tipoCompartilhamento === "proximos15"
                      ? cores.warning
                      : cores.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.compartilharOptionText,
                    tipoCompartilhamento === "proximos15" && {
                      color: cores.warning,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Próximos 15 dias
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.compartilharOption,
                  tipoCompartilhamento === "proximos30" &&
                    styles.compartilharOptionActive,
                  tipoCompartilhamento === "proximos30" && {
                    borderColor: cores.warning,
                  },
                ]}
                onPress={() => setTipoCompartilhamento("proximos30")}
              >
                <FontAwesome
                  name="calendar"
                  size={18}
                  color={
                    tipoCompartilhamento === "proximos30"
                      ? cores.warning
                      : cores.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.compartilharOptionText,
                    tipoCompartilhamento === "proximos30" && {
                      color: cores.warning,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Próximos 30 dias
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.compartilharButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.compartilharButton,
                  styles.compartilharCancelButton,
                  { borderColor: cores.border },
                ]}
                onPress={() => setShowCompartilharModal(false)}
              >
                <Text style={{ color: cores.text }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.compartilharButton,
                  styles.compartilharConfirmButton,
                  { backgroundColor: "#25D366" },
                ]}
                onPress={compartilharProdutosFiltrados}
              >
                <FontAwesome
                  name="whatsapp"
                  size={18}
                  color="#fff"
                  style={styles.compartilharButtonIcon}
                />
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Compartilhar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
