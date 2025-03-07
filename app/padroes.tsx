import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PadraoEtiqueta } from "./contexts/PadroesContext";

export default function PadroesScreen() {
  const [padroes, setPadroes] = useState<PadraoEtiqueta[]>([]);

  useEffect(() => {
    carregarPadroes();
  }, []);

  const carregarPadroes = async () => {
    try {
      const padroesSalvos = await AsyncStorage.getItem("@padroes_etiquetas");
      if (padroesSalvos) {
        setPadroes(JSON.parse(padroesSalvos));
      }
    } catch (error) {
      console.error("Erro ao carregar padrões:", error);
      Alert.alert("Erro", "Não foi possível carregar os padrões salvos");
    }
  };

  const removerPadrao = async (id: string) => {
    try {
      const novosPadroes = padroes.filter((padrao) => padrao.id !== id);
      await AsyncStorage.setItem(
        "@padroes_etiquetas",
        JSON.stringify(novosPadroes)
      );
      setPadroes(novosPadroes);
      Alert.alert("Sucesso", "Padrão removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover padrão:", error);
      Alert.alert("Erro", "Não foi possível remover o padrão");
    }
  };

  const renderItem = ({ item }: { item: PadraoEtiqueta }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTipo}>{item.nome}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Palavras-chave:</Text>
          <Text style={styles.infoValue}>
            {item.configuracao.palavrasChave.join(", ")}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Palavras ignoradas:</Text>
          <Text style={styles.infoValue}>
            {item.configuracao.palavrasIgnoradas.join(", ")}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Padrões de data:</Text>
          <Text style={styles.infoValue}>
            {item.configuracao.padroesData.join(", ")}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Usos: {item.totalUsos} | Taxa de acerto: {item.taxaAcerto}%
          </Text>
          <Text style={styles.statsText}>
            Criado em: {new Date(item.criadoEm).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.botaoRemover}
        onPress={() => removerPadrao(item.id)}
      >
        <FontAwesome name="trash" size={20} color="#fa5252" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Padrões Salvos",
          headerShown: true,
          presentation: "modal",
        }}
      />

      {padroes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="tags" size={60} color="#868e96" />
          <Text style={styles.emptyText}>Nenhum padrão salvo ainda</Text>
        </View>
      ) : (
        <FlatList
          data={padroes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
  },
  itemTipo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#228be6",
    marginBottom: 12,
  },
  infoContainer: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#343a40",
  },
  statsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
  },
  statsText: {
    fontSize: 12,
    color: "#868e96",
    marginBottom: 2,
  },
  botaoRemover: {
    padding: 8,
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#868e96",
    marginTop: 16,
    textAlign: "center",
  },
});
