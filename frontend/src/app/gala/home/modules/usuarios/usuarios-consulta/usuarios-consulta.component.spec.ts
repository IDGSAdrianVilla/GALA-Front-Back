import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosConsultaComponent } from './usuarios-consulta.component';

describe('UsuariosConsultaComponent', () => {
  let component: UsuariosConsultaComponent;
  let fixture: ComponentFixture<UsuariosConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosConsultaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
