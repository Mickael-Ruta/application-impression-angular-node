import { AfterViewInit, Component, OnInit } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { EtudiantService } from '../../services/etudiant/etudiant.service';
import { forkJoin } from 'rxjs';
import { PaymentService } from '../../services/etudiant/payment.service';
import { Ietudiant } from '../../interfaces/interface';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  DatePipe,
  JsonPipe,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

declare const M: any;
@Component({
  selector: 'app-fiches',
  standalone: true,
  imports: [QRCodeModule, TitleCasePipe, UpperCasePipe, DatePipe,RouterModule],
  templateUrl: './fiches.component.html',
  styleUrl: './fiches.component.scss',
  providers: [JsonPipe],
})
export class FichesComponent implements OnInit, AfterViewInit {
  constructor(
    private service: PaymentService,
    private etuService: EtudiantService,
    private toast: ToastrService,
    private json: JsonPipe
  ) {}

  ngOnInit(): void {
    this.getAvaibleEtudiant();
  }

  ngAfterViewInit(): void {
    M.AutoInit();
  }

  // public generateFiche() {
  //   const element = document.querySelector('#fiche') as HTMLDivElement;
  //   const options = {
  //     filename: 'fiche.pdf',
  //     margin: 1,
  //     image: { type: 'png', quality: 1 },
  //     html2canvas: { scale: 1 },
  //     jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  //   };
  //   html2pdf().set(options).from(element).save();

  // }

  public etidiant: Ietudiant[];
  public etuAttestIsAvaible: Ietudiant[];
  public etuCeIsAvaible: Ietudiant[];

  public getAvaibleEtudiant() {
    forkJoin([
      this.service.getEtuFraisPaye(),
      this.service.getEtuFraisTranche(),
    ]).subscribe({
      next: ([res1, res2]) => {
        this.etuAttestIsAvaible = [...res1, ...res2];
        this.etuCeIsAvaible = res1;
        console.log('attestation ', this.etuAttestIsAvaible);
        console.log('ce ', this.etuCeIsAvaible);
      },
    });
  }



  public generateAttestation() {
    const element = document.getElementById('facture') as HTMLElement;

    html2canvas(element).then((canvas) => {
      // Dimensions de l'image
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF

      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('facture.pdf'); // Téléchargez le PDF
    });
  }

  public selectedEtuAtt: Ietudiant;

  public displayAtt(etu: Ietudiant) {
    this.selectedEtuAtt = etu;
    const id = this.selectedEtuAtt.matricule;
    this.etuService.getEtuByMatricule(id).subscribe({
      next: (res) => {
        if (res.att > 0) {
          this.toast.info("L'etudiant a deja une attestion");
        } else {
          const nbratt = res.att + 1;
          const data = { att: nbratt };
          this.etuService.updateAtt(id, data).subscribe({
            next: (res) => {
              setTimeout(() => {
                this.generateAttestation();
                let instance = M.Modal.getInstance(document.getElementById('etuAtt'))
                instance.close()
                this.toast.success(res.succes,'',this.toastOptions)
              }, 2000);
            },
            error: (err) => {
              console.error('a ', err);
            },
          });
        }
      },
      error: (err) => {
        console.warn('b', err);
      },
    });
  }

  public selectedEtuCe: Ietudiant;

  public displayCe(etu: Ietudiant) {
    this.selectedEtuCe = etu;
    const id = this.selectedEtuCe.matricule;
    this.etuService.getEtuByMatricule(id).subscribe({
      next: (res) => {
        if (res.ce > 0) {
          this.toast.info("L'etudiant a deja une carte d'indentite");
        } else {
          const nbrce = res.ce + 1;
          const data = { ce: nbrce };
          this.etuService.updateCe(id, data).subscribe({
            next: (res) => {
              setTimeout(() => {
                let instance = M.Modal.getInstance(document.getElementById('etuCe'))
                instance.close()
                this.toast.success(res.succes,'',this.toastOptions)
              }, 2000);
            },
            error: (err) => {
              console.error('a ', err);
            },
          });
        }
      },
      error: (err) => {
        console.warn('b', err);
      },
    });
  }
  private toastOptions = {
    timeOut: 1000,
    positionClass: 'toast-top-right',
  }
}
