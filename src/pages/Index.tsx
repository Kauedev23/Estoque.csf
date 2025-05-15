
import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, PlusCircle, Search, AlertTriangle, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DashboardStats from "@/components/DashboardStats";
import ProductTable from "@/components/ProductTable";
import AddProductModal from "@/components/AddProductModal";
import { InventoryProvider } from "@/context/InventoryContext";

const Index = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <InventoryProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">EstoqueSimples</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Link to="/historico">Histórico</Link>
              </Button>
              <Button variant="outline" size="sm">
                <Link to="/relatorios">Relatórios</Link>
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsAddModalOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <DashboardStats />

          <div className="my-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Produtos em Estoque</h2>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar produtos..."
                  className="pl-8 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <ProductTable searchQuery={searchQuery} />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  Produtos com Baixo Estoque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>Teclado Mecânico</span>
                    <Badge variant="outline" className="text-amber-500 border-amber-500">3 unidades</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Mouse Gamer</span>
                    <Badge variant="outline" className="text-amber-500 border-amber-500">2 unidades</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Fone de Ouvido</span>
                    <Badge variant="outline" className="text-amber-500 border-amber-500">4 unidades</Badge>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full text-blue-600">
                  Ver todos
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowUpDown className="h-5 w-5 mr-2 text-blue-600" />
                  Movimentações Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Monitor LED 24"</p>
                      <p className="text-sm text-gray-500">Hoje, 14:30</p>
                    </div>
                    <Badge className="bg-green-500">+10</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Teclado Mecânico</p>
                      <p className="text-sm text-gray-500">Hoje, 12:15</p>
                    </div>
                    <Badge className="bg-red-500">-2</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Webcam HD</p>
                      <p className="text-sm text-gray-500">Ontem, 16:45</p>
                    </div>
                    <Badge className="bg-green-500">+5</Badge>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full text-blue-600">
                  <Link to="/historico">Ver histórico completo</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Informações Rápidas</CardTitle>
                <CardDescription>Resumo do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Total de produtos</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Valor total em estoque</p>
                    <p className="text-2xl font-bold">R$ 45.750,00</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Produtos sem estoque</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
    </InventoryProvider>
  );
};

export default Index;
