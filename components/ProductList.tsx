import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Product,
  getDaysRemaining,
  isExpired,
  isNearExpiry,
} from "../constants/Products";

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export default function ProductList({ products, onDelete }: ProductListProps) {
  // Função para formatar a data
  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Renderiza cada item da lista
  const renderItem = ({ item }: { item: Product }) => {
    const daysRemaining = getDaysRemaining(item.expiryDate);
    const expired = isExpired(item.expiryDate);
    const nearExpiry = isNearExpiry(item.expiryDate);

    return (
      <View
        style={[
          styles.productItem,
          expired
            ? styles.expiredItem
            : nearExpiry
            ? styles.nearExpiryItem
            : {},
        ]}
      >
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDate}>
            Validade: {formatDate(item.expiryDate)}
          </Text>
          <Text style={styles.daysRemaining}>
            {expired
              ? `Vencido há ${Math.abs(daysRemaining)} dias`
              : `${daysRemaining} dias restantes`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Renderiza mensagem quando não há produtos
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
      <Text>Adicione produtos usando o formulário acima</Text>
    </View>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListEmptyComponent={renderEmptyList}
      style={styles.list}
      contentContainerStyle={products.length === 0 ? { flex: 1 } : {}}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expiredItem: {
    backgroundColor: "#ffebee",
    borderLeftWidth: 5,
    borderLeftColor: "#f44336",
  },
  nearExpiryItem: {
    backgroundColor: "#fff8e1",
    borderLeftWidth: 5,
    borderLeftColor: "#ffc107",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productDate: {
    fontSize: 14,
    color: "#666",
  },
  daysRemaining: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
