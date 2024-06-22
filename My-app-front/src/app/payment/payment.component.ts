import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Ietudiant } from '../../interfaces/interface';
import { PaymentService } from '../../services/etudiant/payment.service';
import { AsyncPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { disableDebugTools } from '@angular/platform-browser';

declare let M: any;
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit, AfterViewInit {
  constructor(
    private service: PaymentService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router : Router
  ) {}
  ngOnInit(): void {
    this.controlForm();
  }
  ngAfterViewInit(): void {
    M.AutoInit();
  }
  public showForm: boolean = true;
  public form: FormGroup;

  private controlForm() {
    this.form = this.fb.group({
      matricule: [{value : '',disabled:true},[Validators.required]],
      banque: ['Boa', [Validators.required]],
      ref: ['', [Validators.required]],
      montant1: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      montant2: ['', [Validators.pattern(/^[0-9]+$/)]],
      date: ['', [Validators.required]],
    });
  }

  public etudiantFraisNotComplete: Ietudiant[] = [];
  public dataIsAvaible: boolean = false

  public getEtuFraisNotComplete() {
  forkJoin([
    this.service.getEtuFraisNonPaye(),
    this.service.getEtuFraisTranche(),
  ]).subscribe({
    next: ([liste1, liste2]) => {
      this.etudiantFraisNotComplete = [...liste1, ...liste2]
      setTimeout(()=>{
        this.dataIsAvaible=true
      },500)
    },
    error: (error) => {
      console.error('Erreur lors de la récupération des données:', error);
    }
  });
}

  public selectedEtu : Ietudiant
  public selectEtu(etudiant: Ietudiant) {
    this.selectedEtu=etudiant
    const etu = etudiant
    if (etu) {
      const modal = M.Modal.getInstance(document.querySelector('#search'));
      modal.close();
      if (etu.frais) {
        this.form.patchValue({
          matricule: etu.matricule,
          banque: etu.frais.banque,
          ref: etu.frais.ref,
          montant1: etu.frais.montant1,
          montant2: etu.frais.montant2,
          date: etu.frais.datePayement,
        });
      } else {
        this.form.patchValue({
          matricule: etu.matricule,
          banque : 'Boa',
          ref:'',
          montant1:null,
          montant2:null,
          date:''
        });
      }
    }
  }
  public payer() {
    if (this.form.valid) {
      const formvalue = this.form.value
      const matricule = this.selectedEtu.matricule
      const data = {
        banque: formvalue.banque,
        ref: formvalue.ref,
        montant1: formvalue.montant1,
        montant2: formvalue.montant2,
        date: formvalue.date,
      };
      this.service.doPayement(matricule, data).subscribe({
        next: () => {
          this.toast.success('Payement effectue', '', this.toastOptions)
          this.form.reset()
          setTimeout(()=>{
            this.router.navigate(['/dashboard/etudiant/etudiant-liste'])
          },1000)

        },
        error: (err) => {
          this.toast.error('Il ya une erreur');
          console.log(err);
        },
      });
    } else {
      this.toast.error('Verifier les champs', '', this.toastOptions);
    }
  }


  private toastOptions = {
    timeOut: 1000,
    positionClass: 'toast-top-right',
  };
}
