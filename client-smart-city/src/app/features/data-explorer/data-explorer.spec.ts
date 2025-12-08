import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorer } from './data-explorer';

describe('DataExplorer', () => {
  let component: DataExplorer;
  let fixture: ComponentFixture<DataExplorer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataExplorer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataExplorer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
