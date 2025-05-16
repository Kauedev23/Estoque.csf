
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  status: string | null;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  quantity_change: number;
  movement_type: string;
  notes?: string;
  created_at: string;
}
