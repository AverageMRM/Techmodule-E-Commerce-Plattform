import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, ProductDto } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
  <section class="hero">
    <div class="hero-content">
      <h1>Techmodule Shop</h1>
      <p>Modern, minimalistisch & clean – entdecke unsere Produkte.</p>
    </div>
  </section>

  <section class="filters">
    <button *ngFor="let c of categories" (click)="setCategory(c)" [class.active]="selected===c">{{ c }}</button>
  </section>

  <section class="grid">
    <div class="card" *ngFor="let p of filtered">
      <div class="card-media">
        <img [src]="productImage(p)" (error)="imgError($event)" [alt]="p.title"/>
      </div>
      <div class="card-body">
        <h3>{{ p.title }}</h3>
        <p class="desc">{{ p.description }}</p>
        <div class="price">{{ (p.priceCents || 0) / 100 | currency:(p.currency || 'CHF'):'symbol':'1.2-2':'de-CH' }}</div>
        <div class="actions">
          <button class="btn" (click)="addToCart(p)">In den Warenkorb</button>
        </div>
      </div>
    </div>
    <div class="empty-state" *ngIf="filtered.length === 0">
      Es sind keine Produkte in dieser Kategorie verfügbar
    </div>
  </section>
  `,
  styles: [`
    .hero { padding: 48px 16px; text-align:center; }
    .hero h1 { margin:0 0 6px; font-size: 40px; letter-spacing: -0.02em; color:#0f172a; }
    .hero p { color:#475569; margin: 0; }
    .filters { display:flex; gap:8px; padding: 0 24px 8px; flex-wrap: wrap; }
    .filters button { border:1px solid #e5e7eb; background:#fff; padding:6px 12px; border-radius:999px; cursor:pointer; }
    .filters button.active { background:#0f172a; color:#fff; border-color:#1f2937; }
    .btn { background:#0f172a; color:#fff; border:1px solid #1f2937; padding:10px 16px; border-radius:8px; cursor:pointer; transition: transform .12s ease, box-shadow .12s ease; }
    .btn:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(2,6,23,.15); }
    .grid { display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap:24px; padding:24px; }
    @media (max-width: 900px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
    .card { background:#fff; border:1px solid #eee; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; transition: transform .15s ease, box-shadow .15s ease; }
    .card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(2,6,23,.12); }
    .card-media { background:linear-gradient(135deg,#f3f4f6,#e5e7eb); aspect-ratio: 4/3; display:flex; align-items:center; justify-content:center; }
    .card-media img { width:100%; height:100%; object-fit:cover; display:block; }
    .card-body { padding:16px; display:flex; flex-direction:column; gap:8px; }
    .price { font-weight:600; color:#111827; }
    .actions { display:flex; gap:12px; align-items:center; }
    .desc { color:#6b7280; min-height: 2.6em; }
    .empty-state { grid-column: 1 / -1; text-align:center; color:#6b7280; padding: 24px 0; }
  `]
})
export class HomeComponent implements OnInit {
  products: ProductDto[] = [];
  filtered: ProductDto[] = [];
  categories = ['Alle', 'Bekleidung', 'Accessoires', 'Haushalt'];
  selected: string = 'Alle';

  constructor(private api: ApiService, private cart: CartService) {}

  ngOnInit() {
    this.api.getProducts().subscribe((res: { content: ProductDto[] } | ProductDto[]) => {
      this.products = Array.isArray(res) ? res : (res.content ?? []);
      this.applyFilter();
    });
  }

  setCategory(c: string) { this.selected = c; this.applyFilter(); }

  private applyFilter() {
    if (this.selected === 'Alle') { this.filtered = this.products; return; }
    const map: Record<string, string> = {
      'basic-tshirt': 'Bekleidung',
      'leder-geldboerse': 'Accessoires'
    };
    this.filtered = this.products.filter(p => (map[p.slug] || 'Sonstiges') === this.selected);
  }

  productImage(p: ProductDto) {
    return '/assets/products/' + p.slug + '.svg';
  }
  imgError(ev: Event) {
    const el = ev.target as HTMLImageElement; el.src = '/assets/products/placeholder.svg';
  }

  addToCart(p: ProductDto) {
    this.cart.add(p, 1);
  }
}
