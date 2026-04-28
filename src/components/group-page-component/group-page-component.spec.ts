import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPageComponent } from './group-page-component';

describe('GroupPageComponent', () => {
  let component: GroupPageComponent;
  let fixture: ComponentFixture<GroupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
