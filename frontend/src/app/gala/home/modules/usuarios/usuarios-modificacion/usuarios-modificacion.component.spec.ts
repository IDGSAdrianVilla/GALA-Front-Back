import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosModificacionComponent } from './usuarios-modificacion.component';

describe('UsuariosModificacionComponent', () => {
  let component: UsuariosModificacionComponent;
  let fixture: ComponentFixture<UsuariosModificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosModificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
