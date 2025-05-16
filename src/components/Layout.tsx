
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const Layout = ({ children, requireAdmin = false }: LayoutProps) => {
  const { user, profile, isAdmin, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if (requireAdmin && !isAdmin) {
        toast.error("Acesso restrito. Entre com uma conta de administrador.");
        navigate("/");
      }
    }
  }, [user, isAdmin, isLoading, requireAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 hidden md:inline">ESTOQUE TI</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/gerenciar-usuarios")}>
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Gerenciar Usuários</span>
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">{profile?.full_name || user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {profile?.full_name || "Usuário"}
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs font-medium mt-1">
                    {profile?.role === "admin" ? "Administrador" : "Operador"}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Sistema de Estoque TI
        </div>
      </footer>
    </div>
  );
};

export default Layout;
