
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  ArrowLeft, 
  Search, 
  RefreshCw,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Movement {
  id: string;
  product_id: string;
  quantity_change: number;
  movement_type: string;
  notes: string | null;
  created_at: string;
  product: {
    name: string;
    category: string;
  };
}

const Historico = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadMovements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory_movements')
        .select(`
          *,
          product:product_id (
            name,
            category
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }

      setMovements(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar movimentações:", err);
      toast.error('Erro ao carregar histórico de movimentações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const filteredMovements = movements.filter(movement => {
    const searchLower = searchQuery.toLowerCase();
    return (
      movement.product?.name?.toLowerCase().includes(searchLower) ||
      movement.product?.category?.toLowerCase().includes(searchLower) ||
      movement.notes?.toLowerCase().includes(searchLower) ||
      movement.movement_type.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd 'de' MMMM', às' HH:mm", { locale: ptBR });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">EstoqueSimples</h1>
          </div>
          <div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Painel
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Histórico de Movimentações</h2>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar movimentações..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => loadMovements()} 
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-2" />
                        <p className="text-gray-500">Carregando movimentações...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredMovements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      {searchQuery ? (
                        <p>Nenhuma movimentação encontrada para "{searchQuery}"</p>
                      ) : (
                        <p>Nenhuma movimentação de estoque registrada</p>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(movement.created_at)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{movement.product?.name || "Produto removido"}</div>
                          <div className="text-sm text-gray-500">{movement.product?.category || "-"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {movement.movement_type === 'entrada' ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <ArrowUpCircle className="h-3 w-3 mr-1" /> Entrada
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            <ArrowDownCircle className="h-3 w-3 mr-1" /> Saída
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {movement.quantity_change > 0 ? `+${movement.quantity_change}` : movement.quantity_change}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {movement.notes || "-"}
                      </TableCell>
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
