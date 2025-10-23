import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ProductDto {
  id: number;
  slug: string;
  title: string;
  description?: string;
  priceCents?: number;
  currency?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getProducts(params?: any): Observable<{ content: ProductDto[] } | ProductDto[]> {
    // Backend returns a Page<Product> for /api/products; handle both Page and array just in case.
    return this.http.get<{ content: ProductDto[] } | ProductDto[]>(`${this.base}/products`, { params });
  }

  createCheckoutSession(amountCents: number, currency: string = 'CHF'): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(`${this.base}/checkout/session`, {
      amountCents,
      currency
    });
  }
}
