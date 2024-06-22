import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Ietudiant } from '../../interfaces/interface';
import { EtudiantService } from './../../services/etudiant/etudiant.service';
import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-attestation-page',
  standalone: true,
  imports: [UpperCasePipe,TitleCasePipe],
  templateUrl: './attestation-page.component.html',
  styleUrl: './attestation-page.component.scss'
})
export class AttestationPageComponent implements OnInit{

  constructor(private etudiantService:EtudiantService){}

  ngOnInit(): void {
      this.getAllEtudiant()
  }

  public listEtudiant : Ietudiant[]

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


  async generateAtt(): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let yOffset = 10; // Ajustez le décalage vertical selon votre mise en page

    for (let i = 0; i < this.listEtudiant.length; i++) {
      await this.captureAndAddPage(pdf, this.listEtudiant[i], yOffset, i);
    }

    pdf.save('attestations_etudiants.pdf');
  }

  private async captureAndAddPage(pdf: jsPDF, etudiant: Ietudiant, yOffset: number, index: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const elementToCapture = document.getElementById(`attestation-${index}`) as HTMLElement;

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
      }, 500 * index); // Attendre un peu plus à chaque itération pour éviter les chevauchements
    });
  }
}
