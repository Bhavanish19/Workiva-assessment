export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl?: string;
    category?: string;
    inStock?: boolean;
    stockQuantity?: number;
    rating?: number;
    reviewCount?: number;
    brand?: string;
    tags?: string[];
    discount?: number;
    originalPrice?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  updatedAt: Date;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  rating?: number;
  brand?: string;
  searchTerm?: string;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
  retryCount?: number;
}
  