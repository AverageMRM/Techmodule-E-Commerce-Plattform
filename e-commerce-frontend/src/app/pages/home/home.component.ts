import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, ProductDto } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
  <section class="hero">
    <div class="hero-content">
      <h1>Techmodule Shop</h1>
      <p>Modern, minimalistisch & clean – entdecke unsere Produkte.</p>
      <a routerLink="/cart" class="btn btn-primary">Warenkorb ansehen</a>
    </div>
  </section>

  <section class="grid">
    <div class="card" *ngFor="let p of products">
      <div class="card-media" aria-hidden="true"></div>
      <div class="card-body">
        <h3>{{ p.title }}</h3>
        <p class="desc">{{ p.description }}</p>
        <div class="price">{{ (p.priceCents || 0) / 100 | currency:(p.currency || 'CHF'):'symbol':'1.2-2':'de-CH' }}</div>
        <div class="actions">
          <button class="btn" (click)="addToCart(p)">In den Warenkorb</button>
          <a class="link" [routerLink]="['/checkout']">Kaufen</a>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .hero { padding: 64px 16px; background: linear-gradient(90deg,#111 0%,#222 100%); color:#fff; text-align:center; }
    .hero h1 { margin:0 0 8px; font-size: 40px; letter-spacing: -0.02em; }
    .hero p { opacity:.9; margin: 0 0 16px; }
    .btn { background:#111; color:#fff; border:1px solid #333; padding:10px 16px; border-radius:8px; cursor:pointer; }
    .btn-primary { background:#0f172a; border-color:#1f2937; }
    .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:16px; padding:24px; }
    .card { background:#fff; border:1px solid #eee; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; }
    .card-media { background:linear-gradient(135deg,#f3f4f6,#e5e7eb); aspect-ratio: 4/3; }
    .card-body { padding:16px; display:flex; flex-direction:column; gap:8px; }
    .price { font-weight:600; color:#111827; }
    .actions { display:flex; gap:12px; align-items:center; }
    .link { color:#2563eb; text-decoration:none; }
    .desc { color:#6b7280; min-height: 2.6em; }
  `]
})
export class HomeComponent implements OnInit {
  products: ProductDto[] = [];

  constructor(private api: ApiService, private cart: CartService) {}

  ngOnInit() {
    this.api.getProducts().subscribe((res: { content: ProductDto[] } | ProductDto[]) => {
      this.products = Array.isArray(res) ? res : (res.content ?? []);
    });
  }

  addToCart(p: ProductDto) {
    this.cart.add(p, 1);
  }
}
