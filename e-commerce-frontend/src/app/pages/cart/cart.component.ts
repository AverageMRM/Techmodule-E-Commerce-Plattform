import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <section class="cart">
      <h2>Warenkorb</h2>
      <div *ngIf="items.length === 0" class="empty">Dein Warenkorb ist leer.</div>
      <div class="list" *ngIf="items.length > 0">
        <div class="row" *ngFor="let it of items">
          <div class="title">{{ it.product.title }}</div>
          <div class="qty">
            <button (click)="decrement(it.product.id)">−</button>
            <span>{{ it.qty }}</span>
            <button (click)="increment(it.product.id)">+</button>
          </div>
          <div class="line">
            {{ ((it.product.priceCents || 0) * it.qty) / 100
            | currency:(it.product.currency || 'CHF'):'symbol':'1.2-2':'de-CH' }}
          </div>
          <button class="remove" (click)="remove(it.product.id)">Entfernen</button>
        </div>
        <div class="total">
          Total: <strong>{{ totalCents() / 100 | currency:'CHF':'symbol':'1.2-2':'de-CH' }}</strong>
        </div>
        <div class="actions">
          <a class="btn" routerLink="/checkout">Zur Kasse</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cart { max-width: 800px; margin: 32px auto; background:#fff; border:1px solid #eee; border-radius:12px; padding:24px; }
    .row { display:grid; grid-template-columns: 1fr auto auto auto; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid #f3f4f6; }
    .row:last-child { border-bottom:none; }
    .qty { display:flex; align-items:center; gap:8px; }
    .qty button { width:28px; height:28px; border-radius:6px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; }
    .remove { background:none; border:none; color:#ef4444; cursor:pointer; }
    .total { text-align:right; padding-top:12px; }
    .actions { text-align:right; margin-top:16px; }
    .btn { background:#0f172a; color:#fff; border:1px solid #1f2937; padding:10px 16px; border-radius:8px; cursor:pointer; text-decoration:none; }
    .empty { color:#6b7280; }
  `]
})
export class CartComponent implements OnInit {
  items: import('../../services/cart.service').CartItem[] = [];

  constructor(private cart: CartService) {}

  ngOnInit(): void {
    this.items = this.cart.getItems();
  }

  increment(productId: number) {
    const item = this.items.find(i => i.product.id === productId);
    if (!item) return;
    this.cart.update(productId, item.qty + 1);
    this.items = this.cart.getItems();
  }

  decrement(productId: number) {
    const item = this.items.find(i => i.product.id === productId);
    if (!item) return;
    this.cart.update(productId, item.qty - 1);
    this.items = this.cart.getItems();
  }

  remove(productId: number) {
    this.cart.remove(productId);
    this.items = this.cart.getItems();
  }

  totalCents() {
    return this.cart.totalCents();
  }
}
