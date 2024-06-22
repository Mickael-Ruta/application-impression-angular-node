import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Chart} from 'chart.js';
import { EtudiantService } from '../../services/etudiant/etudiant.service';
import { forkJoin, map, Observable, of} from 'rxjs';
import { AsyncPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Ietudiant } from '../../interfaces/interface';


@Component({
  selector: 'app-actu',
  standalone:true,
  templateUrl: './actu.component.html',
  styleUrls: ['./actu.component.scss'],
  imports:[AsyncPipe,TitleCasePipe,UpperCasePipe]
})
export class ActuComponent implements OnInit, AfterViewInit {

  constructor (private service : EtudiantService){}
  @ViewChild('mychart') fraisChart: ElementRef
  @ViewChild('etuChart') etuChart:ElementRef

  ngOnInit(): void {
    this.getFraisDataChart()
    this.getNombreEtuandCeandAtt()
    this.getLastAjout()
    this.getEtuByNiveauChartData()
  }

  ngAfterViewInit(): void {

  }


  public fraisChartData :number[]

  public getFraisDataChart(){
    forkJoin([
      this.service.countEtuPaye(),
      this.service.countEtuTranche(),
      this.service.countEtuNonPaye()
    ]).subscribe({
      next : (([paye,tranche,nonPaye])=>{
        this.fraisChartData=[paye.total,tranche.total,nonPaye.total]
        this.fraiChart(this.fraisChartData)
      })
    })
  }


  public etuChartData : number[]
  public getEtuByNiveauChartData(){
    this.service.getNombreEtuByNiveau()
    .subscribe({
      next : (res =>{
        this.etuChartData=[res.count.M2,res.count.M1,res.count.L3,res.count.L2,res.count.L1]
        this.etudiantChart(this.etuChartData)
      })
    })
  }

  public nbreEtuInscrit$:Observable<number>=of()
  public nbreCEimprimer$:Observable<number>=of()
  public nbreAttestation$:Observable<number>=of()
  public lastAddEtu:Ietudiant[]=[]


  public getNombreEtuandCeandAtt(){
    this.nbreEtuInscrit$=this.service.getNbreEtu()
    this.nbreCEimprimer$=this.service.getNombreCe()
    this.nbreAttestation$=this.service.getNombreAtt()
  }
  public getLastAjout(){
    this.service.getLastEtu()
    .subscribe({
      next : (list=>{
        this.lastAddEtu=list.reverse().slice(0,3)
      })
    })
  }


  public fraiChart(data: number[]) {
    const ctx = this.fraisChart.nativeElement as HTMLCanvasElement;
    const max = Math.max(...data)
    if (ctx) {
      const yAxisOptions = {
        beginAtZero: true,
        ticks: {
          precision: 0
        },
        suggestedMax:max+1
      };

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Payés', 'Tranche', 'Non Payés'],
          datasets: [{
            label: 'Frais de scolarité',
            data: data,
            borderWidth: 1,
            backgroundColor: [
              '#01589b',
              '#69beff',
              '#ff9696'

            ],
          }]
        },
        options: {
          scales: {
            y: yAxisOptions
          },
        }
      });
    }
  }

  public etudiantChart(data: number[]) {
    const ctx = this.etuChart.nativeElement as HTMLCanvasElement;
    const max = Math.max(...data)
    if (ctx) {
      const yAxisOptions = {
        beginAtZero: true,
        ticks: {
          precision: 0
        },
        suggestedMax:max+1
      };

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['M2', 'M1', 'L3','L2','L1'],
          datasets: [{
            label: 'Étudiant',
            data: data,
            borderWidth: 1,
            backgroundColor: [
              '#082b46',
              '#0a62a5',
              '#45adfc',
              '#88ccfc',
              '#9fbed6',
            ],
          }]
        },
        options: {
          scales: {
            y: yAxisOptions
          },
        }
      });
    }
  }

}
