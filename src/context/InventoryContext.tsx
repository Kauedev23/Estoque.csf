
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/supabase";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface InventoryContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateQuantity: (id: string, newQuantity: number) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Carregar produtos do Supabase quando o usuário estiver autenticado
  useEffect(() => {
    if (user) {
      refreshProducts();
    }
  }, [user]);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }

      setProducts(data);
      setError(null);
    } catch (err: any) {
      console.error("Erro ao carregar produtos:", err);
      setError(err.message || 'Erro ao carregar produtos');
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();
      
      if (error) {
        throw error;
      }

      if (data && data[0]) {
        setProducts(prevProducts => [...prevProducts, data[0]]);
      }
      
      return;
    } catch (err: any) {
      console.error("Erro ao adicionar produto:", err);
      toast.error('Erro ao adicionar produto');
      throw err;
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          name: product.name,
          category: product.category,
          price: product.price,
          quantity: product.quantity,
          brand: product.brand,
          model: product.model,
          serial_number: product.serial_number,
          status: product.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);
      
      if (error) {
        throw error;
      }

      setProducts(products.map(p => 
        p.id === product.id ? { ...product, updated_at: new Date().toISOString() } : p
      ));
    } catch (err: any) {
      console.error("Erro ao atualizar produto:", err);
      toast.error('Erro ao atualizar produto');
      throw err;
    }
  };

  const removeProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }

      setProducts(products.filter(product => product.id !== id));
    } catch (err: any) {
      console.error("Erro ao remover produto:", err);
      toast.error('Erro ao remover produto');
      throw err;
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      // Buscar produto para fazer o registro da movimentação
      const product = products.find(p => p.id === id);
      if (!product) {
        throw new Error("Produto não encontrado");
      }
      
      // Calcular a alteração na quantidade
      const quantityChange = newQuantity - product.quantity;
      
      // Atualizar a quantidade no produto
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (updateError) {
        throw updateError;
      }

      // Registrar a movimentação no histórico
      if (quantityChange !== 0) {
        const { error: movementError } = await supabase
          .from('inventory_movements')
          .insert([{
            product_id: id,
            quantity_change: quantityChange,
            movement_type: quantityChange > 0 ? 'entrada' : 'saída',
            notes: `Ajuste de estoque: ${quantityChange > 0 ? '+' : ''}${quantityChange} unidades`
          }]);
        
        if (movementError) {
          console.error("Erro ao registrar movimentação:", movementError);
          toast.error('Erro ao registrar movimentação');
        }
      }

      setProducts(products.map(product => 
        product.id === id 
          ? { ...product, quantity: newQuantity, updated_at: new Date().toISOString() } 
          : product
      ));
    } catch (err: any) {
      console.error("Erro ao atualizar quantidade:", err);
      toast.error('Erro ao atualizar quantidade');
      throw err;
    }
  };

  return (
    <InventoryContext.Provider value={{ 
      products, 
      loading,
      error,
      addProduct, 
      updateProduct, 
      removeProduct,
      updateQuantity,
      refreshProducts
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
