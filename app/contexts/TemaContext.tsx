import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { Cores } from "../constants/Cores";

type TemaType = "light" | "dark" | "system";

interface TemaContextData {
  tema: TemaType;
  mudarTema: (novoTema: TemaType) => Promise<void>;
  temaAtual: "light" | "dark";
  cores: typeof Cores.light;
}

const TemaContext = createContext<TemaContextData>({} as TemaContextData);

const TEMA_STORAGE_KEY = "@app_tema";

export function TemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<TemaType>("system");
  const systemTheme = useColorScheme();

  useEffect(() => {
    carregarTema();
  }, []);

  const carregarTema = async () => {
    try {
      const temaSalvo = await AsyncStorage.getItem(TEMA_STORAGE_KEY);
      if (temaSalvo) {
        setTema(temaSalvo as TemaType);
      }
    } catch (error) {
      console.error("Erro ao carregar tema:", error);
    }
  };

  const mudarTema = async (novoTema: TemaType) => {
    try {
      await AsyncStorage.setItem(TEMA_STORAGE_KEY, novoTema);
      setTema(novoTema);
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }
  };

  const temaAtual = tema === "system" ? systemTheme || "light" : tema;
  const cores = Cores[temaAtual];

  return (
    <TemaContext.Provider
      value={{
        tema,
        mudarTema,
        temaAtual,
        cores,
      }}
    >
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error("useTema deve ser usado dentro de um TemaProvider");
  }
  return context;
}
