import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturarEvidencia3Component } from './capturar-evidencia3.component';

describe('CapturarEvidencia3Component', () => {
  let component: CapturarEvidencia3Component;
  let fixture: ComponentFixture<CapturarEvidencia3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapturarEvidencia3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturarEvidencia3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
