import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 129.99,
      description: 'High-quality wireless headphones with noise cancellation and long battery life.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      category: 'Electronics',
      inStock: true
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 299.99,
      description: 'Advanced smartwatch with fitness tracking, heart rate monitor, and GPS.',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      category: 'Electronics',
      inStock: true
    },
    {
      id: 3,
      name: 'Laptop Backpack',
      price: 79.99,
      description: 'Durable laptop backpack with multiple compartments and water-resistant material.',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
      category: 'Accessories',
      inStock: false
    },
    {
      id: 4,
      name: 'Bluetooth Speaker',
      price: 89.99,
      description: 'Portable Bluetooth speaker with excellent sound quality and waterproof design.',
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
      category: 'Electronics',
      inStock: true
    },
    {
      id: 5,
      name: 'Fitness Tracker',
      price: 149.99,
      description: 'Comprehensive fitness tracker with sleep monitoring and workout analysis.',
      imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop',
      category: 'Health',
      inStock: true
    }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    // Simulate API call with delay
    return of(this.products).pipe(delay(500));
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    // Simulate API call with delay
    return of(product).pipe(delay(300));
  }
}