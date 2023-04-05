import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosPerfilComponent } from './usuarios-perfil.component';

describe('UsuariosPerfilComponent', () => {
  let component: UsuariosPerfilComponent;
  let fixture: ComponentFixture<UsuariosPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosPerfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
