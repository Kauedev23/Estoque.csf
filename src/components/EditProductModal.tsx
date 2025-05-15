
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useInventory } from "@/context/InventoryContext";
import { toast } from "sonner";
import { Product } from "@/types/supabase";

interface EditProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const EditProductModal = ({ product, isOpen, onClose }: EditProductModalProps) => {
  const { updateProduct } = useInventory();
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    price: product.price.toString(),
    quantity: product.quantity.toString()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Atualizar o formData quando o produto mudar
  useEffect(() => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString()
    });
  }, [product]);

  const categories = [
    "Eletrônicos", 
    "Informática", 
    "Escritório", 
    "Móveis", 
    "Papelaria",
    "Outros"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name.trim() || !formData.category || !formData.price || !formData.quantity) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // Converter preço e quantidade para números
    const price = parseFloat(formData.price);
    const quantity = parseInt(formData.quantity);

    if (isNaN(price) || price <= 0) {
      toast.error("Por favor, insira um preço válido");
      return;
    }

    if (isNaN(quantity) || quantity < 0) {
      toast.error("Por favor, insira uma quantidade válida");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Atualizar produto
      await updateProduct({
        ...product,
        name: formData.name,
        category: formData.category,
        price,
        quantity
      });

      toast.success("Produto atualizado com sucesso");
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast.error("Não foi possível atualizar o produto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="edit-name">Nome do Produto</Label>
            <Input
              id="edit-name"
              name="name"
              placeholder="Nome do produto"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="edit-category">Categoria</Label>
            <Select onValueChange={handleSelectChange} value={formData.category}>
              <SelectTrigger id="edit-category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="edit-price">Preço (R$)</Label>
            <Input
              id="edit-price"
              name="price"
              placeholder="0,00"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="edit-quantity">Quantidade</Label>
            <Input
              id="edit-quantity"
              name="quantity"
              placeholder="0"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
