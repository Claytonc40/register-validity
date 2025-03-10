import { adicionarEventoAoCalendario } from "@/app/services/calendarSync";
import { agendarNotificacoesDiarias } from "@/services/notifications.config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface ProdutoAlerta {
  id: string;
  nome: string;
  validade: string;
  dataRegistro: string;
}

interface ProdutosContextData {
  produtos: ProdutoAlerta[];
  adicionarProduto: (produto: ProdutoAlerta) => Promise<void>;
  removerProduto: (id: string) => Promise<void>;
  carregarProdutos: () => Promise<void>;
}

const ProdutosContext = createContext<ProdutosContextData>(
  {} as ProdutosContextData
);

// Função para comparar apenas as datas (ignorando horas)
const mesmaData = (data1: Date, data2: Date) => {
  try {
    // Verifica se as datas são válidas
    if (!data1 || !data2 || isNaN(data1.getTime()) || isNaN(data2.getTime())) {
      console.warn("Comparação de data inválida no ProdutosContext");
      return false;
    }

    return (
      data1.getDate() === data2.getDate() &&
      data1.getMonth() === data2.getMonth() &&
      data1.getFullYear() === data2.getFullYear()
    );
  } catch (error) {
    console.error("Erro ao comparar datas:", error);
    return false;
  }
};

export function ProdutosProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<ProdutoAlerta[]>([]);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  const carregarProdutos = async () => {
    try {
      const produtosStorage = await AsyncStorage.getItem("@produtos");
      if (produtosStorage) {
        setProdutos(JSON.parse(produtosStorage));
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const adicionarProduto = async (produto: ProdutoAlerta) => {
    try {
      const novosProdutos = [...produtos, produto];
      await AsyncStorage.setItem("@produtos", JSON.stringify(novosProdutos));
      setProdutos(novosProdutos);

      // Adicionar ao calendário se a sincronização estiver ativa
      adicionarEventoAoCalendario(produto).catch((error) => {
        console.error("Erro ao adicionar produto ao calendário:", error);
        // Não impedimos o fluxo principal se a adição ao calendário falhar
      });
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  const removerProduto = async (id: string) => {
    try {
      const novosProdutos = produtos.filter((produto) => produto.id !== id);
      await AsyncStorage.setItem("@produtos", JSON.stringify(novosProdutos));
      setProdutos(novosProdutos);
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  };

  // Efeito para carregar produtos e estado das notificações quando o componente montar
  useEffect(() => {
    carregarProdutos();

    // Carregar estado das notificações
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

  // Efeito para agendar notificações sempre que a lista de produtos mudar
  useEffect(() => {
    if (notificacoesAtivas && produtos.length > 0) {
      console.log("Verificando produtos para notificações...");
      console.log("Total de produtos:", produtos.length);

      // Vamos enviar todos os produtos para o serviço de notificações
      // e deixar que ele filtre de acordo com as configurações de antecedência e aviso no dia
      agendarNotificacoesDiarias(produtos);
    } else {
      if (!notificacoesAtivas) {
        console.log("Notificações desativadas pelo usuário");
      } else if (produtos.length === 0) {
        console.log("Nenhum produto cadastrado para verificar");
      }
    }
  }, [produtos, notificacoesAtivas]);

  // Verificar periodicamente se houve mudança na configuração de notificações
  useEffect(() => {
    const verificarConfiguracoes = async () => {
      try {
        // Verifica estado das notificações
        const estado = await AsyncStorage.getItem("@notificacoes_ativas");
        let mudanca = false;

        if (estado !== null && (estado === "true") !== notificacoesAtivas) {
          setNotificacoesAtivas(estado === "true");
          mudanca = true;
        }

        // Se houver mudança e as notificações estiverem ativas, reagenda
        if (mudanca && estado === "true" && produtos.length > 0) {
          console.log(
            "Configurações de notificações alteradas, reagendando..."
          );
          agendarNotificacoesDiarias(produtos);
        }
      } catch (error) {
        console.error(
          "Erro ao verificar configurações de notificações:",
          error
        );
      }
    };

    // Executa verificação inicial
    verificarConfiguracoes();

    // Configura intervalo para verificação periódica
    const intervalo = setInterval(verificarConfiguracoes, 30000); // A cada 30 segundos

    return () => clearInterval(intervalo);
  }, [notificacoesAtivas, produtos]);

  return (
    <ProdutosContext.Provider
      value={{ produtos, adicionarProduto, removerProduto, carregarProdutos }}
    >
      {children}
    </ProdutosContext.Provider>
  );
}

export function useProdutos() {
  const context = useContext(ProdutosContext);
  if (!context) {
    throw new Error("useProdutos deve ser usado dentro de um ProdutosProvider");
  }
  return context;
}

export default ProdutosProvider;
