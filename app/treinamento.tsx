import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { useTema } from "./contexts/TemaContext";

type Etapa = "inicial" | "captura" | "nome" | "regioes" | "confirmacao";

export default function TreinamentoScreen() {
  const { cores } = useTema();
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
  const [processando, setProcessando] = useState(false);

  const { adicionarPadrao } = usePadroes();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.background,
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
      color: cores.text,
      marginTop: 16,
      marginBottom: 12,
      textAlign: "center",
    },
    descricao: {
      fontSize: 16,
      color: cores.textSecondary,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 24,
    },
    botaoIniciar: {
      backgroundColor: cores.primary,
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 12,
      width: "100%",
      alignItems: "center",
    },
    botaoTexto: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    nomeContainer: {
      flex: 1,
      padding: 24,
    },
    input: {
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      marginBottom: 24,
      color: cores.text,
    },
    botaoProsseguir: {
      backgroundColor: cores.primary,
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
      backgroundColor: cores.card,
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
      color: cores.textSecondary,
    },
    valor: {
      fontSize: 16,
      color: cores.text,
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
      backgroundColor: cores.danger,
    },
    botaoConfirmar: {
      backgroundColor: cores.success,
    },
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      color: "#fff",
      marginTop: 12,
      fontSize: 16,
    },
    botoesIniciais: {
      width: "100%",
      gap: 12,
    },
    botaoCamera: {
      backgroundColor: cores.primary,
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 12,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    botaoGaleria: {
      backgroundColor: cores.card,
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 12,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      borderWidth: 1,
      borderColor: cores.border,
    },
    botaoGaleriaTexto: {
      color: cores.text,
      fontSize: 16,
      fontWeight: "600",
    },
  });

  const iniciarTreinamento = async (tipo: "camera" | "galeria") => {
    try {
      let result;

      if (tipo === "camera") {
        // Solicita permissão para a câmera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Erro", "Precisamos de permissão para acessar a câmera!");
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        // Solicita permissão para a galeria
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Erro",
            "Precisamos de permissão para acessar suas fotos!"
          );
          return;
        }

        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      if (!result.canceled) {
        setImagem(result.assets[0].uri);
        setEtapa("nome");
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert(
        "Erro",
        "Houve um erro ao selecionar a imagem. Tente novamente."
      );
    }
  };

  const handleRegionSelected = (
    tipo: "nomeProduto" | "dataValidade",
    regiao: RegiaoEtiqueta
  ) => {
    // Validar tamanho mínimo da região
    if (regiao.width < 20 || regiao.height < 20) {
      Alert.alert(
        "Região muito pequena",
        "Por favor, selecione uma área maior para melhor reconhecimento."
      );
      return;
    }

    const novasRegioes = { ...regioes, [tipo]: regiao };
    setRegioes(novasRegioes);

    // Se já selecionou ambas as regiões, vai para confirmação
    if (novasRegioes.nomeProduto && novasRegioes.dataValidade) {
      processarRegioes(novasRegioes);
    }
  };

  const processarRegioes = async (regioesParaProcessar = regioes) => {
    if (
      !imagem ||
      !regioesParaProcessar.nomeProduto ||
      !regioesParaProcessar.dataValidade
    )
      return;

    try {
      setProcessando(true);
      const resultado = await MlkitOcr.detectFromUri(imagem);

      if (!resultado || resultado.length === 0) {
        Alert.alert(
          "Erro",
          "Não foi possível reconhecer texto na imagem. Tente novamente com uma foto mais clara."
        );
        setProcessando(false);
        return;
      }

      console.log("Resultado OCR:", JSON.stringify(resultado[0], null, 2));

      // Obter dimensões da imagem usando Image.getSize do React Native
      const imageDimensions = await new Promise<{
        width: number;
        height: number;
      }>((resolve, reject) => {
        Image.getSize(
          imagem,
          (width, height) => resolve({ width, height }),
          (error) => reject(error)
        );
      });

      // Filtrar blocos de texto baseado nas regiões selecionadas
      const blocosProduto = resultado.filter((block) => {
        if (!block?.bounding) {
          console.warn("Bloco inválido encontrado:", block);
          return false;
        }

        // Converter as coordenadas do bloco para a escala da imagem exibida
        const blockBounds = {
          x: (block.bounding.left / imageDimensions.width) * 100,
          y: (block.bounding.top / imageDimensions.height) * 100,
          width: (block.bounding.width / imageDimensions.width) * 100,
          height: (block.bounding.height / imageDimensions.height) * 100,
        };

        // Converter as coordenadas da região para porcentagem
        const regiaoNormalizada = {
          x:
            (regioesParaProcessar.nomeProduto!.x / imageDimensions.width) * 100,
          y:
            (regioesParaProcessar.nomeProduto!.y / imageDimensions.height) *
            100,
          width:
            (regioesParaProcessar.nomeProduto!.width / imageDimensions.width) *
            100,
          height:
            (regioesParaProcessar.nomeProduto!.height /
              imageDimensions.height) *
            100,
        };

        console.log("Bloco produto:", {
          bounds: blockBounds,
          regiao: regiaoNormalizada,
          texto: block.text,
        });

        return estaDentroRegiao(blockBounds, regiaoNormalizada);
      });

      const blocosData = resultado.filter((block) => {
        if (!block?.bounding) {
          console.warn("Bloco inválido encontrado:", block);
          return false;
        }

        // Converter as coordenadas do bloco para a escala da imagem exibida
        const blockBounds = {
          x: (block.bounding.left / imageDimensions.width) * 100,
          y: (block.bounding.top / imageDimensions.height) * 100,
          width: (block.bounding.width / imageDimensions.width) * 100,
          height: (block.bounding.height / imageDimensions.height) * 100,
        };

        // Converter as coordenadas da região para porcentagem
        const regiaoNormalizada = {
          x:
            (regioesParaProcessar.dataValidade!.x / imageDimensions.width) *
            100,
          y:
            (regioesParaProcessar.dataValidade!.y / imageDimensions.height) *
            100,
          width:
            (regioesParaProcessar.dataValidade!.width / imageDimensions.width) *
            100,
          height:
            (regioesParaProcessar.dataValidade!.height /
              imageDimensions.height) *
            100,
        };

        console.log("Bloco data:", {
          bounds: blockBounds,
          regiao: regiaoNormalizada,
          texto: block.text,
        });

        return estaDentroRegiao(blockBounds, regiaoNormalizada);
      });

      const textoNome = blocosProduto
        .filter((block) => block.text)
        .map((block) => block.text)
        .join(" ");
      const textoData = blocosData
        .filter((block) => block.text)
        .map((block) => block.text)
        .join(" ");

      console.log("Textos encontrados:", { textoNome, textoData });

      if (!textoNome && !textoData) {
        Alert.alert(
          "Nenhum texto encontrado",
          "Não foi possível reconhecer texto nas regiões selecionadas. Tente selecionar novamente.",
          [
            {
              text: "OK",
              onPress: () => {
                setRegioes({});
              },
            },
          ]
        );
        return;
      }

      setTextoReconhecido({
        nome: textoNome || "Não encontrado",
        data: textoData || "Não encontrado",
      });

      setEtapa("confirmacao");
    } catch (error) {
      console.error("Erro ao processar texto:", error);
      Alert.alert(
        "Erro",
        "Houve um erro ao processar o texto da imagem. Tente novamente."
      );
      setRegioes({});
    } finally {
      setProcessando(false);
    }
  };

  const estaDentroRegiao = (bloco: RegiaoEtiqueta, regiao: RegiaoEtiqueta) => {
    // Expandir ligeiramente a região de busca (5% em cada direção)
    const regiaoExpandida = {
      x: regiao.x - regiao.width * 0.05,
      y: regiao.y - regiao.height * 0.05,
      width: regiao.width * 1.1,
      height: regiao.height * 1.1,
    };

    // Calcular centro do bloco
    const centroBloco = {
      x: bloco.x + bloco.width / 2,
      y: bloco.y + bloco.height / 2,
    };

    // Verificar se o centro do bloco está dentro da região expandida
    const centroDentro =
      centroBloco.x >= regiaoExpandida.x &&
      centroBloco.x <= regiaoExpandida.x + regiaoExpandida.width &&
      centroBloco.y >= regiaoExpandida.y &&
      centroBloco.y <= regiaoExpandida.y + regiaoExpandida.height;

    // Se o centro está dentro, considerar válido
    if (centroDentro) {
      console.log("Bloco aceito por centro:", {
        bloco: { x: bloco.x, y: bloco.y, w: bloco.width, h: bloco.height },
        regiao: regiaoExpandida,
        centro: centroBloco,
      });
      return true;
    }

    // Calcular interseção como antes
    const x1 = Math.max(bloco.x, regiaoExpandida.x);
    const y1 = Math.max(bloco.y, regiaoExpandida.y);
    const x2 = Math.min(
      bloco.x + bloco.width,
      regiaoExpandida.x + regiaoExpandida.width
    );
    const y2 = Math.min(
      bloco.y + bloco.height,
      regiaoExpandida.y + regiaoExpandida.height
    );

    if (x2 <= x1 || y2 <= y1) {
      return false;
    }

    const areaIntersecao = (x2 - x1) * (y2 - y1);
    const areaBloco = bloco.width * bloco.height;
    const areaRegiao = regiaoExpandida.width * regiaoExpandida.height;

    // Reduzir o limiar para 5%
    const percentualBlocoNaRegiao = areaIntersecao / areaBloco;
    const percentualRegiaoComBloco = areaIntersecao / areaRegiao;

    const resultado =
      percentualBlocoNaRegiao >= 0.05 || percentualRegiaoComBloco >= 0.05;

    if (resultado) {
      console.log("Bloco aceito por sobreposição:", {
        bloco: { x: bloco.x, y: bloco.y, w: bloco.width, h: bloco.height },
        regiao: regiaoExpandida,
        percentualBlocoNaRegiao,
        percentualRegiaoComBloco,
      });
    }

    return resultado;
  };

  const salvarPadrao = async () => {
    if (!imagem || !regioes.nomeProduto || !regioes.dataValidade) return;

    try {
      setProcessando(true);
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
    } finally {
      setProcessando(false);
    }
  };

  const renderEtapa = () => {
    switch (etapa) {
      case "inicial":
        return (
          <View style={styles.inicialContainer}>
            <FontAwesome
              name="graduation-cap"
              size={60}
              color={cores.primary}
            />
            <Text style={styles.titulo}>Treinar Reconhecimento</Text>
            <Text style={styles.descricao}>
              Tire uma foto de uma etiqueta ou selecione da galeria e marque
              onde estão as informações importantes. Isso ajudará o app a
              reconhecer melhor as etiquetas no futuro.
            </Text>
            <View style={styles.botoesIniciais}>
              <TouchableOpacity
                style={styles.botaoCamera}
                onPress={() => iniciarTreinamento("camera")}
              >
                <FontAwesome name="camera" size={20} color="#fff" />
                <Text style={styles.botaoTexto}>Tirar Foto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoGaleria}
                onPress={() => iniciarTreinamento("galeria")}
              >
                <FontAwesome name="image" size={20} color={cores.text} />
                <Text style={styles.botaoGaleriaTexto}>
                  Escolher da Galeria
                </Text>
              </TouchableOpacity>
            </View>
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
              placeholderTextColor={cores.textSecondary}
            />
            <TouchableOpacity
              style={[
                styles.botaoProsseguir,
                !nomePadrao.trim() && { opacity: 0.5 },
              ]}
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
      {processando && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      )}
    </View>
  );
}
