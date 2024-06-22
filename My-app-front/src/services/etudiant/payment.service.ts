import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ietudiant } from '../../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http : HttpClient) { }

  private readonly url_non_paye:string= 'http://localhost:3000/etudiant/frais/nonPaye'
  private readonly url_tranche:string= 'http://localhost:3000/etudiant/frais/tranche'
  private readonly url_paye:string= 'http://localhost:3000/etudiant/frais/paye'
  private readonly url_payement:string= 'http://localhost:3000/etudiant/payment'


  public getEtuFraisNonPaye():Observable<Ietudiant[]>{
    return this.http.get<Ietudiant[]>(this.url_non_paye)
  }

  public getEtuFraisPaye():Observable<Ietudiant[]>{
    return this.http.get<Ietudiant[]>(this.url_paye)
  }

  public getEtuFraisTranche():Observable<Ietudiant[]>{
    return this.http.get<Ietudiant[]>(this.url_tranche)
  }

  public doPayement(matricule:string,data:any):Observable<any>{
    return this.http.put<any>(`${this.url_payement}/${matricule}`,data)
  }
}
