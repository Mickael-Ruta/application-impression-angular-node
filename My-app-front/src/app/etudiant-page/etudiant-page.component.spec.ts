import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantPageComponent } from './etudiant-page.component';

describe('EtudiantPageComponent', () => {
  let component: EtudiantPageComponent;
  let fixture: ComponentFixture<EtudiantPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtudiantPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EtudiantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
