import { TestBed } from '@angular/core/testing';

import { ExamPageGuard } from './exam-page.guard';

describe('ExamPageGuard', () => {
  let guard: ExamPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ExamPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
