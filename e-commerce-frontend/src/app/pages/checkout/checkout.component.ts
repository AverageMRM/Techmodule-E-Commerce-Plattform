import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <section class="checkout">
    <h2>Zahlung</h2>
    <div class="summary">
      Gesamtbetrag: <strong>{{ totalCents/100 | currency:'CHF':'symbol':'1.2-2':'de-CH' }}</strong>
    </div>

    <div class="card-box">
      <label for="card-element">Kartendaten</label>
      <div id="card-element" class="card-element"></div>
    </div>

    <div class="actions">
      <button class="btn" [disabled]="processing || totalCents<=0" (click)="pay()">
        {{ processing ? 'Verarbeite…' : 'Mit Karte zahlen' }}
      </button>
      <div class="msg error" *ngIf="error">{{ error }}</div>
      <div class="msg success" *ngIf="success">Zahlung erfolgreich! Danke ✨</div>
    </div>
  </section>
  `,
  styles: [`
    .checkout { max-width: 520px; margin: 32px auto; background:#fff; border:1px solid #eee; border-radius:12px; padding:24px; }
    .summary { margin-bottom: 16px; font-size: 16px; }
    .card-box { margin: 16px 0; display:flex; flex-direction:column; gap:8px; }
    .card-element { border:1px solid #e5e7eb; padding:12px; border-radius:8px; background:#fff; }
    .actions { margin-top: 16px; display:flex; flex-direction:column; gap:8px; }
    .btn { background:#0f172a; color:#fff; border:1px solid #1f2937; padding:10px 16px; border-radius:8px; cursor:pointer; }
    .msg.error { color:#dc2626; }
    .msg.success { color:#16a34a; }
  `]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  totalCents = 0;
  processing = false;
  error: string | null = null;
  success = false;

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private card: StripeCardElement | null = null;

  constructor(private api: ApiService, private cart: CartService) {}

  async ngOnInit() {
    this.totalCents = this.cart.totalCents();
    this.stripe = await loadStripe(environment.stripePublishableKey);
    if (!this.stripe) {
      this.error = 'Stripe konnte nicht initialisiert werden.';
      return;
    }
    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
    this.card.mount('#card-element');
  }

  ngOnDestroy() {
    this.card?.unmount();
  }

  pay() {
    if (!this.stripe || !this.card) return;
    this.processing = true;
    this.error = null;
    this.success = false;

    this.api.createCheckoutSession(this.totalCents, 'CHF').subscribe({
      next: async (res: { clientSecret: string }) => {
        const stripe = this.stripe;
        const card = this.card;
        if (!stripe || !card) { this.processing = false; return; }
        const result = await stripe.confirmCardPayment(res.clientSecret, {
          payment_method: { card }
        });
        if (result.error) {
          this.error = result.error.message || 'Zahlung fehlgeschlagen.';
          this.processing = false;
        } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          this.success = true;
          this.processing = false;
          this.cart.clear();
          this.totalCents = 0;
        } else {
          this.error = 'Zahlung unklar. Bitte Support kontaktieren.';
          this.processing = false;
        }
      },
      error: (e) => {
        this.error = (e?.error?.error) || 'Fehler bei der Sitzungs-Erstellung.';
        this.processing = false;
      }
    });
  }
}
