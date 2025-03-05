// import { useNotifications } from "@/hooks/useNotifications";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router/";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTema } from "../../contexts/TemaContext";

const ConfiguracoesScreen = () => {
  const { tema, mudarTema, cores } = useTema();
  // const { scheduleProductNotification } = useNotifications();

  const handleTesteNotificacao = async () => {
    const dataAtual = new Date();
    const dataNotificacao = new Date(dataAtual.getTime() + 10000); // 10 segundos no futuro

    try {
      // await scheduleProductNotification("Produto Teste", dataNotificacao);
      alert("Notificação agendada! Você receberá em 10 segundos.");
    } catch (error) {
      alert("Erro ao agendar notificação: " + (error as Error).message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: cores.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: cores.card, borderBottomColor: cores.border },
        ]}
      >
        <View style={styles.headerContent}>
          <View
            style={[styles.headerIcon, { backgroundColor: cores.primaryLight }]}
          >
            <FontAwesome name="cog" size={24} color={cores.primary} />
          </View>
          <Text style={[styles.headerTitle, { color: cores.text }]}>
            Configurações
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: cores.card, borderColor: cores.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: cores.textSecondary }]}>
          Notificações
        </Text>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: cores.card }]}
          onPress={handleTesteNotificacao}
        >
          <View
            style={[
              styles.menuItemIcon,
              { backgroundColor: cores.primaryLight },
            ]}
          >
            <FontAwesome name="bell" size={24} color={cores.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={[styles.menuItemTitle, { color: cores.text }]}>
              Testar Notificações
            </Text>
            <Text
              style={[
                styles.menuItemDescription,
                { color: cores.textSecondary },
              ]}
            >
              Enviar uma notificação de teste em 10 segundos
            </Text>
          </View>
          <FontAwesome
            name="chevron-right"
            size={16}
            color={cores.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: cores.card, borderColor: cores.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: cores.textSecondary }]}>
          Aparência
        </Text>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: cores.card }]}
          onPress={() => mudarTema("light")}
        >
          <View
            style={[
              styles.menuItemIcon,
              { backgroundColor: cores.primaryLight },
            ]}
          >
            <FontAwesome name="sun-o" size={24} color={cores.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={[styles.menuItemTitle, { color: cores.text }]}>
              Tema Claro
            </Text>
            <Text
              style={[
                styles.menuItemDescription,
                { color: cores.textSecondary },
              ]}
            >
              Usar tema claro no aplicativo
            </Text>
          </View>
          {tema === "light" && (
            <FontAwesome name="check" size={16} color={cores.primary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: cores.card }]}
          onPress={() => mudarTema("dark")}
        >
          <View
            style={[
              styles.menuItemIcon,
              { backgroundColor: cores.primaryLight },
            ]}
          >
            <FontAwesome name="moon-o" size={24} color={cores.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={[styles.menuItemTitle, { color: cores.text }]}>
              Tema Escuro
            </Text>
            <Text
              style={[
                styles.menuItemDescription,
                { color: cores.textSecondary },
              ]}
            >
              Usar tema escuro no aplicativo
            </Text>
          </View>
          {tema === "dark" && (
            <FontAwesome name="check" size={16} color={cores.primary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: cores.card }]}
          onPress={() => mudarTema("system")}
        >
          <View
            style={[
              styles.menuItemIcon,
              { backgroundColor: cores.primaryLight },
            ]}
          >
            <FontAwesome name="mobile" size={24} color={cores.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={[styles.menuItemTitle, { color: cores.text }]}>
              Sistema
            </Text>
            <Text
              style={[
                styles.menuItemDescription,
                { color: cores.textSecondary },
              ]}
            >
              Usar o tema do sistema
            </Text>
          </View>
          {tema === "system" && (
            <FontAwesome name="check" size={16} color={cores.primary} />
          )}
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: cores.card, borderColor: cores.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: cores.textSecondary }]}>
          Reconhecimento de Etiquetas
        </Text>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: cores.card }]}
          onPress={() => router.push("/treinamento")}
        >
          <View
            style={[
              styles.menuItemIcon,
              { backgroundColor: cores.primaryLight },
            ]}
          >
            <FontAwesome
              name="graduation-cap"
              size={24}
              color={cores.primary}
            />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={[styles.menuItemTitle, { color: cores.text }]}>
              Treinar Reconhecimento
            </Text>
            <Text
              style={[
                styles.menuItemDescription,
                { color: cores.textSecondary },
              ]}
            >
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
          style={[styles.menuItem, { backgroundColor: cores.card }]}
          onPress={() => router.push("/padroes")}
        >
          <View
            style={[
              styles.menuItemIcon,
              { backgroundColor: cores.primaryLight },
            ]}
          >
            <FontAwesome name="list" size={24} color={cores.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={[styles.menuItemTitle, { color: cores.text }]}>
              Padrões Salvos
            </Text>
            <Text
              style={[
                styles.menuItemDescription,
                { color: cores.textSecondary },
              ]}
            >
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

      <View
        style={[
          styles.section,
          { backgroundColor: cores.card, borderColor: cores.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: cores.textSecondary }]}>
          Informações
        </Text>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: cores.card }]}
        >
          <View
            style={[
              styles.menuItemIcon,
              { backgroundColor: cores.primaryLight },
            ]}
          >
            <FontAwesome name="info-circle" size={24} color={cores.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={[styles.menuItemTitle, { color: cores.text }]}>
              Sobre o App
            </Text>
            <Text
              style={[
                styles.menuItemDescription,
                { color: cores.textSecondary },
              ]}
            >
              Versão 1.0.0
            </Text>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 12,
  },
  section: {
    marginTop: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 16,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
  },
});

export default ConfiguracoesScreen;
