
import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowLeft, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Dados fictícios de histórico para demonstração
const movimentacoes = [
  { id: 1, data: "15/05/2025", produto: "Monitor LED 24\"", tipo: "entrada", quantidade: 10, responsavel: "João Silva" },
  { id: 2, data: "15/05/2025", produto: "Teclado Mecânico", tipo: "saida", quantidade: 2, responsavel: "Maria Oliveira" },
  { id: 3, data: "15/05/2025", produto: "Webcam HD", tipo: "entrada", quantidade: 5, responsavel: "João Silva" },
  { id: 4, data: "14/05/2025", produto: "Mouse Gamer", tipo: "saida", quantidade: 1, responsavel: "Carlos Santos" },
  { id: 5, data: "14/05/2025", produto: "Cadeira de Escritório", tipo: "entrada", quantidade: 3, responsavel: "Ana Lima" },
  { id: 6, data: "13/05/2025", produto: "Fone de Ouvido", tipo: "saida", quantidade: 2, responsavel: "Pedro Costa" },
  { id: 7, data: "12/05/2025", produto: "Monitor LED 24\"", tipo: "saida", quantidade: 1, responsavel: "Maria Oliveira" },
  { id: 8, data: "11/05/2025", produto: "Teclado Mecânico", tipo: "entrada", quantidade: 5, responsavel: "João Silva" },
  { id: 9, data: "10/05/2025", produto: "Mouse Gamer", tipo: "entrada", quantidade: 3, responsavel: "Ana Lima" },
  { id: 10, data: "09/05/2025", produto: "Webcam HD", tipo: "saida", quantidade: 2, responsavel: "Carlos Santos" },
];

const Historico = () => {
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [busca, setBusca] = useState<string>("");

  // Aplicar filtros
  const movimentacoesFiltradas = movimentacoes.filter(mov => {
    const matchTipo = filtroTipo ? mov.tipo === filtroTipo : true;
    const matchBusca = busca 
      ? mov.produto.toLowerCase().includes(busca.toLowerCase()) || 
        mov.responsavel.toLowerCase().includes(busca.toLowerCase())
      : true;
    return matchTipo && matchBusca;
  });

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
        <h1 className="text-2xl font-bold mb-6">Histórico de Movimentações</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tipos</SelectItem>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-2/3 relative">
                <Input
                  placeholder="Buscar por produto ou responsável..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Data</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimentacoesFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p>Nenhuma movimentação encontrada</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  movimentacoesFiltradas.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell className="font-medium">{mov.data}</TableCell>
                      <TableCell>{mov.produto}</TableCell>
                      <TableCell>
                        {mov.tipo === "entrada" ? (
                          <Badge className="bg-green-500">Entrada</Badge>
                        ) : (
                          <Badge className="bg-red-500">Saída</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{mov.quantidade}</TableCell>
                      <TableCell>{mov.responsavel}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Historico;
