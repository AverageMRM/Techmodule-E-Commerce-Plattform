import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent]
    }).compileComponents();
  });

  it('calls alert on submit (demo placeholder)', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    comp.email = 'test@example.com';
    comp.password = 'secret';
    spyOn(window, 'alert');
    comp.onSubmit();
    expect(window.alert).toHaveBeenCalled();
  });
});
