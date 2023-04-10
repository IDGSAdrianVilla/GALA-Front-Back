import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesModificacionComponent } from './reportes-modificacion.component';

describe('ReportesModificacionComponent', () => {
  let component: ReportesModificacionComponent;
  let fixture: ComponentFixture<ReportesModificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesModificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
