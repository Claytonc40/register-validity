import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTema } from "../contexts/TemaContext";

export default function ConfiguracoesScreen() {
  const { tema, mudarTema, cores } = useTema();

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
      marginTop: 40,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: cores.primaryLight,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: cores.text,
      marginLeft: 12,
    },
    section: {
      marginTop: 24,
      backgroundColor: cores.card,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: cores.border,
      paddingVertical: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: cores.textSecondary,
      marginLeft: 16,
      marginBottom: 8,
      textTransform: "uppercase",
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: cores.card,
    },
    menuItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: cores.primaryLight,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    menuItemContent: {
      flex: 1,
      marginRight: 12,
    },
    menuItemTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: cores.text,
      marginBottom: 4,
    },
    menuItemDescription: {
      fontSize: 14,
      color: cores.textSecondary,
    },
    menuItemSelected: {
      backgroundColor: cores.primaryLight,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <FontAwesome name="cog" size={24} color={cores.primary} />
          </View>
          <Text style={styles.headerTitle}>Configurações</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aparência</Text>

        <TouchableOpacity
          style={[styles.menuItem, tema === "light" && styles.menuItemSelected]}
          onPress={() => mudarTema("light")}
        >
          <View style={styles.menuItemIcon}>
            <FontAwesome name="sun-o" size={24} color={cores.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Tema Claro</Text>
            <Text style={styles.menuItemDescription}>
              Usar tema claro no aplicativo
            </Text>
          </View>
          {tema === "light" && (
            <FontAwesome name="check" size={16} color={cores.primary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, tema === "dark" && styles.menuItemSelected]}
          onPress={() => mudarTema("dark")}
        >
          <View style={styles.menuItemIcon}>
            <FontAwesome name="moon-o" size={24} color={cores.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Tema Escuro</Text>
            <Text style={styles.menuItemDescription}>
              Usar tema escuro no aplicativo
            </Text>
          </View>
          {tema === "dark" && (
            <FontAwesome name="check" size={16} color={cores.primary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.menuItem,
            tema === "system" && styles.menuItemSelected,
          ]}
          onPress={() => mudarTema("system")}
        >
          <View style={styles.menuItemIcon}>
            <FontAwesome name="mobile" size={24} color={cores.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Sistema</Text>
            <Text style={styles.menuItemDescription}>
              Usar o tema do sistema
            </Text>
          </View>
          {tema === "system" && (
            <FontAwesome name="check" size={16} color={cores.primary} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reconhecimento de Etiquetas</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/treinamento")}
        >
          <View style={styles.menuItemIcon}>
            <FontAwesome
              name="graduation-cap"
              size={24}
              color={cores.primary}
            />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Treinar Reconhecimento</Text>
            <Text style={styles.menuItemDescription}>
              Ensine o app a reconhecer melhor suas etiquetas
            </Text>
          </View>
          <FontAwesome
            name="chevron-right"
            size={16}
            color={cores.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/padroes")}
        >
          <View style={styles.menuItemIcon}>
            <FontAwesome name="list" size={24} color={cores.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Padrões Salvos</Text>
            <Text style={styles.menuItemDescription}>
              Gerenciar padrões de etiquetas salvos
            </Text>
          </View>
          <FontAwesome
            name="chevron-right"
            size={16}
            color={cores.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemIcon}>
            <FontAwesome name="info-circle" size={24} color={cores.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Sobre o App</Text>
            <Text style={styles.menuItemDescription}>Versão 1.0.0</Text>
          </View>
          <FontAwesome
            name="chevron-right"
            size={16}
            color={cores.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 40,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e7f5ff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343a40",
    marginLeft: 12,
  },
  section: {
    marginTop: 24,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#868e96",
    marginLeft: 16,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e7f5ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#343a40",
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#868e96",
  },
  menuItemSelected: {
    backgroundColor: "#e7f5ff",
  },
});
