import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router/";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MlkitOcr from "react-native-mlkit-ocr";
import { RegionSelector } from "./components/RegionSelector";
import { RegiaoEtiqueta, usePadroes } from "./contexts/PadroesContext";

type Etapa = "inicial" | "captura" | "configuracao" | "regioes" | "confirmacao";

interface ConfiguracaoPadrao {
  palavrasChave: string[];
  palavrasIgnoradas: string[];
  padroesData: string[];
}

export default function TreinamentoScreen() {
  const [etapa, setEtapa] = useState<Etapa>("inicial");
  const [imagem, setImagem] = useState<string | null>(null);
  const [nomePadrao, setNomePadrao] = useState("");
  const [regioes, setRegioes] = useState<{
    nomeProduto?: RegiaoEtiqueta;
    dataValidade?: RegiaoEtiqueta;
  }>({});
  const [configuracao, setConfiguracao] = useState<ConfiguracaoPadrao>({
    palavrasChave: [],
    palavrasIgnoradas: [],
    padroesData: [],
  });
  const [novaPalavraChave, setNovaPalavraChave] = useState("");
  const [novaPalavraIgnorada, setNovaPalavraIgnorada] = useState("");
  const [novoPadraoData, setNovoPadraoData] = useState("");

  const { adicionarPadrao } = usePadroes();

  const iniciarTreinamento = async () => {
    Alert.alert("Selecionar Imagem", "Escolha como deseja obter a imagem", [
      {
        text: "Câmera",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

          if (!result.canceled) {
            setImagem(result.assets[0].uri);
            setEtapa("configuracao");
          }
        },
      },
      {
        text: "Galeria",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

          if (!result.canceled) {
            setImagem(result.assets[0].uri);
            setEtapa("configuracao");
          }
        },
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  };

  const adicionarPalavraChave = () => {
    if (novaPalavraChave.trim()) {
      setConfiguracao((prev) => ({
        ...prev,
        palavrasChave: [
          ...prev.palavrasChave,
          novaPalavraChave.trim().toUpperCase(),
        ],
      }));
      setNovaPalavraChave("");
    }
  };

  const adicionarPalavraIgnorada = () => {
    if (novaPalavraIgnorada.trim()) {
      setConfiguracao((prev) => ({
        ...prev,
        palavrasIgnoradas: [
          ...prev.palavrasIgnoradas,
          novaPalavraIgnorada.trim().toUpperCase(),
        ],
      }));
      setNovaPalavraIgnorada("");
    }
  };

  const adicionarPadraoData = () => {
    if (novoPadraoData.trim()) {
      setConfiguracao((prev) => ({
        ...prev,
        padroesData: [...prev.padroesData, novoPadraoData.trim()],
      }));
      setNovoPadraoData("");
    }
  };

  const removerItem = (tipo: keyof ConfiguracaoPadrao, index: number) => {
    setConfiguracao((prev) => ({
      ...prev,
      [tipo]: prev[tipo].filter((_, i) => i !== index),
    }));
  };

  const handleRegionSelected = (
    tipo: "nomeProduto" | "dataValidade",
    regiao: RegiaoEtiqueta
  ) => {
    const regiaoAjustada = {
      ...regiao,
      x: Math.max(0, Math.min(100, regiao.x)),
      y: Math.max(0, Math.min(100, regiao.y)),
      width: Math.max(5, Math.min(100 - regiao.x, regiao.width)),
      height: Math.max(5, Math.min(100 - regiao.y, regiao.height)),
    };

    setRegioes((prev) => ({ ...prev, [tipo]: regiaoAjustada }));

    if (regioes.nomeProduto && regioes.dataValidade) {
      processarRegioes();
    }
  };

  const processarRegioes = async () => {
    if (!imagem || !regioes.nomeProduto || !regioes.dataValidade) return;

    try {
      const resultado = await MlkitOcr.detectFromUri(imagem);
      if (resultado && resultado.length > 0) {
        const textoCompleto = resultado.map((block) => block.text).join("\n");

        const textoNome = extrairTextoRegiao(resultado, regioes.nomeProduto);

        const textoData = extrairTextoRegiao(resultado, regioes.dataValidade);

        if (textoNome) {
          setNovaPalavraChave(textoNome);
          adicionarPalavraChave();
        }

        const padroesDataEncontrados = identificarPadroesData(textoData);
        padroesDataEncontrados.forEach((padrao) => {
          setNovoPadraoData(padrao);
          adicionarPadraoData();
        });

        setEtapa("confirmacao");
      }
    } catch (error) {
      console.error("Erro ao processar texto:", error);
      Alert.alert("Erro", "Houve um erro ao processar o texto da imagem");
    }
  };

  const extrairTextoRegiao = (resultado: any[], regiao: RegiaoEtiqueta) => {
    if (!resultado || resultado.length === 0) return "";

    return resultado
      .filter((block) => {
        if (!block.boundingBox) return false;

        // Obtém as dimensões da imagem original
        const imageWidth = block.boundingBox.width || 1;
        const imageHeight = block.boundingBox.height || 1;

        // Converte as coordenadas do bloco para porcentagem
        const blockX = (block.boundingBox.left / imageWidth) * 100;
        const blockY = (block.boundingBox.top / imageHeight) * 100;
        const blockWidth =
          ((block.boundingBox.right - block.boundingBox.left) / imageWidth) *
          100;
        const blockHeight =
          ((block.boundingBox.bottom - block.boundingBox.top) / imageHeight) *
          100;

        // Verifica se o bloco está dentro da região selecionada
        return (
          blockX >= regiao.x &&
          blockX + blockWidth <= regiao.x + regiao.width &&
          blockY >= regiao.y &&
          blockY + blockHeight <= regiao.y + regiao.height
        );
      })
      .map((block) => block.text)
      .join(" ")
      .trim();
  };

  const identificarPadroesData = (texto: string) => {
    const padroes: string[] = [];
    const regexData = [
      /(\d{2}\/\d{2}\/\d{4})/g,
      /(\d{2}\/\d{2}\/\d{2})/g,
      /(\d{2}-\d{2}-\d{4})/g,
      /(\d{2}-\d{2}-\d{2})/g,
      /(\d{2}\.\d{2}\.\d{4})/g,
      /(\d{2}\.\d{2}\.\d{2})/g,
    ];

    regexData.forEach((regex) => {
      const matches = texto.match(regex);
      if (matches) {
        padroes.push(...matches);
      }
    });

    return [...new Set(padroes)];
  };

  const salvarPadrao = async () => {
    if (!nomePadrao.trim()) {
      Alert.alert("Erro", "Por favor, insira um nome para o padrão");
      return;
    }

    if (!imagem || !regioes.nomeProduto || !regioes.dataValidade) {
      Alert.alert("Erro", "Por favor, selecione todas as regiões necessárias");
      return;
    }

    try {
      const resultado = await MlkitOcr.detectFromUri(imagem);
      if (!resultado || resultado.length === 0) {
        Alert.alert("Erro", "Não foi possível detectar texto na imagem");
        return;
      }

      const textoNome = extrairTextoRegiao(resultado, regioes.nomeProduto);
      const textoData = extrairTextoRegiao(resultado, regioes.dataValidade);

      await adicionarPadrao({
        nome: nomePadrao,
        regioes: {
          nomeProduto: regioes.nomeProduto,
          dataValidade: regioes.dataValidade,
        },
        configuracao: {
          palavrasChave: configuracao.palavrasChave,
          palavrasIgnoradas: configuracao.palavrasIgnoradas,
          padroesData: configuracao.padroesData,
        },
        exemplos: [
          {
            imagem,
            textoNome,
            textoData,
            confianca: 1,
          },
        ],
      });

      Alert.alert("Sucesso", "Padrão salvo com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            setEtapa("inicial");
            setImagem(null);
            setNomePadrao("");
            setRegioes({});
            setConfiguracao({
              palavrasChave: [],
              palavrasIgnoradas: [],
              padroesData: [],
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar padrão:", error);
      Alert.alert("Erro", "Houve um erro ao salvar o padrão");
    }
  };

  const renderConfiguracao = () => (
    <ScrollView style={styles.configuracaoContainer}>
      <Text style={styles.titulo}>Configurar Padrão</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.subtitulo}>
          Palavras-chave para identificar o produto:
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={novaPalavraChave}
            onChangeText={setNovaPalavraChave}
            placeholder="Ex: FEIJÃO, MOLHO"
          />
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={adicionarPalavraChave}
          >
            <FontAwesome name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.listaContainer}>
          {configuracao.palavrasChave.map((palavra, index) => (
            <View key={index} style={styles.itemLista}>
              <Text style={styles.itemTexto}>{palavra}</Text>
              <TouchableOpacity
                onPress={() => removerItem("palavrasChave", index)}
              >
                <FontAwesome name="times" size={16} color="#fa5252" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.subtitulo}>Palavras a serem ignoradas:</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={novaPalavraIgnorada}
            onChangeText={setNovaPalavraIgnorada}
            placeholder="Ex: LOTE, FAB"
          />
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={adicionarPalavraIgnorada}
          >
            <FontAwesome name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.listaContainer}>
          {configuracao.palavrasIgnoradas.map((palavra, index) => (
            <View key={index} style={styles.itemLista}>
              <Text style={styles.itemTexto}>{palavra}</Text>
              <TouchableOpacity
                onPress={() => removerItem("palavrasIgnoradas", index)}
              >
                <FontAwesome name="times" size={16} color="#fa5252" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.subtitulo}>Padrões de data:</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={novoPadraoData}
            onChangeText={setNovoPadraoData}
            placeholder="Ex: VAL: dd/mm/yy"
          />
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={adicionarPadraoData}
          >
            <FontAwesome name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.listaContainer}>
          {configuracao.padroesData.map((padrao, index) => (
            <View key={index} style={styles.itemLista}>
              <Text style={styles.itemTexto}>{padrao}</Text>
              <TouchableOpacity
                onPress={() => removerItem("padroesData", index)}
              >
                <FontAwesome name="times" size={16} color="#fa5252" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.botaoProsseguir}
        onPress={() => setEtapa("regioes")}
        disabled={
          configuracao.palavrasChave.length === 0 ||
          configuracao.padroesData.length === 0
        }
      >
        <Text style={styles.botaoTexto}>Prosseguir</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderRegioes = () => (
    <View style={styles.regioesContainer}>
      <Text style={styles.instrucaoRegiao}>
        {!regioes.nomeProduto
          ? "Selecione a região onde está o nome do produto"
          : "Selecione a região onde está a data de validade"}
      </Text>
      {!regioes.nomeProduto ? (
        <RegionSelector
          imagem={imagem!}
          tipoRegiao="nomeProduto"
          onRegionSelected={(regiao) =>
            handleRegionSelected("nomeProduto", regiao)
          }
          regiaoAtual={regioes.nomeProduto}
        />
      ) : !regioes.dataValidade ? (
        <RegionSelector
          imagem={imagem!}
          tipoRegiao="dataValidade"
          onRegionSelected={(regiao) =>
            handleRegionSelected("dataValidade", regiao)
          }
          regiaoAtual={regioes.dataValidade}
        />
      ) : null}
      {regioes.nomeProduto && regioes.dataValidade && (
        <TouchableOpacity
          style={styles.botaoConfirmar}
          onPress={() => setEtapa("confirmacao")}
        >
          <Text style={styles.botaoTexto}>Confirmar Seleção</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEtapa = () => {
    switch (etapa) {
      case "inicial":
        return (
          <View style={styles.inicialContainer}>
            <FontAwesome name="graduation-cap" size={60} color="#228be6" />
            <Text style={styles.titulo}>Treinar Reconhecimento</Text>
            <Text style={styles.descricao}>
              Tire uma foto de uma etiqueta ou selecione uma imagem da galeria
              para configurar os padrões de reconhecimento. Isso ajudará o app a
              identificar melhor as informações nas etiquetas.
            </Text>
            <TouchableOpacity
              style={styles.botaoIniciar}
              onPress={iniciarTreinamento}
            >
              <Text style={styles.botaoTexto}>Selecionar Imagem</Text>
            </TouchableOpacity>
          </View>
        );

      case "configuracao":
        return renderConfiguracao();

      case "regioes":
        return renderRegioes();

      case "confirmacao":
        return (
          <View style={styles.confirmacaoContainer}>
            <Text style={styles.titulo}>Confirmar Informações</Text>
            <View style={styles.previewContainer}>
              <Image source={{ uri: imagem! }} style={styles.previewImage} />
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Nome do Padrão:</Text>
                <TextInput
                  style={styles.input}
                  value={nomePadrao}
                  onChangeText={setNomePadrao}
                  placeholder="Digite um nome para o padrão"
                />
                <Text style={styles.label}>Palavras-chave:</Text>
                <Text style={styles.valor}>
                  {configuracao.palavrasChave.join(", ")}
                </Text>
                <Text style={styles.label}>Padrões de data:</Text>
                <Text style={styles.valor}>
                  {configuracao.padroesData.join("\n")}
                </Text>
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
  configuracaoContainer: {
    flex: 1,
    padding: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 16,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
  },
  descricao: {
    fontSize: 16,
    color: "#868e96",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  botaoAdicionar: {
    backgroundColor: "#228be6",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  listaContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  itemLista: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  itemTexto: {
    fontSize: 16,
    color: "#495057",
  },
  botaoIniciar: {
    backgroundColor: "#228be6",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  botaoProsseguir: {
    backgroundColor: "#228be6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  botaoTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
  instrucaoRegiao: {
    fontSize: 16,
    color: "#495057",
    marginBottom: 16,
    textAlign: "center",
  },
});
