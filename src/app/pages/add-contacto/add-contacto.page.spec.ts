import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddContactoPage } from './add-contacto.page';

describe('AddContactoPage', () => {
  let component: AddContactoPage;
  let fixture: ComponentFixture<AddContactoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContactoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
