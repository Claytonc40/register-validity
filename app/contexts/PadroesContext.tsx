import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useState } from "react";

export interface RegiaoEtiqueta {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExemploPadrao {
  imagem: string;
  textoNome: string;
  textoData: string;
  confianca: number;
}

export interface PadraoEtiqueta {
  id: string;
  nome: string;
  regioes: {
    nomeProduto: RegiaoEtiqueta;
    dataValidade: RegiaoEtiqueta;
  };
  exemplos: ExemploPadrao[];
  totalUsos: number;
  taxaAcerto: number;
  criadoEm: string;
  atualizadoEm: string;
}

interface PadroesContextData {
  padroes: PadraoEtiqueta[];
  adicionarPadrao: (
    padrao: Omit<
      PadraoEtiqueta,
      "id" | "criadoEm" | "atualizadoEm" | "totalUsos" | "taxaAcerto"
    >,
  ) => Promise<void>;
  atualizarPadrao: (
    id: string,
    dados: Partial<PadraoEtiqueta>,
  ) => Promise<void>;
  removerPadrao: (id: string) => Promise<void>;
  buscarPadrao: (texto: string) => Promise<PadraoEtiqueta | null>;
  carregarPadroes: () => Promise<void>;
}

const PadroesContext = createContext<PadroesContextData>(
  {} as PadroesContextData,
);

const PADROES_STORAGE_KEY = "@app_padroes";

export function PadroesProvider({ children }: { children: ReactNode }) {
  const [padroes, setPadroes] = useState<PadraoEtiqueta[]>([]);

  const carregarPadroes = async () => {
    try {
      const padroesStorage = await AsyncStorage.getItem(PADROES_STORAGE_KEY);
      if (padroesStorage) {
        setPadroes(JSON.parse(padroesStorage));
      }
    } catch (error) {
      console.error("Erro ao carregar padrões:", error);
    }
  };

  const adicionarPadrao = async (
    novoPadrao: Omit<
      PadraoEtiqueta,
      "id" | "criadoEm" | "atualizadoEm" | "totalUsos" | "taxaAcerto"
    >,
  ) => {
    try {
      const padrao: PadraoEtiqueta = {
        ...novoPadrao,
        id: Date.now().toString(),
        totalUsos: 0,
        taxaAcerto: 0,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };

      const novosPadroes = [...padroes, padrao];
      await AsyncStorage.setItem(
        PADROES_STORAGE_KEY,
        JSON.stringify(novosPadroes),
      );
      setPadroes(novosPadroes);
    } catch (error) {
      console.error("Erro ao adicionar padrão:", error);
    }
  };

  const atualizarPadrao = async (
    id: string,
    dados: Partial<PadraoEtiqueta>,
  ) => {
    try {
      const novosPadroes = padroes.map((padrao) =>
        padrao.id === id
          ? {
              ...padrao,
              ...dados,
              atualizadoEm: new Date().toISOString(),
            }
          : padrao,
      );

      await AsyncStorage.setItem(
        PADROES_STORAGE_KEY,
        JSON.stringify(novosPadroes),
      );
      setPadroes(novosPadroes);
    } catch (error) {
      console.error("Erro ao atualizar padrão:", error);
    }
  };

  const removerPadrao = async (id: string) => {
    try {
      const novosPadroes = padroes.filter((padrao) => padrao.id !== id);
      await AsyncStorage.setItem(
        PADROES_STORAGE_KEY,
        JSON.stringify(novosPadroes),
      );
      setPadroes(novosPadroes);
    } catch (error) {
      console.error("Erro ao remover padrão:", error);
    }
  };

  const buscarPadrao = async (
    texto: string,
  ): Promise<PadraoEtiqueta | null> => {
    // Implementar lógica de busca de padrão mais similar
    // Por enquanto, retorna null
    return null;
  };

  return (
    <PadroesContext.Provider
      value={{
        padroes,
        adicionarPadrao,
        atualizarPadrao,
        removerPadrao,
        buscarPadrao,
        carregarPadroes,
      }}
    >
      {children}
    </PadroesContext.Provider>
  );
}

export function usePadroes() {
  const context = useContext(PadroesContext);
  if (!context) {
    throw new Error("usePadroes deve ser usado dentro de um PadroesProvider");
  }
  return context;
}

export default PadroesProvider;
