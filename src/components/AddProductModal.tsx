
import { useState } from "react";
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

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
  const { addProduct } = useInventory();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: ""
  });

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

  const handleSubmit = (e: React.FormEvent) => {
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

    // Adicionar produto
    addProduct({
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      price,
      quantity
    });

    // Limpar formulário e fechar modal
    setFormData({ name: "", category: "", price: "", quantity: "" });
    toast.success("Produto adicionado com sucesso");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nome do produto"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select onValueChange={handleSelectChange} value={formData.category}>
              <SelectTrigger id="category">
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
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
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
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              name="quantity"
              placeholder="0"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Adicionar Produto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
