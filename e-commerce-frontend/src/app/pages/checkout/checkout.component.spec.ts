import { TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';

describe('CheckoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutComponent]
    }).compileComponents();
  });

  it('disables pay button when totalCents <= 0', async () => {
    const fixture = TestBed.createComponent(CheckoutComponent);
    const comp = fixture.componentInstance;
    // Prevent real ngOnInit (Stripe init)
    spyOn(comp, 'ngOnInit').and.callFake(async () => {});
    comp.totalCents = 0;
    fixture.detectChanges();

    const btn: HTMLButtonElement | null = fixture.nativeElement.querySelector('.btn');
    expect(btn).toBeTruthy();
    expect(btn!.disabled).toBeTrue();
  });
});
