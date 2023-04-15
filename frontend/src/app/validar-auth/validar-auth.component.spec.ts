import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarAuthComponent } from './validar-auth.component';

describe('ValidarAuthComponent', () => {
  let component: ValidarAuthComponent;
  let fixture: ComponentFixture<ValidarAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidarAuthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidarAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
