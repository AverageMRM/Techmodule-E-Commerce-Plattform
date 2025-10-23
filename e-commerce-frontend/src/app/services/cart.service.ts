import { Injectable } from '@angular/core';
import { ProductDto } from './api.service';

export interface CartItem {
  product: ProductDto;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'cart_items_v1';

  getItems(): CartItem[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  setItems(items: CartItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  add(product: ProductDto, qty: number = 1) {
    const items = this.getItems();
    const idx = items.findIndex(i => i.product.id === product.id);
    if (idx >= 0) items[idx].qty += qty; else items.push({ product, qty });
    this.setItems(items);
  }

  update(productId: number, qty: number) {
    let items = this.getItems();
    items = items.map(i => i.product.id === productId ? { ...i, qty } : i).filter(i => i.qty > 0);
    this.setItems(items);
  }

  remove(productId: number) {
    const items = this.getItems().filter(i => i.product.id !== productId);
    this.setItems(items);
  }

  clear() {
    this.setItems([]);
  }

  totalCents(): number {
    return this.getItems().reduce((sum, i) => sum + (i.product.priceCents || 0) * i.qty, 0);
  }
}
