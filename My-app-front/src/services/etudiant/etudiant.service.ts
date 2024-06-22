import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  count,
  map,
  take,
  tap,
  throwError,
} from 'rxjs';
import { Ichart, IetuByNiveau, Ietudiant } from '../../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class EtudiantService {
  private readonly url_ajout = 'http://localhost:3000/etudiant/ajout';
  private readonly url_get = 'http://localhost:3000/etudiant';
  private readonly url_count_nbre_etu='http://localhost:3000/nbreEtu'
  private readonly url_count = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public getAllEtu(): Observable<Ietudiant[]> {
    return this.http
      .get<Ietudiant[]>(this.url_get)
      .pipe(tap((list) => console.log(list)));
  }

  public getLastEtu(){
    return this.getAllEtu().pipe(
      tap(list=>{
        console.log('zanin eh',list)
      })
    )
  }

  public getNbreEtu(){
    return this.getAllEtu().pipe(
      map((list)=>list.length),
      tap((l)=>console.log('nombre ',l))
    )
  }
  public getEtuByMatricule(matricule: string): Observable<Ietudiant> {
    return this.http
      .get<Ietudiant[]>(`${this.url_get}/${matricule}`)
      .pipe(map((list) => list[0]));
  }
  
  public addEtu(etu: any): Observable<Ietudiant> {
    return this.http.post<any>(this.url_ajout, etu);
  }

  public updateEtu(matricule: string, body: any): Observable<Ietudiant> {
    return this.http.put<any>(`${this.url_get}/${matricule}`, body);
  }

  public deleteEtu(matricule: string): Observable<{}> {
    return this.http.delete<Ietudiant>(`${this.url_get}/${matricule}`);
  }

  public countEtuPaye(): Observable<Ichart> {
    return this.http.get<Ichart>(`${this.url_count}/nbrePaye`);
  }

  public countEtuNonPaye(): Observable<Ichart> {
    return this.http.get<Ichart>(`${this.url_count}/nbreNonPaye`);
  }

  public countEtuTranche(): Observable<Ichart> {
    return this.http.get<Ichart>(`${this.url_count}/nbreTranche`);
  }


  public getNombreEtuByNiveau():Observable<IetuByNiveau>{
    return this.http.get<IetuByNiveau>(`http://localhost:3000/nombreEtudiantByNiveau`).pipe(
      tap(list=>console.log('cfqsdf',list))
    )
  }

  public getNombreCe():Observable<number>{
    return this.http.get<{nombre:number}>(`http://localhost:3000/nombreCE`).pipe(
      map(res=>res.nombre)
    )
  }

  public getNombreAtt():Observable<number>{
    return this.http.get<{nombre:number}>(`http://localhost:3000/nombreAtt`).pipe(
      map(res=>res.nombre)
    )
  }

  public updateCe(id:string,ce:{ce:number}):Observable<{succes:string}>{
    return this.http.put<{succes:string}>(`http://localhost:3000/updateCe/${id}`,ce)
  }

  public updateAtt(id:string,att:{att:number}):Observable<{succes:string}>{
    return this.http.put<{succes:string}>(`http://localhost:3000/updateAtt/${id}`,att)
  }

  private handleError(err: HttpErrorResponse) {
    if (err.error instanceof ErrorEvent) {
      console.log('Erreur : ', err.error.message);
    } else {
      console.error(`Code d'erreur : ${err.status}, corps : ${err.error}`);
    }
    return throwError('Une erreur est survenue. Veuillez réessayer plus tard.');
  }
}
