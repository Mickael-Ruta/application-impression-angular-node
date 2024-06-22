import { AfterViewInit, Component, OnInit } from '@angular/core';
import { EtudiantService } from '../../services/etudiant/etudiant.service';
import { Ietudiant } from '../../interfaces/interface';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


declare const M : any
@Component({
  selector: 'app-reseignement-page',
  standalone: true,
  imports: [FormsModule,NgFor,NgIf],
  templateUrl: './reseignement-page.component.html',
  styleUrl: './reseignement-page.component.scss'
})
export class ReseignementPageComponent implements OnInit,AfterViewInit{

  constructor(private etudiantService:EtudiantService){}

  ngOnInit(): void {
      this.getAllEtudiant()
  }

  ngAfterViewInit(): void {
   M.AutoInit()

  }

  public listEtudiant: Ietudiant[];
  public filteredEtudiants: Ietudiant[];
  public niveaux: string[] = ['L1', 'L2', 'L3', 'M1', 'M2'];
  public parcours: string[] = ['DA2I', 'RPM', 'AES'];

  public selectedNiveau: string = 'L1';
  public selectedParcours: string = 'DA2I';
  public nombre:number = 1

  public applyFilters(): void {
    this.filteredEtudiants = this.listEtudiant.filter(etudiant => {

      const niveauCondition = this.selectedNiveau === 'Tout' || etudiant.niveau === this.selectedNiveau;
      const parcoursCondition = this.selectedParcours === 'Tout' || etudiant.mention === this.selectedParcours;
      return niveauCondition && parcoursCondition;
    });
  }

  public getAllEtudiant(){
    this.etudiantService.getAllEtu().subscribe(
      {
        next : res =>{
          this.listEtudiant=res
        },
        error : err =>{
          console.log(err);
      }

      }
    )
  }

  public async generateFiches(): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let yOffset = 10; // Ajustez le décalage vertical selon votre mise en page

    const elementToCapture = document.querySelector('.fiche_renseignement') as HTMLElement;

    if (elementToCapture) {
      for (let i = 0; i < this.nombre; i++) {
        await this.captureAndAddPage(pdf, elementToCapture, yOffset, i);
      }
      pdf.save('fiches_renseignement.pdf');
    } else {
      console.error('Element .fiche_renseignement non trouvé.');
    }
  }

  private async captureAndAddPage(pdf: jsPDF, elementToCapture: HTMLElement, yOffset: number, index: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        html2canvas(elementToCapture).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          if (index > 0) {
            pdf.addPage();
          }
          pdf.addImage(imgData, 'PNG', 10, yOffset, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20, undefined, 'FAST');
          yOffset = pdf.internal.pageSize.getHeight() * index + 10;
          resolve();
        }).catch(error => {
          console.error('Erreur lors de la génération du canvas :', error);
          reject(error);
        });
      }, 500 * index); // Attendre un peu plus à chaque itération
    });
  }

}
