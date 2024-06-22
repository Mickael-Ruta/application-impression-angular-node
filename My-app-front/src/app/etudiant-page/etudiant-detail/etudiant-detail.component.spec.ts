import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantDetailComponent } from './etudiant-detail.component';

describe('EtudiantDetailComponent', () => {
  let component: EtudiantDetailComponent;
  let fixture: ComponentFixture<EtudiantDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtudiantDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EtudiantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
