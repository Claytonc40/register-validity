export interface Product {
  id: string;
  name: string;
  expiryDate: Date;
}

// Dados iniciais de exemplo
export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Leite",
    expiryDate: new Date(2025, 3, 15),
  },
  {
    id: "2",
    name: "Iogurte",
    expiryDate: new Date(2025, 3, 10),
  },
  {
    id: "3",
    name: "Queijo",
    expiryDate: new Date(2025, 4, 1),
  },
];

// Função para calcular dias restantes até a validade
export const getDaysRemaining = (expiryDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const differenceInTime = expiry.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  return differenceInDays;
};

// Função para verificar se o produto está prestes a vencer (próximo de 7 dias)
export const isNearExpiry = (expiryDate: Date): boolean => {
  const daysRemaining = getDaysRemaining(expiryDate);
  return daysRemaining >= 0 && daysRemaining <= 7;
};

// Função para verificar se o produto já venceu
export const isExpired = (expiryDate: Date): boolean => {
  return getDaysRemaining(expiryDate) < 0;
};
