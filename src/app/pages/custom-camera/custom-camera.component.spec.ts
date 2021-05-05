import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCameraComponent } from './custom-camera.component';

describe('CustomCameraComponent', () => {
  let component: CustomCameraComponent;
  let fixture: ComponentFixture<CustomCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCameraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
