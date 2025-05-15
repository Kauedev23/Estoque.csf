
import { useState } from "react";
import { Edit, Trash2, Package, PlusCircle, MinusCircle, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInventory } from "@/context/InventoryContext";
import EditProductModal from "./EditProductModal";
import { toast } from "sonner";
import { Product } from "@/types/supabase";

interface ProductTableProps {
  searchQuery: string;
}

const ProductTable = ({ searchQuery }: ProductTableProps) => {
  const { products, removeProduct, updateQuantity, refreshProducts, loading } = useInventory();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filtrar produtos com base na pesquisa
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = async (id: string) => {
    try {
      await removeProduct(id);
      toast.success("Produto removido com sucesso");
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  };

  const handleIncrement = async (id: string, currentQuantity: number) => {
    try {
      await updateQuantity(id, currentQuantity + 1);
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
    }
  };

  const handleDecrement = async (id: string, currentQuantity: number) => {
    if (currentQuantity > 0) {
      try {
        await updateQuantity(id, currentQuantity - 1);
      } catch (error) {
        console.error("Erro ao atualizar quantidade:", error);
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProducts();
      toast.success("Dados atualizados");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast.error("Erro ao atualizar dados");
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStockStatusBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Sem estoque</Badge>;
    } else if (quantity <= 5) {
      return <Badge variant="outline" className="text-amber-500 border-amber-500">Baixo</Badge>;
    } else {
      return <Badge variant="outline" className="text-green-500 border-green-500">Normal</Badge>;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-500">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'} encontrados
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleRefresh}
          disabled={isRefreshing || loading}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing || loading ? 'animate-spin' : ''}`} />
          {isRefreshing || loading ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead className="text-center">Estoque</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-2" />
                  <p className="text-gray-500">Carregando produtos...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                {searchQuery ? (
                  <p>Nenhum produto encontrado para "{searchQuery}"</p>
                ) : (
                  <div>
                    <p>Não há produtos cadastrados</p>
                    <Button 
                      variant="link" 
                      onClick={() => document.getElementById('addProductButton')?.click()}
                      className="mt-2 text-blue-600"
                    >
                      Adicionar um produto
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">R$ {product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => handleDecrement(product.id, product.quantity)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center">{product.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => handleIncrement(product.id, product.quantity)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center mt-1">
                    {getStockStatusBadge(product.quantity)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  R$ {(product.price * product.quantity).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => handleRemove(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {editingProduct && (
        <EditProductModal 
          product={editingProduct} 
          isOpen={!!editingProduct} 
          onClose={() => setEditingProduct(null)} 
        />
      )}
    </>
  );
};

export default ProductTable;
