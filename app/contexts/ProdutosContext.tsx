import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useState } from "react";

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

export function ProdutosProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<ProdutoAlerta[]>([]);

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
