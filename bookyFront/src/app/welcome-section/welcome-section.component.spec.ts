import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeSectionComponent } from './welcome-section.component';

describe('WelcomeSectionComponent', () => {
  let component: WelcomeSectionComponent;
  let fixture: ComponentFixture<WelcomeSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeSectionComponent]
    });
    fixture = TestBed.createComponent(WelcomeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
