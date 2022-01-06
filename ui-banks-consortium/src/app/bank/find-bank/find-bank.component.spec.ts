import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindBankComponent } from './find-bank.component';

describe('FindBankComponent', () => {
  let component: FindBankComponent;
  let fixture: ComponentFixture<FindBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
