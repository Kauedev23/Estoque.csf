import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Package, PlusCircle, Search, AlertTriangle, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DashboardStats from "@/components/DashboardStats";
import ProductTable from "@/components/ProductTable";
import AddProductModal from "@/components/AddProductModal";
import { InventoryProvider, useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";

const LowStockCard = () => {
  const { products, loading } = useInventory();
  
  if (loading) {
    return (
      <Card className="shadow-sm h-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
            Itens com Baixo Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const lowStockProducts = products
    .filter(product => product.quantity > 0 && product.quantity <= 5)
    .sort((a, b) => a.quantity - b.quantity);
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          Itens com Baixo Estoque
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lowStockProducts.length > 0 ? (
          <ul className="space-y-2">
            {lowStockProducts.slice(0, 5).map(product => (
              <li key={product.id} className="flex justify-between items-center">
                <span>{product.name}</span>
                <Badge variant="outline" className="text-amber-500 border-amber-500">
                  {product.quantity} {product.quantity === 1 ? 'unidade' : 'unidades'}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Nenhum item com baixo estoque
          </p>
        )}
      </CardContent>
      {lowStockProducts.length > 5 && (
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full text-blue-600">
            Ver todos ({lowStockProducts.length})
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const MovementsCard = () => {
  return (
    <Card className="shadow-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowUpDown className="h-5 w-5 mr-2 text-blue-600" />
          Movimentações Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Monitor LED 24"</p>
              <p className="text-sm text-gray-500">Hoje, 14:30</p>
            </div>
            <Badge className="bg-green-500">+10</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Teclado Mecânico</p>
              <p className="text-sm text-gray-500">Hoje, 12:15</p>
            </div>
            <Badge className="bg-red-500">-2</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Webcam HD</p>
              <p className="text-sm text-gray-500">Ontem, 16:45</p>
            </div>
            <Badge className="bg-green-500">+5</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full text-blue-600">
          Ver histórico completo
        </Button>
      </CardFooter>
    </Card>
  );
};

const InfoCard = () => {
  const { products, loading } = useInventory();

  if (loading) {
    return (
      <Card className="shadow-sm h-full">
        <CardHeader>
          <CardTitle>Informações Rápidas</CardTitle>
          <CardDescription>Resumo do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
                {i < 2 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const outOfStockCount = products.filter(p => p.quantity === 0).length;
  
  return (
    <Card className="shadow-sm h-full">
      <CardHeader>
        <CardTitle>Informações Rápidas</CardTitle>
        <CardDescription>Resumo do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Total de itens</p>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-gray-500">Valor total em estoque</p>
            <p className="text-2xl font-bold">
              R$ {totalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </p>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-gray-500">Itens sem estoque</p>
            <p className="text-2xl font-bold">{outOfStockCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MainContent = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAdmin } = useAuth();
  
  return (
    <div>
      <div className="mb-8">
        <DashboardStats />
      </div>

      <div className="my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Itens em Estoque</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar itens..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {isAdmin && (
              <Button 
                id="addProductButton"
                variant="default" 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsAddModalOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Novo Item
              </Button>
            )}
          </div>
        </div>
        
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <ProductTable searchQuery={searchQuery} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <LowStockCard />
        <MovementsCard />
        <InfoCard />
      </div>

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" />;

  return (
    <Layout>
      <InventoryProvider>
        <MainContent />
      </InventoryProvider>
    </Layout>
  );
};

export default Index;
