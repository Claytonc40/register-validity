import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Product, initialProducts } from "@/constants/Products";

// Chave para armazenamento no AsyncStorage
const PRODUCTS_STORAGE_KEY = "@register_validity:products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar produtos do armazenamento local quando o componente montar
  useEffect(() => {
    async function loadProducts() {
      try {
        const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);

        if (storedProducts) {
          // Precisamos converter as strings de data de volta para objetos Date
          const parsedProducts = JSON.parse(storedProducts).map(
            (product: any) => ({
              ...product,
              expiryDate: new Date(product.expiryDate),
            }),
          );

          setProducts(parsedProducts);
        } else {
          // Se não houver produtos armazenados, usar os produtos iniciais
          setProducts(initialProducts);
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        // Em caso de erro, usar os produtos iniciais
        setProducts(initialProducts);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Salvar produtos no armazenamento local sempre que eles mudarem
  useEffect(() => {
    async function saveProducts() {
      try {
        await AsyncStorage.setItem(
          PRODUCTS_STORAGE_KEY,
          JSON.stringify(products),
        );
      } catch (error) {
        console.error("Erro ao salvar produtos:", error);
      }
    }

    // Não salvar durante o carregamento inicial
    if (!loading) {
      saveProducts();
    }
  }, [products, loading]);

  // Adicionar um novo produto
  const addProduct = (name: string, expiryDate: Date) => {
    const newProduct: Product = {
      id: Date.now().toString(), // ID único usando timestamp
      name,
      expiryDate,
    };

    setProducts((currentProducts) => [...currentProducts, newProduct]);
  };

  // Remover um produto
  const removeProduct = (productId: string) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    );
  };

  // Ordenar produtos por data de validade (os mais próximos de vencer primeiro)
  const sortedProducts = [...products].sort(
    (a, b) => a.expiryDate.getTime() - b.expiryDate.getTime(),
  );

  return {
    products: sortedProducts,
    loading,
    addProduct,
    removeProduct,
  };
}
