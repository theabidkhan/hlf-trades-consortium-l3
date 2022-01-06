import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBanksComponent } from './list-banks.component';

describe('ListBanksComponent', () => {
  let component: ListBanksComponent;
  let fixture: ComponentFixture<ListBanksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBanksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
