import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { loadStripe, Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  totalCents = 0;
  processing = false;
  error: string | null = null;
  success = false;
  items: import('../../services/cart.service').CartItem[] = [];

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardNum: StripeCardNumberElement | null = null;
  private cardExp: StripeCardExpiryElement | null = null;
  private cardCvc: StripeCardCvcElement | null = null;

  constructor(private api: ApiService, private cart: CartService) {}

  async ngOnInit() {
    this.items = this.cart.getItems();
    this.totalCents = this.cart.totalCents();
    this.stripe = await loadStripe(environment.stripePublishableKey);
    if (!this.stripe) {
      this.error = 'Stripe konnte nicht initialisiert werden.';
      return;
    }
    this.elements = this.stripe.elements({ locale: 'de' });
    // Create separate elements for better layout
    this.cardNum = this.elements.create('cardNumber', { showIcon: true, style: { base: { fontSize: '16px' } } });
    this.cardExp = this.elements.create('cardExpiry', { style: { base: { fontSize: '16px' } } });
    this.cardCvc = this.elements.create('cardCvc', { style: { base: { fontSize: '16px' } } });
    this.cardNum.mount('#card-number');
    this.cardExp.mount('#card-expiry');
    this.cardCvc.mount('#card-cvc');
  }

  ngOnDestroy() {
    this.cardNum?.unmount();
    this.cardExp?.unmount();
    this.cardCvc?.unmount();
  }

  pay() {
    if (!this.stripe || !this.cardNum) return;
    this.processing = true;
    this.error = null;
    this.success = false;

    this.api.createCheckoutSession(this.totalCents, 'CHF').subscribe({
      next: async (res: { clientSecret: string }) => {
        const stripe = this.stripe;
        const card = this.cardNum;
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
          this.items = [];
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
