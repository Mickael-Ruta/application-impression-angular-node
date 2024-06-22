import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EtudiantService } from '../../../services/etudiant/etudiant.service';
import { Ietudiant } from '../../../interfaces/interface';
import { DatePipe, NgClass } from '@angular/common';

declare const M: any;
@Component({
  selector: 'app-etudiant-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgClass],
  templateUrl: './etudiant-form.component.html',
  styleUrl: './etudiant-form.component.scss',
  providers: [EtudiantService, DatePipe],
  animations: [],
})
export class EtudiantFormComponent implements OnInit, AfterViewInit {
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private service: EtudiantService,
    private router: Router,
    private date: DatePipe
  ) {}

  ngOnInit(): void {
    this.controlForm();
    this.ValueFormUpdate();
  }

  ngAfterViewInit(): void {
    M.AutoInit();
  }

  get(event: Event) {
    if (event.target !== null) {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.files && inputElement.files.length > 0) {
        const selectedFile: File = inputElement.files[0];
        console.log(selectedFile);
      }
    }
  }

  public stepNumber: number = 0;

  public nextStep(): void {
    if (this.stepNumber < 4) {
      if (this.validStep()) {
        this.stepNumber += 1;
      } else {
        this.toast.error('Un erreur est survenue', '', this.toastOptions);
      }
    }
  }

  public validStep(): boolean {
    const stepControls = this.form.get(
      `etape${this.stepNumber + 1}`
    ) as FormGroup;
    return stepControls.valid;
  }
  public prevStep(): void {
    if (this.stepNumber > 0) {
      this.stepNumber -= 1;
    }
  }

  @ViewChild('camera') cam: ElementRef;
  @ViewChild('champ') champ: ElementRef;
  @ViewChild('formulaire') formulaire: ElementRef;
  @ViewChild('date') datIn: ElementRef;

  public downImage() {
    let input = document.getElementById('imageEtu')
    if(input){
      input.click()
    }
  }

  public form: FormGroup;
  public controlForm(): void {
    this.form = this.fb.group({
      etape1: this.fb.group({
        matricule: ['', [Validators.pattern(/^[a-zA-Z0-9]+$/)]],
        nom: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
        prenom: ['', [Validators.pattern(/^[a-zA-Z\s]+$/)]],
        mention: ['DA2I', Validators.required],
        niveau: ['L1', Validators.required],
        dateNaiss: [null, Validators.required],
        image: [null,[Validators.required]],
      }),
      etape2: this.fb.group({
        numTel: ['', Validators.required],
        cycle: ['license', Validators.required],
        sexe: ['Homme', Validators.required],
        situationMatrimonial: ['Celibataire', Validators.required],
        cin: [''],
        adress: ['', Validators.required],
      }),
      etape3: this.fb.group({
        nomPere: [''],
        prenomPere: [''],
        nomMere: [''],
        prenomMere: [''],
      }),
      etape4: this.fb.group({
        enseignementBacc: ['general', Validators.required],
        serieBacc: ['', Validators.required],
        anneeBacc: ['', Validators.required],
        numIscriBacc: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]{7}/)],
        ],
        centreBacc: ['', Validators.required],
      }),
    });
  }

  public etudiantToUpdate: Ietudiant;
  public isUpdate: boolean = false;

  public ValueFormUpdate() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getEtuByMatricule(id).subscribe({
        next: (etudiant: Ietudiant) => {
          this.etudiantToUpdate = etudiant
          this.updateForm(this.etudiantToUpdate)
        },
        error: (error) => {
          console.error("Erreur lors du chargement de l'étudiant:", error);
        },
      });
    }
  }

  private updateForm(etudiant: Ietudiant): void {
    this.isUpdate = true;
    if (etudiant) {
      this.form.patchValue({
        etape1: {
          matricule: etudiant.matricule,
          nom: etudiant.nom,
          prenom: etudiant.prenom,
          mention: etudiant.mention,
          niveau: etudiant.niveau,
          dateNaiss: this.date.transform(etudiant.dateNaiss, 'YYYY-MM-dd'),
        },
        etape2: {
          numTel: etudiant.numTel,
          cycle: etudiant.cycle,
          sexe: etudiant.sexe,
          situationMatrimonial: etudiant.situationMatrimonial,
          cin: etudiant.cin,
          adress: etudiant.adress,
        },
        etape3: {
          nomPere: etudiant.nomPere,
          prenomPere: etudiant.prenomPere,
          nomMere: etudiant.nomMere,
          prenomMere: etudiant.prenomMere,
        },
        etape4: {
          enseignementBacc: etudiant.bacc.enseignement,
          serieBacc: etudiant.bacc.serie,
          anneeBacc: etudiant.bacc.annee,
          numIscriBacc: etudiant.bacc.numIscri,
          centreBacc: etudiant.bacc.centre,
        },
      });
    }
    M.AutoInit()
  }

  public selectedImageEtu: File;

  public getImageEtu(event: any) {
    this.selectedImageEtu = event.target?.files[0] as File
  }

  public saveEtu(): void {
    if (this.form.get('etape4')?.valid) {
      let reader = new FileReader();
      reader.readAsDataURL(this.selectedImageEtu);
      reader.onload = () => {
        let imgBinaire = reader.result as string;
        const data = {
          ...this.form.get('etape2')?.value,
          ...this.form.get('etape3')?.value,
          ...this.form.get('etape4')?.value,
          ...this.form.get('etape1')?.value,
          image:imgBinaire
        };
        this.service.addEtu(data).subscribe({
          next: () => {
            this.saveCompleted('ajouté');
          },
          error: (err: any) => {
            this.toast.error(
              "Une erreur est survenue lors de l'ajout de l'étudiant",
              '',
              this.toastOptions
            );
            console.error(err);
          },
        });
      };
    }
  }

  public updateEtu() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
    let reader = new FileReader();
      reader.readAsDataURL(this.selectedImageEtu);
      reader.onload = () => {
        let imgBinaire = reader.result as string;
        const data = {
          ...this.form.get('etape2')?.value,
          ...this.form.get('etape3')?.value,
          ...this.form.get('etape4')?.value,
          ...this.form.get('etape1')?.value,
          image:imgBinaire
        };
        this.service.updateEtu(id,data).subscribe({
          next: () => {
            this.saveCompleted('modifier');
          },
          error: (err: any) => {
            this.toast.error(
              "Une erreur est survenue lors de l'ajout de l'étudiant",
              '',
              this.toastOptions
            );
            console.error(err);
          },
        });
      };
    }
  }

  public doRequest() {
    if (this.stepNumber != 3) {
      this.nextStep();
    } else {
      if (this.isUpdate) {
        this.updateEtu();
      } else {
        this.saveEtu();
      }
    }
  }

  private saveCompleted(par: string) {
    this.toast.success(`Étudiant ${par} avec succès`, '', this.toastOptions);
    this.form.reset();
    setTimeout(() => {
      this.router.navigate(['/dashboard/etudiant/etudiant-liste']);
    }, 1300);
  }
  private toastOptions = {
    timeOut: 1000,
    positionClass: 'toast-top-right',
  }
}
