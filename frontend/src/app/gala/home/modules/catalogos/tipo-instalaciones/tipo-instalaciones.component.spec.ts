import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoInstalacionesComponent } from './tipo-instalaciones.component';

describe('TipoInstalacionesComponent', () => {
  let component: TipoInstalacionesComponent;
  let fixture: ComponentFixture<TipoInstalacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoInstalacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoInstalacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
