import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { ApiService, ProductDto } from '../../services/api.service';
import { CartService } from '../../services/cart.service';

class ApiStub {
  products: ProductDto[] = [{ id: 1, slug: 'basic', title: 'Basic', priceCents: 1000, currency: 'CHF' }];
  getProducts() { return of({ content: this.products }); }
}

class CartStub {
  added: any[] = [];
  add(p: ProductDto, qty: number) { this.added.push({ p, qty }); }
}

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: ApiService, useClass: ApiStub },
        { provide: CartService, useClass: CartStub }
      ]
    }).compileComponents();
  });

  it('renders products and adds to cart on click', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.card').length).toBe(1);

    const btn: HTMLButtonElement | null = compiled.querySelector('.card .btn');
    expect(btn).toBeTruthy();
    btn!.click();

    const cart = TestBed.inject(CartService) as unknown as CartStub;
    expect(cart.added.length).toBe(1);
    expect(cart.added[0].p.title).toBe('Basic');
  });
});
