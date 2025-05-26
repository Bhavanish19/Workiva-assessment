import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Output() productSelected = new EventEmitter<Product>();

  isInCart = false;
  cartQuantity = 0;
  isAddingToCart = false;
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to cart changes for this product
    this.cartService.isInCart(this.product.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(inCart => {
        this.isInCart = inCart;
      });

    this.cartService.getCartItemQuantity(this.product.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(quantity => {
        this.cartQuantity = quantity;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onProductClick(): void {
    this.productSelected.emit(this.product);
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    
    if (!this.product.inStock || this.isAddingToCart) {
      return;
    }

    this.isAddingToCart = true;
    
    // Simulate a brief loading state
    setTimeout(() => {
      this.cartService.addToCart(this.product, 1);
      this.isAddingToCart = false;
    }, 300);
  }

  onRemoveFromCart(event: Event): void {
    event.stopPropagation();
    this.cartService.removeFromCart(this.product.id);
  }

  onUpdateQuantity(event: Event, quantity: number): void {
    event.stopPropagation();
    this.cartService.updateQuantity(this.product.id, quantity);
  }

  getDiscountedPrice(): number {
    if (this.product.discount && this.product.originalPrice) {
      return this.product.originalPrice * (1 - this.product.discount / 100);
    }
    return this.product.price;
  }

  getStarArray(): boolean[] {
    const rating = this.product.rating || 0;
    const stars: boolean[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  getStockStatusClass(): string {
    if (!this.product.inStock) {
      return 'out-of-stock';
    }
    if ((this.product.stockQuantity || 0) <= 5) {
      return 'low-stock';
    }
    return 'in-stock';
  }

  getStockStatusText(): string {
    if (!this.product.inStock) {
      return 'Out of Stock';
    }
    if ((this.product.stockQuantity || 0) <= 5) {
      return `Only ${this.product.stockQuantity} left`;
    }
    return 'In Stock';
  }

  trackByFn(index: number): number {
    return index;
  }
}
