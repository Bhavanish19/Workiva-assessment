import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, CartItem, Cart } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'shopping_cart';
  private cartSubject = new BehaviorSubject<Cart>(this.getInitialCart());
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    // Load cart from localStorage on service initialization
    this.loadCartFromStorage();
  }

  private getInitialCart(): Cart {
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0,
      updatedAt: new Date()
    };
  }

  private loadCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
      if (savedCart) {
        const cart: Cart = JSON.parse(savedCart);
        // Convert date strings back to Date objects
        cart.updatedAt = new Date(cart.updatedAt);
        cart.items.forEach(item => {
          item.addedAt = new Date(item.addedAt);
        });
        this.cartSubject.next(cart);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.cartSubject.next(this.getInitialCart());
    }
  }

  private saveCartToStorage(cart: Cart): void {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  private calculateCartTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
      const price = item.product.discount 
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
      return sum + (price * item.quantity);
    }, 0);
    
    return { totalItems, totalPrice };
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(item => item.product.id === product.id);

    let updatedItems: CartItem[];
    
    if (existingItemIndex >= 0) {
      // Update existing item
      updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
    } else {
      // Add new item
      const newItem: CartItem = {
        product,
        quantity,
        addedAt: new Date()
      };
      updatedItems = [...currentCart.items, newItem];
    }

    const { totalItems, totalPrice } = this.calculateCartTotals(updatedItems);
    
    const updatedCart: Cart = {
      items: updatedItems,
      totalItems,
      totalPrice,
      updatedAt: new Date()
    };

    this.cartSubject.next(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.filter(item => item.product.id !== productId);
    
    const { totalItems, totalPrice } = this.calculateCartTotals(updatedItems);
    
    const updatedCart: Cart = {
      items: updatedItems,
      totalItems,
      totalPrice,
      updatedAt: new Date()
    };

    this.cartSubject.next(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.map(item => 
      item.product.id === productId 
        ? { ...item, quantity }
        : item
    );

    const { totalItems, totalPrice } = this.calculateCartTotals(updatedItems);
    
    const updatedCart: Cart = {
      items: updatedItems,
      totalItems,
      totalPrice,
      updatedAt: new Date()
    };

    this.cartSubject.next(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  clearCart(): void {
    const emptyCart = this.getInitialCart();
    this.cartSubject.next(emptyCart);
    this.saveCartToStorage(emptyCart);
  }

  getCartItemCount(): Observable<number> {
    return new Observable(observer => {
      this.cart$.subscribe(cart => observer.next(cart.totalItems));
    });
  }

  getCartTotal(): Observable<number> {
    return new Observable(observer => {
      this.cart$.subscribe(cart => observer.next(cart.totalPrice));
    });
  }

  isInCart(productId: number): Observable<boolean> {
    return new Observable(observer => {
      this.cart$.subscribe(cart => {
        const isInCart = cart.items.some(item => item.product.id === productId);
        observer.next(isInCart);
      });
    });
  }

  getCartItemQuantity(productId: number): Observable<number> {
    return new Observable(observer => {
      this.cart$.subscribe(cart => {
        const item = cart.items.find(item => item.product.id === productId);
        observer.next(item ? item.quantity : 0);
      });
    });
  }
} 