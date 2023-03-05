import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesModificacionComponent } from './clientes-modificacion.component';

describe('ClientesModificacionComponent', () => {
  let component: ClientesModificacionComponent;
  let fixture: ComponentFixture<ClientesModificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientesModificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
