
import { BarChart3, PackageCheck, PackageX, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useInventory } from "@/context/InventoryContext";

const DashboardStats = () => {
  const { products, loading } = useInventory();
  
  // Calcular estatísticas
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const lowStockCount = products.filter(product => product.quantity <= 5 && product.quantity > 0).length;
  const outOfStockCount = products.filter(product => product.quantity === 0).length;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mt-4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Produtos</p>
              <p className="text-3xl font-bold mt-1">{totalProducts}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <PackageCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <TrendingUp className="inline h-4 w-4 mr-1 text-green-500" />
            Visão geral do catálogo
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Valor em Estoque</p>
              <p className="text-3xl font-bold mt-1">R$ {totalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <TrendingUp className="inline h-4 w-4 mr-1 text-green-500" />
            Capital em produtos
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Baixo Estoque</p>
              <p className="text-3xl font-bold mt-1">{lowStockCount}</p>
            </div>
            <div className="bg-amber-100 p-2 rounded-full">
              <PackageX className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Produtos com menos de 5 unidades
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Sem Estoque</p>
              <p className="text-3xl font-bold mt-1">{outOfStockCount}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <PackageX className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Produtos com 0 unidades em estoque
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
