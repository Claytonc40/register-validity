import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useProdutos } from "../contexts/ProdutosContext";
import { useTema } from "../contexts/TemaContext";

export default function HomeScreen() {
  const { produtos, carregarProdutos, removerProduto, adicionarProduto } =
    useProdutos();
  const { cores } = useTema();
  const [showModal, setShowModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [nomeProduto, setNomeProduto] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const styles = StyleSheet.create({
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
    menuButton: {
      padding: 8,
    },
    menuModal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "flex-start",
      alignItems: "flex-end",
    },
    menuContent: {
      backgroundColor: cores.card,
      width: "80%",
      height: "100%",
      padding: 20,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      transform: [{ translateX: 0 }],
      paddingBottom: 40,
    },
    menuHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    menuTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: cores.text,
    },
    closeButton: {
      padding: 8,
    },
    searchInput: {
      backgroundColor: cores.background,
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
      color: cores.text,
    },
    filterSection: {
      marginBottom: 20,
    },
    filterTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: cores.text,
      marginBottom: 10,
    },
    filterOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    filterOptionSelected: {
      backgroundColor: cores.primary + "20",
    },
    filterOptionText: {
      marginLeft: 10,
      color: cores.text,
    },
    filterOptionTextSelected: {
      color: cores.primary,
      fontWeight: "600",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: cores.text,
      marginBottom: 10,
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
    fabButton: {
      position: "absolute",
      right: 20,
      bottom: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: cores.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: cores.card,
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
      color: cores.text,
      textAlign: "center",
    },
    input: {
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      marginBottom: 16,
      backgroundColor: cores.background,
      color: cores.text,
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
      backgroundColor: cores.danger,
    },
    saveButton: {
      backgroundColor: cores.success,
    },
    modalButtonText: {
      color: "#fff",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 16,
    },
    dateInput: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingRight: 12,
    },
    dateText: {
      fontSize: 16,
      color: cores.text,
    },
    datePlaceholder: {
      fontSize: 16,
      color: cores.textSecondary,
    },
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    if (showMenuModal) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 400,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showMenuModal]);

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

  const filteredProdutos = produtos.filter((produto) => {
    const matchesSearch = produto.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const diasRestantes = calcularDiasRestantes(produto.validade);

    if (filterStatus === "vencidos") return matchesSearch && diasRestantes < 0;
    if (filterStatus === "proximos")
      return matchesSearch && diasRestantes >= 0 && diasRestantes <= 30;
    if (filterStatus === "ok") return matchesSearch && diasRestantes > 30;
    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Produtos Cadastrados</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenuModal(true)}
        >
          <FontAwesome name="ellipsis-v" size={20} color={cores.text} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredProdutos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome name="inbox" size={50} color={cores.textSecondary} />
            <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
            <Text style={styles.emptySubtext}>
              Tire uma foto do produto para começar a monitorar
            </Text>
          </View>
        ) : (
          filteredProdutos.map((produto) => {
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
                  <FontAwesome name="trash" size={20} color={cores.danger} />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={showMenuModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowMenuModal(false)}
      >
        <Animated.View
          style={[
            styles.menuModal,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.menuContent,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Filtros e Busca</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowMenuModal(false)}
              >
                <FontAwesome name="close" size={20} color={cores.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar produtos..."
              placeholderTextColor={cores.textSecondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Status</Text>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filterStatus === "todos" && styles.filterOptionSelected,
                ]}
                onPress={() => setFilterStatus("todos")}
              >
                <FontAwesome
                  name="circle"
                  size={16}
                  color={
                    filterStatus === "todos"
                      ? cores.primary
                      : cores.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    filterStatus === "todos" && styles.filterOptionTextSelected,
                  ]}
                >
                  Todos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filterStatus === "vencidos" && styles.filterOptionSelected,
                ]}
                onPress={() => setFilterStatus("vencidos")}
              >
                <FontAwesome
                  name="circle"
                  size={16}
                  color={
                    filterStatus === "vencidos"
                      ? "#ff6b6b"
                      : cores.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    filterStatus === "vencidos" &&
                      styles.filterOptionTextSelected,
                  ]}
                >
                  Vencidos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filterStatus === "proximos" && styles.filterOptionSelected,
                ]}
                onPress={() => setFilterStatus("proximos")}
              >
                <FontAwesome
                  name="circle"
                  size={16}
                  color={
                    filterStatus === "proximos"
                      ? "#ffd93d"
                      : cores.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    filterStatus === "proximos" &&
                      styles.filterOptionTextSelected,
                  ]}
                >
                  Próximos do Vencimento
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filterStatus === "ok" && styles.filterOptionSelected,
                ]}
                onPress={() => setFilterStatus("ok")}
              >
                <FontAwesome
                  name="circle"
                  size={16}
                  color={
                    filterStatus === "ok" ? "#4CAF50" : cores.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    filterStatus === "ok" && styles.filterOptionTextSelected,
                  ]}
                >
                  Dentro da Validade
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => setShowModal(true)}
      >
        <FontAwesome name="plus" size={16} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Adicionar Produto</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do Produto"
              placeholderTextColor={cores.textSecondary}
              value={nomeProduto}
              onChangeText={setNomeProduto}
            />

            <TouchableOpacity
              style={[styles.input, styles.dateInput]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={dataValidade ? styles.dateText : styles.datePlaceholder}
              >
                {dataValidade || "Selecione a Data de Validade"}
              </Text>
              <FontAwesome
                name="calendar"
                size={20}
                color={cores.textSecondary}
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            <View style={styles.modalButtons}>
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
