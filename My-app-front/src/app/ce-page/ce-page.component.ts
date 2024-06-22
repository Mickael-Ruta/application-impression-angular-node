import { UpperCasePipe, TitleCasePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { EtudiantService } from '../../services/etudiant/etudiant.service';
import { Ietudiant } from '../../interfaces/interface';
import { QRCodeModule } from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FormsModule } from '@angular/forms';

interface NombreGrade {
  [key: string]: number[]; // Signature d'index : chaque clé est une chaîne et la valeur est un tableau de nombres
}

declare const M:any
@Component({
  selector: 'app-ce-page',
  standalone: true,
  imports: [UpperCasePipe,TitleCasePipe,QRCodeModule,FormsModule,NgFor,NgIf],
  templateUrl: './ce-page.component.html',
  styleUrl: './ce-page.component.scss'
})
export class CePageComponent implements OnInit, AfterViewInit{

  constructor(private etudiantService:EtudiantService){}

  ngOnInit(): void {
      this.getAllEtudiant()
  }

  ngAfterViewInit(): void {
      M.AutonInit()
  }

  public listEtudiant: Ietudiant[];
  public filteredEtudiants: Ietudiant[];
  public niveaux: string[] = ['Tout', 'L1', 'L2', 'L3', 'M1', 'M2'];
  public parcours: string[] = ['Tout', 'DA2I', 'RPM', 'AES'];
  public selectedNiveau: string = 'Tout';
  public selectedParcours: string = 'Tout';

  public nombreGrade :NombreGrade= {
    'L1': [0],
    'L2': [0, 1],
    'L3': [0, 1, 2],
    'M1': [0, 1, 1, 1],
    'M2': [0, 1, 1, 2, 2]
  }

  public getAllEtudiant(){
    this.etudiantService.getAllEtu().subscribe(
      {
        next : res =>{
          this.listEtudiant=res
          this.filteredEtudiants=res
        },
        error : err =>{
          console.log(err);
      }

      }
    )
  }
  public applyFilters(): void {
    this.filteredEtudiants = this.listEtudiant.filter(etudiant => {

      const niveauCondition = this.selectedNiveau === 'Tout' || etudiant.niveau === this.selectedNiveau;
      const parcoursCondition = this.selectedParcours === 'Tout' || etudiant.mention === this.selectedParcours;
      return niveauCondition && parcoursCondition;
    });
  }

  public generateCE() {
    const elements = document.querySelectorAll('.hidden-ce'); // Sélectionner tous les éléments avec la classe 'hidden-ce'
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageHeight = 295; // Hauteur de la page A4 en mm
    const pageWidth = 160; // Largeur de la page A4 en mm
    const margin = 10; // Marge en mm
    const imgWidth = pageWidth - 2 * margin; // Largeur de l'image avec marges
    let currentPageHeight = margin; // Initialiser avec la marge supérieure

    const generatePDF = async () => {
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLElement;
        const canvas = await html2canvas(element);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL('image/png');

        if (currentPageHeight + imgHeight > pageHeight - margin) {
          pdf.addPage();
          currentPageHeight = margin; // Réinitialiser avec la marge supérieure
        }

        pdf.addImage(imgData, 'PNG', margin, currentPageHeight, imgWidth, imgHeight);
        currentPageHeight += imgHeight + margin; // Ajouter l'image et la marge inférieure
      }
      pdf.save('ce.pdf');
    };

    generatePDF();
  }


}
