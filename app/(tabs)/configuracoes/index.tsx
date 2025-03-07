import { useNotifications } from "@/hooks/useNotifications";
import {
  agendarNotificacao,
  configurarNotificacoes,
} from "@/services/notifications.config";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router/";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useProdutos } from "../../contexts/ProdutosContext";
import { useTema } from "../../contexts/TemaContext";

const ConfiguracoesScreen = () => {
  const { tema, mudarTema, cores } = useTema();
  const { scheduleProductNotification } = useNotifications();
  const { produtos } = useProdutos();
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  // Carregar estado das notificações
  useEffect(() => {
    const carregarEstadoNotificacoes = async () => {
      try {
        const estado = await AsyncStorage.getItem("@notificacoes_ativas");
        if (estado !== null) {
          setNotificacoesAtivas(estado === "true");
        }
      } catch (error) {
        console.error("Erro ao carregar estado das notificações:", error);
      }
    };

    carregarEstadoNotificacoes();
  }, []);

  // Salvar estado das notificações quando mudar
  const toggleNotificacoes = async (valor: boolean) => {
    try {
      if (valor) {
        // Solicita permissão quando ativar notificações
        await configurarNotificacoes();
      }

      setNotificacoesAtivas(valor);
      await AsyncStorage.setItem("@notificacoes_ativas", valor.toString());

      if (valor) {
        Alert.alert(
          "Notificações ativadas",
          "Você receberá notificações sobre produtos próximos do vencimento."
        );
      } else {
        Alert.alert(
          "Notificações desativadas",
          "Você não receberá mais notificações sobre produtos."
        );
      }
    } catch (error) {
      console.error("Erro ao salvar estado das notificações:", error);
      Alert.alert(
        "Erro",
        "Não foi possível ativar as notificações. Verifique as permissões do aplicativo."
      );
    }
  };

  const handleTesteNotificacao = async () => {
    const dataNotificacao = new Date(Date.now() + 10 * 1000); // 10 segundos

    try {
      await scheduleProductNotification("Produto Teste", dataNotificacao);
      alert("Notificação agendada! Você receberá em 10 segundos.");
    } catch (error) {
      alert("Erro ao agendar notificação: " + (error as Error).message);
    }
  };

  const handleTesteNotificacaoProdutos = async () => {
    if (produtos.length === 0) {
      Alert.alert(
        "Sem produtos",
        "Adicione produtos para testar as notificações."
      );
      return;
    }

    try {
      // Notificação para produtos vencendo hoje
      const mensagem =
        produtos.length === 1
          ? `O produto ${produtos[0].nome} está próximo do vencimento!`
          : `Você tem ${produtos.length} produtos próximos do vencimento!`;

      // Agenda para daqui a 5 segundos para teste
      const testeData = new Date(Date.now() + 5000);

      await agendarNotificacao(
        "Atenção: Produtos Vencendo",
        mensagem,
        testeData
      );

      Alert.alert(
        "Notificação agendada!",
        "Você receberá uma notificação em 5 segundos com os produtos."
      );
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível agendar a notificação: " + (error as Error).message
      );
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.section,
            { backgroundColor: cores.card, borderColor: cores.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: cores.textSecondary }]}>
            Notificações
          </Text>

          <View style={[styles.menuItem, { backgroundColor: cores.card }]}>
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
                Ativar Notificações
              </Text>
              <Text
                style={[
                  styles.menuItemDescription,
                  { color: cores.textSecondary },
                ]}
              >
                Receber alertas sobre produtos próximos do vencimento
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: cores.primaryLight }}
              thumbColor={notificacoesAtivas ? cores.primary : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleNotificacoes}
              value={notificacoesAtivas}
            />
          </View>

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
              <FontAwesome name="bell-o" size={24} color={cores.primary} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={[styles.menuItemTitle, { color: cores.text }]}>
                Testar Notificação Simples
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

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: cores.card }]}
            onPress={handleTesteNotificacaoProdutos}
          >
            <View
              style={[
                styles.menuItemIcon,
                { backgroundColor: cores.primaryLight },
              ]}
            >
              <FontAwesome
                name="shopping-basket"
                size={24}
                color={cores.primary}
              />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={[styles.menuItemTitle, { color: cores.text }]}>
                Testar Notificação de Produtos
              </Text>
              <Text
                style={[
                  styles.menuItemDescription,
                  { color: cores.textSecondary },
                ]}
              >
                Enviar notificação com produtos em 5 segundos
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
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
  scrollView: {
    flex: 1,
  },
});

export default ConfiguracoesScreen;
