
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
}

// Produtos iniciais para demonstração
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Monitor LED 24\"",
    category: "Eletrônicos",
    price: 899.90,
    quantity: 15
  },
  {
    id: "2",
    name: "Teclado Mecânico",
    category: "Informática",
    price: 349.90,
    quantity: 3
  },
  {
    id: "3",
    name: "Mouse Gamer",
    category: "Informática",
    price: 129.90,
    quantity: 2
  },
  {
    id: "4",
    name: "Webcam HD",
    category: "Eletrônicos",
    price: 199.90,
    quantity: 8
  },
  {
    id: "5",
    name: "Fone de Ouvido",
    category: "Eletrônicos",
    price: 149.90,
    quantity: 4
  },
  {
    id: "6",
    name: "Cadeira de Escritório",
    category: "Móveis",
    price: 599.90,
    quantity: 0
  }
];

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  // Carregar produtos do localStorage ou usar os iniciais
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("inventory-products");
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  // Salvar produtos no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("inventory-products", JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, quantity: newQuantity } : product
    ));
  };

  return (
    <InventoryContext.Provider value={{ 
      products, 
      addProduct, 
      updateProduct, 
      removeProduct,
      updateQuantity
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
