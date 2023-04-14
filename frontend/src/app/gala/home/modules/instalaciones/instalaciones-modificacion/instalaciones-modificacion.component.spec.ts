import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstalacionesModificacionComponent } from './instalaciones-modificacion.component';

describe('InstalacionesModificacionComponent', () => {
  let component: InstalacionesModificacionComponent;
  let fixture: ComponentFixture<InstalacionesModificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstalacionesModificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstalacionesModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
