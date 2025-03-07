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
  return (
    data1.getDate() === data2.getDate() &&
    data1.getMonth() === data2.getMonth() &&
    data1.getFullYear() === data2.getFullYear()
  );
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
      // Filtra produtos que vencem hoje ou amanhã
      const hoje = new Date();
      const amanha = new Date(hoje);
      amanha.setDate(amanha.getDate() + 1);

      const produtosProximosVencimento = produtos.filter((produto) => {
        const dataValidade = new Date(produto.validade);
        return mesmaData(dataValidade, hoje) || mesmaData(dataValidade, amanha);
      });

      if (produtosProximosVencimento.length > 0) {
        console.log(
          "Agendando notificações para",
          produtosProximosVencimento.length,
          "produtos próximos do vencimento"
        );
        agendarNotificacoesDiarias(produtosProximosVencimento);
      } else {
        console.log("Nenhum produto próximo do vencimento para notificar");
      }
    }
  }, [produtos, notificacoesAtivas]);

  // Verificar periodicamente se houve mudança na configuração de notificações
  useEffect(() => {
    const intervalo = setInterval(async () => {
      try {
        const estado = await AsyncStorage.getItem("@notificacoes_ativas");
        if (estado !== null && (estado === "true") !== notificacoesAtivas) {
          setNotificacoesAtivas(estado === "true");
        }
      } catch (error) {
        console.error("Erro ao verificar estado das notificações:", error);
      }
    }, 5000); // Verificar a cada 5 segundos

    return () => clearInterval(intervalo);
  }, [notificacoesAtivas]);

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
