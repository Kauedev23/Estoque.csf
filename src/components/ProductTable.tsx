
import { useState } from "react";
import { Edit, Trash2, Package, PlusCircle, MinusCircle, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/context/AuthContext";
import EditProductModal from "./EditProductModal";
import { toast } from "sonner";
import { Product } from "@/types/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface ProductTableProps {
  searchQuery: string;
}

const ProductTable = ({ searchQuery }: ProductTableProps) => {
  const { products, removeProduct, updateQuantity, refreshProducts, loading } = useInventory();
  const { isAdmin } = useAuth();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filtrar produtos com base na pesquisa
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.model && product.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.serial_number && product.serial_number.toLowerCase().includes(searchQuery.toLowerCase()))
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

  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Disponível</Badge>;
      case "in_use":
        return <Badge className="bg-blue-500">Em Uso</Badge>;
      case "maintenance":
        return <Badge className="bg-amber-500">Manutenção</Badge>;
      case "discarded":
        return <Badge className="bg-red-500">Descartado</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
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
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Marca/Modelo</TableHead>
              <TableHead>Serial</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Estoque</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-2" />
                    <p className="text-gray-500">Carregando produtos...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  {searchQuery ? (
                    <p>Nenhum produto encontrado para "{searchQuery}"</p>
                  ) : (
                    <div>
                      <p>Não há produtos cadastrados</p>
                      {isAdmin && (
                        <Button 
                          variant="link" 
                          onClick={() => document.getElementById('addProductButton')?.click()}
                          className="mt-2 text-blue-600"
                        >
                          Adicionar um produto
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {product.brand && (
                      <div>
                        <span className="font-medium">Marca:</span> {product.brand}
                      </div>
                    )}
                    {product.model && (
                      <div>
                        <span className="font-medium">Modelo:</span> {product.model}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{product.serial_number || "-"}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
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
                    R$ {product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {isAdmin && (
                            <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleIncrement(product.id, product.quantity)}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Incrementar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDecrement(product.id, product.quantity)}>
                            <MinusCircle className="h-4 w-4 mr-2" />
                            Decrementar
                          </DropdownMenuItem>
                          {isAdmin && (
                            <DropdownMenuItem 
                              onClick={() => handleRemove(product.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
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
