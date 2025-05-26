import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { ProductFilter } from '../../models/product';

@Component({
  selector: 'app-product-search',
  standalone: false,
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<ProductFilter>();
  @Output() clearFilters = new EventEmitter<void>();

  searchForm: FormGroup;
  categories: string[] = [];
  brands: string[] = [];
  showAdvancedFilters = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      category: [''],
      brand: [''],
      minPrice: [''],
      maxPrice: [''],
      inStock: [''],
      rating: ['']
    });
  }

  ngOnInit(): void {
    this.loadFilterOptions();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFilterOptions(): void {
    this.productService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => this.categories = categories);

    this.productService.getBrands()
      .pipe(takeUntil(this.destroy$))
      .subscribe(brands => this.brands = brands);
  }

  private setupFormSubscriptions(): void {
    // Debounce search term changes
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.emitFilterChange());

    // Immediate changes for other filters
    ['category', 'brand', 'inStock', 'rating'].forEach(controlName => {
      this.searchForm.get(controlName)?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.emitFilterChange());
    });

    // Debounce price changes
    ['minPrice', 'maxPrice'].forEach(controlName => {
      this.searchForm.get(controlName)?.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.emitFilterChange());
    });
  }

  private emitFilterChange(): void {
    const formValue = this.searchForm.value;
    const filter: ProductFilter = {};

    if (formValue.searchTerm?.trim()) {
      filter.searchTerm = formValue.searchTerm.trim();
    }

    if (formValue.category) {
      filter.category = formValue.category;
    }

    if (formValue.brand) {
      filter.brand = formValue.brand;
    }

    if (formValue.minPrice !== null && formValue.minPrice !== '') {
      filter.minPrice = Number(formValue.minPrice);
    }

    if (formValue.maxPrice !== null && formValue.maxPrice !== '') {
      filter.maxPrice = Number(formValue.maxPrice);
    }

    if (formValue.inStock !== '') {
      filter.inStock = formValue.inStock === 'true';
    }

    if (formValue.rating !== null && formValue.rating !== '') {
      filter.rating = Number(formValue.rating);
    }

    this.filterChange.emit(filter);
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  onClearFilters(): void {
    this.searchForm.reset();
    this.showAdvancedFilters = false;
    this.clearFilters.emit();
  }

  hasActiveFilters(): boolean {
    const formValue = this.searchForm.value;
    return !!(
      formValue.searchTerm?.trim() ||
      formValue.category ||
      formValue.brand ||
      formValue.minPrice ||
      formValue.maxPrice ||
      formValue.inStock !== '' ||
      formValue.rating
    );
  }
} 