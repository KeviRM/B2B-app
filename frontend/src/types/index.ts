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