export interface Product {
  id: string | number;
  slug: string;
  name?: string | { [lang: string]: string };
  title?: string | { [lang: string]: string };
  brand?: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  currency?: string;
  badges?: string[];
  onSale?: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  // Add any other fields as needed
}
