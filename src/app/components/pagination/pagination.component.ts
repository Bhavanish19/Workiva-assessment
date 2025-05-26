import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PaginationConfig } from '../../models/product';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {
  @Input() pagination!: PaginationConfig;
  @Input() maxVisiblePages: number = 5;
  @Output() pageChange = new EventEmitter<number>();

  visiblePages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination'] && this.pagination) {
      this.calculateVisiblePages();
    }
  }

  private calculateVisiblePages(): void {
    const { page, totalPages } = this.pagination;
    const maxVisible = Math.min(this.maxVisiblePages, totalPages);
    
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    this.visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  onPageClick(page: number): void {
    if (page !== this.pagination.page && page >= 1 && page <= this.pagination.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onPreviousClick(): void {
    if (this.pagination.page > 1) {
      this.pageChange.emit(this.pagination.page - 1);
    }
  }

  onNextClick(): void {
    if (this.pagination.page < this.pagination.totalPages) {
      this.pageChange.emit(this.pagination.page + 1);
    }
  }

  onFirstClick(): void {
    if (this.pagination.page !== 1) {
      this.pageChange.emit(1);
    }
  }

  onLastClick(): void {
    if (this.pagination.page !== this.pagination.totalPages) {
      this.pageChange.emit(this.pagination.totalPages);
    }
  }

  getStartItem(): number {
    return (this.pagination.page - 1) * this.pagination.pageSize + 1;
  }

  getEndItem(): number {
    return Math.min(this.pagination.page * this.pagination.pageSize, this.pagination.totalItems);
  }
} 