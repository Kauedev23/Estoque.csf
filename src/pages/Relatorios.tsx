
import { BarChart, LineChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from "react-router-dom";
import { Package, ArrowLeft, FileBarChart, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dados fictícios para os gráficos
const dadosEstoquePorCategoria = [
  { categoria: 'Eletrônicos', quantidade: 27 },
  { categoria: 'Informática', quantidade: 15 },
  { categoria: 'Escritório', quantidade: 8 },
  { categoria: 'Móveis', quantidade: 12 },
  { categoria: 'Papelaria', quantidade: 20 },
  { categoria: 'Outros', quantidade: 5 },
];

const dadosMovimentacaoMensal = [
  { mes: 'Jan', entradas: 45, saidas: 32 },
  { mes: 'Fev', entradas: 38, saidas: 30 },
  { mes: 'Mar', entradas: 52, saidas: 45 },
  { mes: 'Abr', entradas: 40, saidas: 37 },
  { mes: 'Mai', entradas: 55, saidas: 35 },
  { mes: 'Jun', entradas: 0, saidas: 0 }, // Meses futuros
  { mes: 'Jul', entradas: 0, saidas: 0 },
  { mes: 'Ago', entradas: 0, saidas: 0 },
  { mes: 'Set', entradas: 0, saidas: 0 },
  { mes: 'Out', entradas: 0, saidas: 0 },
  { mes: 'Nov', entradas: 0, saidas: 0 },
  { mes: 'Dez', entradas: 0, saidas: 0 },
];

const dadosValorEstoque = [
  { mes: 'Jan', valor: 35000 },
  { mes: 'Fev', valor: 38000 },
  { mes: 'Mar', valor: 42000 },
  { mes: 'Abr', valor: 40000 },
  { mes: 'Mai', valor: 45750 },
];

const Relatorios = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">EstoqueSimples</h1>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Relatórios e Estatísticas</h1>

        <Tabs defaultValue="graficos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="graficos" className="flex items-center">
              <FileBarChart className="h-4 w-4 mr-2" />
              Gráficos
            </TabsTrigger>
            <TabsTrigger value="resumo" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Resumo
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="graficos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estoque por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosEstoquePorCategoria}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="categoria" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantidade" fill="#2563eb" name="Quantidade" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Movimentação Mensal</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dadosMovimentacaoMensal.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="entradas" stroke="#16a34a" fill="#16a34a" name="Entradas" />
                      <Area type="monotone" dataKey="saidas" stroke="#dc2626" fill="#ef4444" name="Saídas" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Valor do Estoque (R$)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosValorEstoque}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="valor" fill="#8b5cf6" name="Valor (R$)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="resumo">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Estoque</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informações Gerais</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total de Produtos</p>
                        <p className="text-2xl font-bold">24</p>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Categorias</p>
                        <p className="text-2xl font-bold">6</p>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Valor Total</p>
                        <p className="text-2xl font-bold">R$ 45.750</p>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Itens sem estoque</p>
                        <p className="text-2xl font-bold">3</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Movimentações do Mês</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-green-600">Entradas</p>
                        <p className="text-2xl font-bold text-green-700">55</p>
                        <p className="text-xs text-green-500 mt-1">+10% em relação ao mês anterior</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-sm text-red-600">Saídas</p>
                        <p className="text-2xl font-bold text-red-700">35</p>
                        <p className="text-xs text-red-500 mt-1">-5% em relação ao mês anterior</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Top 5 Produtos</h3>
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="grid grid-cols-4 p-3 border-b border-gray-200 font-medium text-sm">
                      <div>Produto</div>
                      <div className="text-center">Quantidade</div>
                      <div className="text-center">Preço (R$)</div>
                      <div className="text-right">Valor Total (R$)</div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <div className="grid grid-cols-4 p-3 text-sm">
                        <div>Monitor LED 24"</div>
                        <div className="text-center">15</div>
                        <div className="text-center">899,90</div>
                        <div className="text-right">13.498,50</div>
                      </div>
                      <div className="grid grid-cols-4 p-3 text-sm">
                        <div>Cadeira de Escritório</div>
                        <div className="text-center">0</div>
                        <div className="text-center">599,90</div>
                        <div className="text-right">0,00</div>
                      </div>
                      <div className="grid grid-cols-4 p-3 text-sm">
                        <div>Teclado Mecânico</div>
                        <div className="text-center">3</div>
                        <div className="text-center">349,90</div>
                        <div className="text-right">1.049,70</div>
                      </div>
                      <div className="grid grid-cols-4 p-3 text-sm">
                        <div>Webcam HD</div>
                        <div className="text-center">8</div>
                        <div className="text-center">199,90</div>
                        <div className="text-right">1.599,20</div>
                      </div>
                      <div className="grid grid-cols-4 p-3 text-sm">
                        <div>Fone de Ouvido</div>
                        <div className="text-center">4</div>
                        <div className="text-center">149,90</div>
                        <div className="text-right">599,60</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Relatorios;
