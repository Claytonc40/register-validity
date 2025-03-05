import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MlkitOcr from "react-native-mlkit-ocr";
import { RegionSelector } from "./components/RegionSelector";
import { RegiaoEtiqueta, usePadroes } from "./contexts/PadroesContext";

type Etapa = "inicial" | "captura" | "nome" | "regioes" | "confirmacao";

export default function TreinamentoScreen() {
  const [etapa, setEtapa] = useState<Etapa>("inicial");
  const [imagem, setImagem] = useState<string | null>(null);
  const [nomePadrao, setNomePadrao] = useState("");
  const [regioes, setRegioes] = useState<{
    nomeProduto?: RegiaoEtiqueta;
    dataValidade?: RegiaoEtiqueta;
  }>({});
  const [textoReconhecido, setTextoReconhecido] = useState<{
    nome: string;
    data: string;
  }>({ nome: "", data: "" });

  const { adicionarPadrao } = usePadroes();

  const iniciarTreinamento = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
      setEtapa("nome");
    }
  };

  const handleRegionSelected = (
    tipo: "nomeProduto" | "dataValidade",
    regiao: RegiaoEtiqueta,
  ) => {
    setRegioes((prev) => ({ ...prev, [tipo]: regiao }));

    // Se já selecionou ambas as regiões, vai para confirmação
    if (tipo === "dataValidade" || regioes.dataValidade) {
      processarRegioes();
    }
  };

  const processarRegioes = async () => {
    if (!imagem || !regioes.nomeProduto || !regioes.dataValidade) return;

    try {
      const resultado = await MlkitOcr.detectFromUri(imagem);

      if (resultado && resultado.length > 0) {
        const textoCompleto = resultado.map((block) => block.text).join("\n");

        // Aqui você implementaria a lógica para extrair o texto das regiões específicas
        // Por enquanto, vamos usar todo o texto reconhecido
        setTextoReconhecido({
          nome: textoCompleto.split("\n")[0] || "",
          data: textoCompleto.split("\n")[1] || "",
        });
      }

      setEtapa("confirmacao");
    } catch (error) {
      console.error("Erro ao processar texto:", error);
      Alert.alert("Erro", "Houve um erro ao processar o texto da imagem");
    }
  };

  const salvarPadrao = async () => {
    if (!imagem || !regioes.nomeProduto || !regioes.dataValidade) return;

    try {
      await adicionarPadrao({
        nome: nomePadrao,
        regioes: {
          nomeProduto: regioes.nomeProduto,
          dataValidade: regioes.dataValidade,
        },
        exemplos: [
          {
            imagem,
            textoNome: textoReconhecido.nome,
            textoData: textoReconhecido.data,
            confianca: 1,
          },
        ],
      });

      Alert.alert("Sucesso", "Padrão salvo com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            // Resetar estado
            setEtapa("inicial");
            setImagem(null);
            setNomePadrao("");
            setRegioes({});
            setTextoReconhecido({ nome: "", data: "" });
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar padrão:", error);
      Alert.alert("Erro", "Houve um erro ao salvar o padrão");
    }
  };

  const renderEtapa = () => {
    switch (etapa) {
      case "inicial":
        return (
          <View style={styles.inicialContainer}>
            <FontAwesome name="graduation-cap" size={60} color="#228be6" />
            <Text style={styles.titulo}>Treinar Reconhecimento</Text>
            <Text style={styles.descricao}>
              Tire uma foto de uma etiqueta e marque onde estão as informações
              importantes. Isso ajudará o app a reconhecer melhor as etiquetas
              no futuro.
            </Text>
            <TouchableOpacity
              style={styles.botaoIniciar}
              onPress={iniciarTreinamento}
            >
              <Text style={styles.botaoTexto}>Começar Treinamento</Text>
            </TouchableOpacity>
          </View>
        );

      case "nome":
        return (
          <View style={styles.nomeContainer}>
            <Text style={styles.titulo}>Nome do Padrão</Text>
            <Text style={styles.descricao}>
              Dê um nome para este padrão de etiqueta (ex: "Etiqueta
              McDonald's", "Feijão Preto")
            </Text>
            <TextInput
              style={styles.input}
              value={nomePadrao}
              onChangeText={setNomePadrao}
              placeholder="Nome do padrão"
            />
            <TouchableOpacity
              style={styles.botaoProsseguir}
              onPress={() => setEtapa("regioes")}
              disabled={!nomePadrao.trim()}
            >
              <Text style={styles.botaoTexto}>Prosseguir</Text>
            </TouchableOpacity>
          </View>
        );

      case "regioes":
        return (
          <View style={styles.regioesContainer}>
            {!regioes.nomeProduto ? (
              <RegionSelector
                imagem={imagem!}
                tipoRegiao="nomeProduto"
                onRegionSelected={(regiao) =>
                  handleRegionSelected("nomeProduto", regiao)
                }
              />
            ) : !regioes.dataValidade ? (
              <RegionSelector
                imagem={imagem!}
                tipoRegiao="dataValidade"
                onRegionSelected={(regiao) =>
                  handleRegionSelected("dataValidade", regiao)
                }
              />
            ) : null}
          </View>
        );

      case "confirmacao":
        return (
          <View style={styles.confirmacaoContainer}>
            <Text style={styles.titulo}>Confirmar Informações</Text>

            <View style={styles.previewContainer}>
              <Image source={{ uri: imagem! }} style={styles.previewImage} />

              <View style={styles.infoContainer}>
                <Text style={styles.label}>Nome do Padrão:</Text>
                <Text style={styles.valor}>{nomePadrao}</Text>

                <Text style={styles.label}>Texto Reconhecido:</Text>
                <Text style={styles.valor}>Nome: {textoReconhecido.nome}</Text>
                <Text style={styles.valor}>Data: {textoReconhecido.data}</Text>
              </View>
            </View>

            <View style={styles.botoesContainer}>
              <TouchableOpacity
                style={[styles.botao, styles.botaoCancelar]}
                onPress={() => setEtapa("regioes")}
              >
                <Text style={styles.botaoTexto}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botao, styles.botaoConfirmar]}
                onPress={salvarPadrao}
              >
                <Text style={styles.botaoTexto}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Treinar Reconhecimento",
          headerShown: true,
        }}
      />
      {renderEtapa()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  inicialContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343a40",
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  descricao: {
    fontSize: 16,
    color: "#868e96",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  botaoIniciar: {
    backgroundColor: "#228be6",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  botaoTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  nomeContainer: {
    flex: 1,
    padding: 24,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  botaoProsseguir: {
    backgroundColor: "#228be6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  regioesContainer: {
    flex: 1,
    padding: 16,
  },
  confirmacaoContainer: {
    flex: 1,
    padding: 24,
  },
  previewContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#868e96",
  },
  valor: {
    fontSize: 16,
    color: "#343a40",
    marginBottom: 8,
  },
  botoesContainer: {
    flexDirection: "row",
    gap: 12,
  },
  botao: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  botaoCancelar: {
    backgroundColor: "#fa5252",
  },
  botaoConfirmar: {
    backgroundColor: "#40c057",
  },
});
