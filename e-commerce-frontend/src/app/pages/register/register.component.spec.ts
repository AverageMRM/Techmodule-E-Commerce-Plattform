import { TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent]
    }).compileComponents();
  });

  it('calls alert on submit (demo placeholder)', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const comp = fixture.componentInstance;
    comp.email = 'test@example.com';
    comp.password = 'secret';
    spyOn(window, 'alert');
    comp.onSubmit();
    expect(window.alert).toHaveBeenCalled();
  });
});
