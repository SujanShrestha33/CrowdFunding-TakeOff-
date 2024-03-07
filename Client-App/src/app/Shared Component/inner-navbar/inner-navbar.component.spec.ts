import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerNavbarComponent } from './inner-navbar.component';

describe('InnerNavbarComponent', () => {
  let component: InnerNavbarComponent;
  let fixture: ComponentFixture<InnerNavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InnerNavbarComponent]
    });
    fixture = TestBed.createComponent(InnerNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
