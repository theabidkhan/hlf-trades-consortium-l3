import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindTradeComponent } from './find-trade.component';

describe('FindTradeComponent', () => {
  let component: FindTradeComponent;
  let fixture: ComponentFixture<FindTradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindTradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
