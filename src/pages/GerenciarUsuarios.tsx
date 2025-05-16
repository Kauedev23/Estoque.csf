
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, UserCheck, UserX } from "lucide-react";

interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  full_name: string | null;
  role: string;
}

const GerenciarUsuarios = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Como admins podem ver todos os perfis (devido às políticas de RLS),
      // podemos buscar diretamente da tabela de perfis
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Buscar detalhes dos usuários (emails) via função de admin seria melhor,
      // mas para este exemplo simples, vamos assumir que temos apenas os dados do perfil
      const usersWithProfiles: UserWithProfile[] = profiles.map(profile => ({
        id: profile.id,
        email: "Carregando...", // Em um sistema real, isso viria via Admin API ou Edge Function
        created_at: profile.created_at,
        full_name: profile.full_name,
        role: profile.role
      }));
      
      setUsers(usersWithProfiles);
    } catch (error: any) {
      console.error("Erro ao buscar usuários:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'operator' : 'admin';
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      // Atualizar localmente
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast.success(`Usuário ${currentRole === 'admin' ? 'rebaixado' : 'promovido'} com sucesso`);
    } catch (error: any) {
      console.error("Erro ao alterar papel do usuário:", error);
      toast.error("Erro ao alterar papel do usuário");
    }
  };

  return (
    <Layout requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={fetchUsers}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuários do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-2" />
                        <p className="text-gray-500">Carregando usuários...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name || "Sem nome"} 
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.role === 'admin' ? 'Administrador' : 'Operador'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserRole(user.id, user.role)}
                          className={user.role === 'admin' ? 'text-amber-600' : 'text-blue-600'}
                        >
                          {user.role === 'admin' ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Tornar Operador
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Tornar Admin
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GerenciarUsuarios;
