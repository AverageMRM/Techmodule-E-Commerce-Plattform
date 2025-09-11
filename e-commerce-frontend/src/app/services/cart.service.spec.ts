import { CartService } from './cart.service';
import { ProductDto } from './api.service';

function makeProduct(id: number, priceCents = 1000): ProductDto {
  return { id, slug: 'p-' + id, title: 'P' + id, priceCents, currency: 'CHF' } as any;
}

describe('CartService', () => {
  let service: CartService;
  const storageKey = 'cart_items_v1';

  beforeEach(() => {
    localStorage.clear();
    service = new CartService();
  });

  it('adds items and computes total', () => {
    service.add(makeProduct(1, 2500), 2);
    service.add(makeProduct(2, 500), 1);
    const items = service.getItems();
    expect(items.length).toBe(2);
    expect(service.totalCents()).toBe(2500 * 2 + 500);
  });

  it('updates quantity and removes when zero', () => {
    service.add(makeProduct(1, 1000), 1);
    service.update(1, 3);
    expect(service.getItems()[0].qty).toBe(3);
    service.update(1, 0);
    expect(service.getItems().length).toBe(0);
  });

  it('removes specific product', () => {
    service.add(makeProduct(1), 1);
    service.add(makeProduct(2), 1);
    service.remove(1);
    const ids = service.getItems().map(i => i.product.id);
    expect(ids).toEqual([2]);
  });

  it('persists to localStorage', () => {
    service.add(makeProduct(9), 1);
    const raw = localStorage.getItem(storageKey);
    expect(raw).toContain('"product"');
  });
});
