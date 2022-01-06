import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateTradeComponent } from './initiate-trade.component';

describe('InitiateTradeComponent', () => {
  let component: InitiateTradeComponent;
  let fixture: ComponentFixture<InitiateTradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiateTradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
