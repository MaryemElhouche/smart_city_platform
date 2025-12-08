import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesMap } from './vehicles-map';

describe('VehiclesMap', () => {
  let component: VehiclesMap;
  let fixture: ComponentFixture<VehiclesMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclesMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclesMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
