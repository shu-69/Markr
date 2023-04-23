import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PencilLoaderComponent } from './pencil-loader.component';

describe('PencilLoaderComponent', () => {
  let component: PencilLoaderComponent;
  let fixture: ComponentFixture<PencilLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PencilLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PencilLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
