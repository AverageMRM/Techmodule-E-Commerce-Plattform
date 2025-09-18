import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, ProductDto } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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
