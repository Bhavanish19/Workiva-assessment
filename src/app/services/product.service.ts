import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, retry, retryWhen, delayWhen, take } from 'rxjs/operators';
import { Product, ProductFilter, PaginationConfig, LoadingState } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private loadingSubject = new BehaviorSubject<LoadingState>({ isLoading: false });
  public loading$ = this.loadingSubject.asObservable();

  private products: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 129.99,
      originalPrice: 149.99,
      discount: 13,
      description: 'High-quality wireless headphones with noise cancellation and long battery life.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      category: 'Electronics',
      brand: 'AudioTech',
      inStock: true,
      stockQuantity: 25,
      rating: 4.5,
      reviewCount: 128,
      tags: ['wireless', 'noise-cancelling', 'bluetooth'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 299.99,
      description: 'Advanced smartwatch with fitness tracking, heart rate monitor, and GPS.',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      category: 'Electronics',
      brand: 'TechWear',
      inStock: true,
      stockQuantity: 15,
      rating: 4.7,
      reviewCount: 89,
      tags: ['smartwatch', 'fitness', 'gps', 'health'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: 3,
      name: 'Laptop Backpack',
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
      description: 'Durable laptop backpack with multiple compartments and water-resistant material.',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      category: 'Accessories',
      brand: 'TravelPro',
      inStock: false,
      stockQuantity: 0,
      rating: 4.2,
      reviewCount: 156,
      tags: ['backpack', 'laptop', 'travel', 'waterproof'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-22')
    },
    {
      id: 4,
      name: 'Bluetooth Speaker',
      price: 89.99,
      description: 'Portable Bluetooth speaker with excellent sound quality and waterproof design.',
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
      category: 'Electronics',
      brand: 'SoundWave',
      inStock: true,
      stockQuantity: 32,
      rating: 4.4,
      reviewCount: 203,
      tags: ['bluetooth', 'speaker', 'portable', 'waterproof'],
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-19')
    },
    {
      id: 5,
      name: 'Fitness Tracker',
      price: 149.99,
      originalPrice: 179.99,
      discount: 17,
      description: 'Comprehensive fitness tracker with sleep monitoring and workout analysis.',
      imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop',
      category: 'Health',
      brand: 'FitLife',
      inStock: true,
      stockQuantity: 18,
      rating: 4.3,
      reviewCount: 94,
      tags: ['fitness', 'health', 'sleep', 'workout'],
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-21')
    },
    {
      id: 6,
      name: 'Gaming Mouse',
      price: 59.99,
      description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
      category: 'Electronics',
      brand: 'GameTech',
      inStock: true,
      stockQuantity: 45,
      rating: 4.6,
      reviewCount: 167,
      tags: ['gaming', 'mouse', 'rgb', 'precision'],
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-23')
    },
    {
      id: 7,
      name: 'Wireless Charger',
      price: 39.99,
      originalPrice: 49.99,
      discount: 20,
      description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
      imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
      category: 'Electronics',
      brand: 'ChargeFast',
      inStock: true,
      stockQuantity: 67,
      rating: 4.1,
      reviewCount: 78,
      tags: ['wireless', 'charger', 'qi', 'fast-charging'],
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-24')
    },
    {
      id: 8,
      name: 'Coffee Mug',
      price: 24.99,
      description: 'Insulated stainless steel coffee mug that keeps drinks hot for hours.',
      imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop',
      category: 'Home',
      brand: 'BrewMaster',
      inStock: true,
      stockQuantity: 89,
      rating: 4.8,
      reviewCount: 234,
      tags: ['coffee', 'mug', 'insulated', 'stainless-steel'],
      createdAt: new Date('2024-01-11'),
      updatedAt: new Date('2024-01-25')
    },
    {
      id: 9,
      name: 'Yoga Mat',
      price: 34.99,
      description: 'Non-slip yoga mat with excellent cushioning and eco-friendly materials.',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
      category: 'Health',
      brand: 'ZenFit',
      inStock: false,
      stockQuantity: 0,
      rating: 4.5,
      reviewCount: 145,
      tags: ['yoga', 'mat', 'non-slip', 'eco-friendly'],
      createdAt: new Date('2024-01-09'),
      updatedAt: new Date('2024-01-26')
    },
    {
      id: 10,
      name: 'Desk Lamp',
      price: 69.99,
      originalPrice: 89.99,
      discount: 22,
      description: 'LED desk lamp with adjustable brightness and color temperature.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      category: 'Home',
      brand: 'LightPro',
      inStock: true,
      stockQuantity: 23,
      rating: 4.4,
      reviewCount: 112,
      tags: ['led', 'desk', 'lamp', 'adjustable'],
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-27')
    }
  ];

  constructor() { }

  private setLoading(isLoading: boolean, error?: string): void {
    this.loadingSubject.next({ isLoading, error });
  }

  getProducts(filter?: ProductFilter, pagination?: PaginationConfig): Observable<{ products: Product[], pagination: PaginationConfig }> {
    this.setLoading(true);
    
    return of(this.products).pipe(
      delay(Math.random() * 1000 + 500), // Simulate variable network delay
      map(products => {
        let filteredProducts = [...products];

        // Apply filters
        if (filter) {
          if (filter.searchTerm) {
            const searchTerm = filter.searchTerm.toLowerCase();
            filteredProducts = filteredProducts.filter(product =>
              product.name.toLowerCase().includes(searchTerm) ||
              product.description.toLowerCase().includes(searchTerm) ||
              product.brand?.toLowerCase().includes(searchTerm) ||
              product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
            );
          }

          if (filter.category) {
            filteredProducts = filteredProducts.filter(product => 
              product.category === filter.category
            );
          }

          if (filter.brand) {
            filteredProducts = filteredProducts.filter(product => 
              product.brand === filter.brand
            );
          }

          if (filter.minPrice !== undefined) {
            filteredProducts = filteredProducts.filter(product => 
              product.price >= filter.minPrice!
            );
          }

          if (filter.maxPrice !== undefined) {
            filteredProducts = filteredProducts.filter(product => 
              product.price <= filter.maxPrice!
            );
          }

          if (filter.inStock !== undefined) {
            filteredProducts = filteredProducts.filter(product => 
              product.inStock === filter.inStock
            );
          }

          if (filter.rating !== undefined) {
            filteredProducts = filteredProducts.filter(product => 
              (product.rating || 0) >= filter.rating!
            );
          }
        }

        // Apply pagination
        const totalItems = filteredProducts.length;
        const pageSize = pagination?.pageSize || 6;
        const page = pagination?.page || 1;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        const paginationResult: PaginationConfig = {
          page,
          pageSize,
          totalItems,
          totalPages
        };

        this.setLoading(false);
        return { products: paginatedProducts, pagination: paginationResult };
      }),
      catchError(error => {
        this.setLoading(false, 'Failed to load products. Please try again.');
        return throwError(() => error);
      }),
      retryWhen(errors =>
        errors.pipe(
          delayWhen(() => of(null).pipe(delay(1000))),
          take(3)
        )
      )
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    this.setLoading(true);
    
    return of(this.products.find(p => p.id === id)).pipe(
      delay(300),
      map(product => {
        this.setLoading(false);
        return product;
      }),
      catchError(error => {
        this.setLoading(false, 'Failed to load product details.');
        return throwError(() => error);
      })
    );
  }

  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.products.map(p => p.category).filter((category): category is string => Boolean(category)))];
    return of(categories).pipe(delay(200));
  }

  getBrands(): Observable<string[]> {
    const brands = [...new Set(this.products.map(p => p.brand).filter((brand): brand is string => Boolean(brand)))];
    return of(brands).pipe(delay(200));
  }

  getFeaturedProducts(limit: number = 4): Observable<Product[]> {
    const featured = this.products
      .filter(p => p.rating && p.rating >= 4.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
    
    return of(featured).pipe(delay(300));
  }

  getRelatedProducts(productId: number, limit: number = 4): Observable<Product[]> {
    const product = this.products.find(p => p.id === productId);
    if (!product) {
      return of([]);
    }

    const related = this.products
      .filter(p => p.id !== productId && p.category === product.category)
      .slice(0, limit);

    return of(related).pipe(delay(300));
  }

  searchProducts(searchTerm: string): Observable<Product[]> {
    if (!searchTerm.trim()) {
      return of([]);
    }

    const term = searchTerm.toLowerCase();
    const results = this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.brand?.toLowerCase().includes(term) ||
      product.tags?.some(tag => tag.toLowerCase().includes(term))
    );

    return of(results).pipe(delay(300));
  }
}