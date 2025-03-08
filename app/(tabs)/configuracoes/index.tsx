import { useTema } from "@/app/contexts/TemaContext";
import { useNotifications } from "@/hooks/useNotifications";
import {
  desregistrarTarefaSegundoPlano,
  registrarTarefaSegundoPlano,
} from "@/services/notifications.config";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router/";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ConfiguracoesScreen = () => {
  const { tema, mudarTema, cores } = useTema();
  const { scheduleProductNotification } = useNotifications();
  const router = useRouter();
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [avisarNoDiaVencimento, setAvisarNoDiaVencimento] = useState(true);
  const [verificacaoSegundoPlano, setVerificacaoSegundoPlano] = useState(true);
  const [horarioNotificacao, setHorarioNotificacao] = useState(
    new Date().setHours(7, 0, 0, 0)
  );
  const [diasAntecedencia, setDiasAntecedencia] = useState("1");
  const [showDiasModal, setShowDiasModal] = useState(false);

  // Carregar configurações
  useEffect(() => {
    const carregarConfiguracoes = async () => {
      try {
        const estado = await AsyncStorage.getItem("@notificacoes_ativas");
        setNotificacoesAtivas(estado !== "false");

        const horarioSalvo = await AsyncStorage.getItem("@horario_notificacao");
        if (horarioSalvo) {
          setHorarioNotificacao(Number(horarioSalvo));
        }

        const diasSalvos = await AsyncStorage.getItem("@dias_antecedencia");
        if (diasSalvos) {
          setDiasAntecedencia(diasSalvos);
        }

        const avisarNoDia = await AsyncStorage.getItem("@avisar_no_dia");
        setAvisarNoDiaVencimento(avisarNoDia !== "false");

        const verificacaoSegundoPlanoSalva = await AsyncStorage.getItem(
          "@verificacao_segundo_plano"
        );
        setVerificacaoSegundoPlano(verificacaoSegundoPlanoSalva !== "false");
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };
    carregarConfiguracoes();
  }, []);

  // Salvar estado das notificações
  const toggleNotificacoes = async (value: boolean) => {
    try {
      await AsyncStorage.setItem("@notificacoes_ativas", value.toString());
      setNotificacoesAtivas(value);
      if (value) {
        Alert.alert(
          "Notificações Ativadas",
          "Você receberá alertas sobre produtos próximos do vencimento."
        );
      } else {
        Alert.alert(
          "Notificações Desativadas",
          "Você não receberá mais alertas sobre produtos."
        );
      }
    } catch (error) {
      console.error("Erro ao salvar estado das notificações:", error);
      Alert.alert("Erro", "Não foi possível salvar sua preferência.");
    }
  };

  const toggleAvisarNoDia = async (value: boolean) => {
    try {
      await AsyncStorage.setItem("@avisar_no_dia", value.toString());
      setAvisarNoDiaVencimento(value);
      Alert.alert(
        value ? "Aviso Ativado" : "Aviso Desativado",
        value
          ? "Você receberá alertas no dia do vencimento dos produtos."
          : "Você não receberá mais alertas no dia do vencimento."
      );
    } catch (error) {
      console.error("Erro ao salvar configuração de aviso no dia:", error);
      Alert.alert("Erro", "Não foi possível salvar sua preferência.");
    }
  };

  // Toggle verificação em segundo plano
  const toggleVerificacaoSegundoPlano = async (value: boolean) => {
    setVerificacaoSegundoPlano(value);
    await AsyncStorage.setItem("@verificacao_segundo_plano", value.toString());

    try {
      if (value) {
        // Registrar tarefa em segundo plano
        const sucesso = await registrarTarefaSegundoPlano();
        if (sucesso) {
          Alert.alert(
            "Verificação em Segundo Plano Ativada",
            "O aplicativo verificará periodicamente seus produtos mesmo quando estiver fechado."
          );
        } else {
          // Se falhou ao registrar, reverte a configuração
          setVerificacaoSegundoPlano(false);
          await AsyncStorage.setItem("@verificacao_segundo_plano", "false");
          Alert.alert(
            "Erro ao Ativar",
            "Não foi possível ativar a verificação em segundo plano. Tente novamente mais tarde."
          );
        }
      } else {
        // Desregistrar tarefa em segundo plano
        await desregistrarTarefaSegundoPlano();
        Alert.alert(
          "Verificação em Segundo Plano Desativada",
          "O aplicativo não verificará seus produtos quando estiver fechado."
        );
      }
    } catch (error) {
      console.error("Erro ao configurar tarefa em segundo plano:", error);
      // Reverte a configuração em caso de erro
      setVerificacaoSegundoPlano(!value);
      await AsyncStorage.setItem(
        "@verificacao_segundo_plano",
        (!value).toString()
      );
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao configurar a verificação em segundo plano."
      );
    }
  };

  // Função para formatar hora
  const formatarHora = (date: Date | number) => {
    const hora = new Date(date);
    return hora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Função para mudar horário da notificação
  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      try {
        const timestamp = selectedDate.getTime();
        await AsyncStorage.setItem(
          "@horario_notificacao",
          timestamp.toString()
        );
        setHorarioNotificacao(timestamp);
        Alert.alert(
          "Horário Atualizado",
          `As notificações serão enviadas às ${formatarHora(timestamp)}`
        );
      } catch (error) {
        console.error("Erro ao salvar horário:", error);
        Alert.alert("Erro", "Não foi possível salvar o horário.");
      }
    }
  };

  const salvarDiasAntecedencia = async (dias: string) => {
    try {
      const diasNum = parseInt(dias);
      if (isNaN(diasNum) || diasNum < 1 || diasNum > 30) {
        Alert.alert("Erro", "Por favor, insira um número entre 1 e 30");
        return;
      }

      await AsyncStorage.setItem("@dias_antecedencia", dias);
      setDiasAntecedencia(dias);
      setShowDiasModal(false);
      Alert.alert(
        "Configuração Salva",
        `Você será notificado ${dias} dia(s) antes do vencimento dos produtos.`
      );
    } catch (error) {
      console.error("Erro ao salvar dias de antecedência:", error);
      Alert.alert("Erro", "Não foi possível salvar sua preferência.");
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
                Notificações
              </Text>
              <Text
                style={[
                  styles.menuItemDescription,
                  { color: cores.textSecondary },
                ]}
              >
                {notificacoesAtivas ? "Ativadas" : "Desativadas"}
              </Text>
            </View>
            <Switch
              trackColor={{ false: cores.border, true: cores.primary + "80" }}
              thumbColor={notificacoesAtivas ? cores.primary : "#f4f3f4"}
              onValueChange={toggleNotificacoes}
              value={notificacoesAtivas}
            />
          </View>

          {/* Opções de notificação visíveis apenas quando notificações estão ativas */}
          {notificacoesAtivas && (
            <>
              {/* Opção para configurar horário */}
              <TouchableOpacity
                style={[styles.menuItem, { backgroundColor: cores.card }]}
                onPress={() => setShowTimePicker(true)}
              >
                <View
                  style={[
                    styles.menuItemIcon,
                    { backgroundColor: cores.primaryLight },
                  ]}
                >
                  <FontAwesome name="clock-o" size={24} color={cores.primary} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: cores.text }]}>
                    Horário das Notificações
                  </Text>
                  <Text
                    style={[
                      styles.menuItemDescription,
                      { color: cores.textSecondary },
                    ]}
                  >
                    {formatarHora(horarioNotificacao)}
                  </Text>
                </View>
                <FontAwesome
                  name="chevron-right"
                  size={16}
                  color={cores.textSecondary}
                />
              </TouchableOpacity>

              {/* Opção para configurar dias de antecedência */}
              <TouchableOpacity
                style={[styles.menuItem, { backgroundColor: cores.card }]}
                onPress={() => setShowDiasModal(true)}
              >
                <View
                  style={[
                    styles.menuItemIcon,
                    { backgroundColor: cores.primaryLight },
                  ]}
                >
                  <FontAwesome
                    name="calendar"
                    size={24}
                    color={cores.primary}
                  />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: cores.text }]}>
                    Antecedência do Aviso
                  </Text>
                  <Text
                    style={[
                      styles.menuItemDescription,
                      { color: cores.textSecondary },
                    ]}
                  >
                    Avisar {diasAntecedencia} dia(s) antes do vencimento
                  </Text>
                </View>
                <FontAwesome
                  name="chevron-right"
                  size={16}
                  color={cores.textSecondary}
                />
              </TouchableOpacity>

              {/* Opção para ativar/desativar aviso no dia do vencimento */}
              <View style={[styles.menuItem, { backgroundColor: cores.card }]}>
                <View
                  style={[
                    styles.menuItemIcon,
                    { backgroundColor: cores.primaryLight },
                  ]}
                >
                  <FontAwesome
                    name="exclamation"
                    size={24}
                    color={cores.primary}
                  />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: cores.text }]}>
                    Aviso no Dia do Vencimento
                  </Text>
                  <Text
                    style={[
                      styles.menuItemDescription,
                      { color: cores.textSecondary },
                    ]}
                  >
                    Receber alerta no dia do vencimento
                  </Text>
                </View>
                <Switch
                  trackColor={{
                    false: cores.border,
                    true: cores.primary + "80",
                  }}
                  thumbColor={avisarNoDiaVencimento ? cores.primary : "#f4f3f4"}
                  onValueChange={toggleAvisarNoDia}
                  value={avisarNoDiaVencimento}
                />
              </View>

              {/* Verificação em segundo plano */}
              <View style={[styles.menuItem, { backgroundColor: cores.card }]}>
                <View
                  style={[
                    styles.menuItemIcon,
                    { backgroundColor: cores.primaryLight },
                  ]}
                >
                  <FontAwesome name="refresh" size={24} color={cores.primary} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: cores.text }]}>
                    Verificação em Segundo Plano
                  </Text>
                  <Text
                    style={[
                      styles.menuItemDescription,
                      { color: cores.textSecondary },
                    ]}
                  >
                    Verificar produtos mesmo com o app fechado
                  </Text>
                </View>
                <Switch
                  trackColor={{
                    false: cores.border,
                    true: cores.primary + "80",
                  }}
                  thumbColor={
                    verificacaoSegundoPlano ? cores.primary : "#f4f3f4"
                  }
                  onValueChange={toggleVerificacaoSegundoPlano}
                  value={verificacaoSegundoPlano}
                />
              </View>
            </>
          )}
        </View>

        <Modal
          visible={showDiasModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDiasModal(false)}
        >
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            ]}
          >
            <View
              style={[styles.modalContent, { backgroundColor: cores.card }]}
            >
              <Text style={[styles.modalTitle, { color: cores.text }]}>
                Dias de Antecedência
              </Text>
              <Text
                style={[
                  styles.modalDescription,
                  { color: cores.textSecondary },
                ]}
              >
                Quantos dias antes do vencimento você quer ser notificado?
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: cores.background,
                    color: cores.text,
                    borderColor: cores.border,
                  },
                ]}
                keyboardType="number-pad"
                value={diasAntecedencia}
                onChangeText={setDiasAntecedencia}
                placeholder="Digite o número de dias"
                placeholderTextColor={cores.textSecondary}
                maxLength={2}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: cores.danger },
                  ]}
                  onPress={() => setShowDiasModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: cores.success },
                  ]}
                  onPress={() => salvarDiasAntecedencia(diasAntecedencia)}
                >
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {showTimePicker && (
          <DateTimePicker
            value={new Date(horarioNotificacao)}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )}

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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
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
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ConfiguracoesScreen;
