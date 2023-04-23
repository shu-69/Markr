import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticePapersComponent } from './practice-papers.component';

describe('PracticePapersComponent', () => {
  let component: PracticePapersComponent;
  let fixture: ComponentFixture<PracticePapersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticePapersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticePapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
