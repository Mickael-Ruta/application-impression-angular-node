import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ietudiant } from '../../../interfaces/interface';
import { EtudiantService } from '../../../services/etudiant/etudiant.service';
import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-etudiant-detail',
  standalone: true,
  imports: [UpperCasePipe,TitleCasePipe,DatePipe],
  templateUrl: './etudiant-detail.component.html',
  styleUrl: './etudiant-detail.component.scss'
})
export class EtudiantDetailComponent implements OnInit{

  constructor(private route:ActivatedRoute,private router : Router,private service : EtudiantService){}

  ngOnInit(): void {
      this.getDetailEtu()
  }

  public etudiant:Ietudiant
  public dataIsAvaible :boolean=false
  public getDetailEtu(){
    const id = this.route.snapshot.paramMap.get('id')
    if(id){
      this.service.getEtuByMatricule(id).subscribe({
        next : (res=>{
          this.etudiant=res
          setTimeout(()=>{
            this.dataIsAvaible=true
          },1500)
        }),
        error :(err=>{
          console.log(err)
        })
      })
    }
  }
}
