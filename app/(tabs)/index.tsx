import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import ProductList from "../../components/ProductList";
import ProductValidityForm from "../../components/ProductValidityForm";
import { useProducts } from "../../hooks/useProducts";

export default function HomeScreen() {
  const { products, loading, addProduct, removeProduct } = useProducts();

  const handleSaveProduct = (product: { name: string; expiryDate: Date }) => {
    addProduct(product.name, product.expiryDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Validade</Text>

      <ProductValidityForm onSave={handleSaveProduct} />

      <Text style={styles.subtitle}>Produtos Cadastrados</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Carregando produtos...</Text>
        </View>
      ) : (
        <ProductList products={products} onDelete={removeProduct} />
      )}
    </View>
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
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
