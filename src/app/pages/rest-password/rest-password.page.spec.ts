import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestPasswordPage } from './rest-password.page';

describe('RestPasswordPage', () => {
  let component: RestPasswordPage;
  let fixture: ComponentFixture<RestPasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RestPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
