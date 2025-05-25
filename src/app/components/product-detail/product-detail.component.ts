import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product || null;
        this.loading = false;
        
        if (!product) {
          this.error = 'Product not found';
        }
      },
      error: (error) => {
        this.error = 'Failed to load product details';
        this.loading = false;
        console.error('Error loading product:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
