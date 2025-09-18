import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
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
