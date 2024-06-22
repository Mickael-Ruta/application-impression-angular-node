import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { EtudiantFormComponent } from '../etudiant-form/etudiant-form.component';
import { EtudiantService } from '../../../services/etudiant/etudiant.service';
import { Ietudiant } from '../../../interfaces/interface';
import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare const M: any;
@Component({
  selector: 'app-etudiant',
  standalone: true,
  templateUrl: './etudiant.component.html',
  styleUrl: './etudiant.component.scss',
  imports: [
    RouterModule,
    EtudiantFormComponent,
    DatePipe,
    FormsModule,
    UpperCasePipe,
    TitleCasePipe,
  ],
  providers: [EtudiantService],
})
export class EtudiantComponent implements OnInit, AfterViewInit {
  constructor(private service: EtudiantService, private toast: ToastrService) {}

  ngOnInit(): void {
    this.getAllEtudiant();
  }
  ngAfterViewInit(): void {
    M.AutoInit();
  }

  public etudiantList: Ietudiant[];
  public dataIsAvaible : boolean = false
  public getAllEtudiant(): void {
    this.service.getAllEtu().subscribe({
      next: (list: Ietudiant[]) => {
        this.etudiantList = list
        this.filteredList = list
        setTimeout(()=>{
          this.dataIsAvaible=true
        },500)
      },
      error: (err) => console.log('il y a une erreur lors de la requete')
    });
  }

  public selectedEtudiant: Ietudiant;

  public selectEtudiant(item: Ietudiant): void {
    this.selectedEtudiant = item;
  }

  @ViewChild('deleteModal') modal: ElementRef;
  public deleteEtudiant() {
    const matricule = this.selectedEtudiant.matricule;
    this.service.deleteEtu(matricule).subscribe({
      next: (list) => {
        this.deleteCompleted()
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private deleteCompleted() {
    const modalInstance = M.Modal.getInstance(document.querySelector('#delete-modal'))
    this.toast.success('Etudiant supprimer', '', this.toastOptions);
    if(modalInstance){
      setTimeout(()=>{
        this.getAllEtudiant()
        modalInstance.close()
      },1000)
    }
  }
  private _motFilter: string = '';
  public filteredList: Ietudiant[] = [];

  public get etudiantFilter(): string {
    return this._motFilter;
  }

  public set etudiantFilter(filter: string) {
    this._motFilter = filter;
    this.filteredList = this.etudiantFilter
      ? this.filtre(this.etudiantFilter)
      : this.etudiantList;
  }

  public filtre(critere: string): Ietudiant[] {
    critere = critere.toLowerCase();
    const res = this.etudiantList.filter(
      (list: Ietudiant) => list.nom.indexOf(critere) != -1 ||
      list.prenom?.indexOf(critere) != -1 ||
      list.matricule?.indexOf(critere) != -1

    );
    return res;
  }

  private lenEtudiantList: number;

  public paginationNumber: number = 1;
  public displayPaginationNbre: number;

  public listPagination: number[] = [];

  public displayNumberList: number = 0;
  public supPage: number = 2;
  public downPage: number = 0;

  public nextPage() {
    this.supPage += 3;
    this.downPage += 3;
  }
  public prevPage() {
    this.supPage -= 3;
    this.downPage -= 3;
  }

  private pagination() {
    let res = this.lenEtudiantList / 3;
    if (this.lenEtudiantList % 3 === 0) {
      this.displayPaginationNbre = res;
      getPagination(this.displayPaginationNbre, this.listPagination);
    } else {
      this.displayPaginationNbre = Math.floor(res) + 1;
      getPagination(this.displayPaginationNbre, this.listPagination);
    }

    function getPagination(param: number, tab: number[]) {
      for (let i = 1; i <= param; i++) {
        tab.push(i);
      }
    }
  }

  private toastOptions = {
    timeOut: 1000,
    positionClass: 'toast-top-right',
  };
}
