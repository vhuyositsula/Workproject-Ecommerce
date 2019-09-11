import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTrolleyComponent } from './product-trolley.component';

describe('ProductTrolleyComponent', () => {
  let component: ProductTrolleyComponent;
  let fixture: ComponentFixture<ProductTrolleyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTrolleyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTrolleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
