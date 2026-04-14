// src/types/index.ts

export interface Tier {
  id: number;
  min_quantity: number;
  price: string;
}

export interface ApiProduct {
  id: number;
  category_id: number;
  sku: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  image_url: string | null;
  tiers: Tier[];
}



export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
}


export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
}


export interface ApiAddress {
  id: number;
  street_and_number: string;
  neighborhood: string;
  references: string | null;
  is_default: boolean;
}



export interface ApiOrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: string;
  product:ApiProduct;
}

export interface ApiOrder {
  id: number;
  total: string;
  status: string;
  created_at: string;
  items: ApiOrderItem[];
  statusColor: string;
}



export interface AdminOrder {
  id: number;
  total: string;
  subtotal: string;
  shipping_cost: string;
  status: string;
  created_at: string;
  notes: string | null;
  user: { name: string; email: string };
  address: { street_and_number: string; neighborhood: string; references: string | null };
  items: {
    id: number;
    quantity: number;
    price: string;
    product: { name: string; sku: string };
  }[];
}