import { animate, state, style, transition, trigger } from '@angular/animations';
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { Iuser } from '../../interfaces/interface';
import { map } from 'rxjs';
import { TitleCasePipe } from '@angular/common';

export const slideAnimation = trigger('slide', [
  state('void', style({ transform: 'translateX(-100%)' })),
  transition(':enter, :leave', [animate('500ms ease-in-out')]),
]);

declare const M:any
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule,TitleCasePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations:[slideAnimation]
})
export class DashboardComponent implements OnInit,AfterViewInit{

  constructor(private route:ActivatedRoute,private logservice :LoginService,private router : Router){}
  ngOnInit(): void {
    this.getUserConnected()
  }
  ngAfterViewInit(): void {
    var height = window.innerHeight
    this.naV.nativeElement.style.height=height+20+'px'
    M.AutoInit()
  }

  public list=[
    {
      icon:'bx bx-home  black-text',
      nom:'DASHBOARD',
      route:'/dashboard/actu'
    },
    {
      icon:'bx bx-group  black-text',
      nom:'ETUDIANTS',
      route:'/dashboard/etudiant'
    },
    {
      icon:'bx bx-money  black-text',
      nom:'PAYEMENT',
      route:'/dashboard/payement'
    },
    {
      icon:'bx bx-printer  black-text',
      nom:'IMPRESSIONS',
      route:'/dashboard/fiche'
    },
  ]

  @ViewChild('navVerticale') naV!: ElementRef

  trackByIdx(index: number, item: any): number {
    return index;
  }

  public load : boolean = false

  public deconnexion(){
    const token = localStorage.getItem('token')
    if(token){
      this.load=true
      setTimeout(()=>{
        localStorage.removeItem('token')
      this.logservice.isAuth()
      this.router.navigate(['/login'])
      },1500)
    }
  }

  public userConnected : Iuser

  public getUserConnected(){
    const token = localStorage.getItem('token')

    if(token){
      this.logservice.getUser(JSON.parse(token))
      .pipe(
        map((l)=>l.user)
      )
      .subscribe({
        next : (res=>{
          this.userConnected=res
          console.log('user connecte',this.userConnected)
        })
      })
    }
  }

}
