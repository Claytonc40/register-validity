import { useProdutos } from "@/app/contexts/ProdutosContext";
import { useTema } from "@/app/contexts/TemaContext";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
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
              <View key={produto.id} style={styles.produtoCard}>
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
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removerProduto(produto.id)}
                >
                  <FontAwesome
                    name="trash"
                    size={20}
                    color={coresCombinadas.danger}
                  />
                </TouchableOpacity>
              </View>
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
              style={styles.dateInput}
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

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowModal(false);
                  setNomeProduto("");
                  setDataValidade("");
                  setDate(new Date());
                }}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveManual}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

