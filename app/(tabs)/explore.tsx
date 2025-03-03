import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  getDaysRemaining,
  isExpired,
  isNearExpiry,
} from "../../constants/Products";

export default function ExploreScreen() {
  // Exemplo de datas para explicação
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sobre o Aplicativo</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.subtitle}>O que é o Controle de Validade?</Text>
        <Text style={styles.text}>
          Este aplicativo foi desenvolvido para ajudar você a controlar as datas
          de validade dos seus produtos, evitando desperdício e garantindo que
          você consuma seus alimentos antes que vençam.
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.subtitle}>Como usar</Text>
        <Text style={styles.text}>
          1. Na tela inicial, preencha o nome do produto e sua data de validade.
        </Text>
        <Text style={styles.text}>
          2. Toque em "Salvar Produto" para adicionar à sua lista.
        </Text>
        <Text style={styles.text}>
          3. Os produtos serão exibidos em ordem de validade, com os mais
          próximos de vencer aparecendo primeiro.
        </Text>
        <Text style={styles.text}>
          4. Produtos vencidos aparecem em vermelho, e os próximos de vencer
          (menos de 7 dias) aparecem em amarelo.
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.subtitle}>Exemplos de cálculo de validade</Text>

        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>
            Produto com validade de amanhã:
          </Text>
          <Text>Data: {tomorrow.toLocaleDateString()}</Text>
          <Text>Dias restantes: {getDaysRemaining(tomorrow)}</Text>
          <Text>
            Está próximo de vencer? {isNearExpiry(tomorrow) ? "Sim" : "Não"}
          </Text>
          <Text>Está vencido? {isExpired(tomorrow) ? "Sim" : "Não"}</Text>
        </View>

        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>
            Produto com validade para semana que vem:
          </Text>
          <Text>Data: {nextWeek.toLocaleDateString()}</Text>
          <Text>Dias restantes: {getDaysRemaining(nextWeek)}</Text>
          <Text>
            Está próximo de vencer? {isNearExpiry(nextWeek) ? "Sim" : "Não"}
          </Text>
          <Text>Está vencido? {isExpired(nextWeek) ? "Sim" : "Não"}</Text>
        </View>

        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Produto já vencido:</Text>
          <Text>Data: {lastWeek.toLocaleDateString()}</Text>
          <Text>Dias vencidos: {Math.abs(getDaysRemaining(lastWeek))}</Text>
          <Text>
            Está próximo de vencer? {isNearExpiry(lastWeek) ? "Sim" : "Não"}
          </Text>
          <Text>Está vencido? {isExpired(lastWeek) ? "Sim" : "Não"}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.subtitle}>Dicas</Text>
        <Text style={styles.text}>
          • Verifique regularmente seu aplicativo para saber quais produtos
          estão próximos de vencer.
        </Text>
        <Text style={styles.text}>
          • Quando consumir um produto, não se esqueça de removê-lo da lista.
        </Text>
        <Text style={styles.text}>
          • Seus dados são salvos localmente no dispositivo e permanecerão mesmo
          se você fechar o aplicativo.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  infoContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  exampleContainer: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
});
