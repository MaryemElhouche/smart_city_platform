import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsList } from './sensors-list';

describe('SensorsList', () => {
  let component: SensorsList;
  let fixture: ComponentFixture<SensorsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensorsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
