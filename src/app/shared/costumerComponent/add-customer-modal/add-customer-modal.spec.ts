import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerModal } from './add-customer-modal';

describe('AddCustomerModal', () => {
  let component: AddCustomerModal;
  let fixture: ComponentFixture<AddCustomerModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCustomerModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCustomerModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
