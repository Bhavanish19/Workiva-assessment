import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Cart, CartItem } from '../../models/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    updatedAt: new Date()
  };

  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => this.cart = cart);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getDiscountedPrice(item: CartItem): number {
    if (item.product.discount && item.product.originalPrice) {
      return item.product.originalPrice * (1 - item.product.discount / 100);
    }
    return item.product.price;
  }

  getItemTotal(item: CartItem): number {
    return this.getDiscountedPrice(item) * item.quantity;
  }

  trackByItemId(index: number, item: CartItem): number {
    return item.product.id;
  }
} 