import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Product, ProductFilter, PaginationConfig, LoadingState } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = false;
  error = '';
  retryCount = 0;
  maxRetries = 3;

  // Filtering and pagination
  currentFilter: ProductFilter = {};
  pagination: PaginationConfig = {
    page: 1,
    pageSize: 6,
    totalItems: 0,
    totalPages: 0
  };

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.subscribeToLoadingState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToLoadingState(): void {
    this.productService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loadingState: LoadingState) => {
        this.loading = loadingState.isLoading;
        this.error = loadingState.error || '';
        this.retryCount = loadingState.retryCount || 0;
      });
  }

  loadProducts(): void {
    this.productService.getProducts(this.currentFilter, this.pagination)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.products = result.products;
          this.pagination = result.pagination;
          this.error = '';
          this.retryCount = 0;
        },
        error: (error) => {
          this.error = 'Failed to load products. Please try again.';
          console.error('Error loading products:', error);
        }
      });
  }

  onFilterChange(filter: ProductFilter): void {
    this.currentFilter = filter;
    this.pagination.page = 1; // Reset to first page when filtering
    this.loadProducts();
  }

  onClearFilters(): void {
    this.currentFilter = {};
    this.pagination.page = 1;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.pagination.page = page;
    this.loadProducts();
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onProductSelected(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  onRetry(): void {
    this.error = '';
    this.loadProducts();
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  hasActiveFilters(): boolean {
    return !!(
      this.currentFilter.searchTerm ||
      this.currentFilter.category ||
      this.currentFilter.brand ||
      this.currentFilter.minPrice ||
      this.currentFilter.maxPrice ||
      this.currentFilter.inStock !== undefined ||
      this.currentFilter.rating
    );
  }

  getFilterSummary(): string {
    const filters: string[] = [];
    
    if (this.currentFilter.searchTerm) {
      filters.push(`"${this.currentFilter.searchTerm}"`);
    }
    if (this.currentFilter.category) {
      filters.push(this.currentFilter.category);
    }
    if (this.currentFilter.brand) {
      filters.push(this.currentFilter.brand);
    }
    if (this.currentFilter.minPrice || this.currentFilter.maxPrice) {
      const min = this.currentFilter.minPrice || 0;
      const max = this.currentFilter.maxPrice || '∞';
      filters.push(`$${min} - $${max}`);
    }
    if (this.currentFilter.inStock !== undefined) {
      filters.push(this.currentFilter.inStock ? 'In Stock' : 'Out of Stock');
    }
    if (this.currentFilter.rating) {
      filters.push(`${this.currentFilter.rating}+ stars`);
    }

    return filters.join(', ');
  }
}
