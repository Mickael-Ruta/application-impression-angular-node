import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Itoken, Iuser } from '../../interfaces/interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  private readonly url = 'http://localhost:3000/user'
  private readonly url_token='http://localhost:3000/user/get'

  public createUser (data : Iuser){
    return this.http.post<Iuser>(`${this.url}/create`,data)
  }

  public login(data:any):Observable<Itoken>{
    return this.http.post<any>(`${this.url}/read`,data)
  }

  public getUser(token:string):Observable<any>{
      return this.http.get<any>(`${this.url_token}/${token}`)
  }

  public isAuth():boolean{
    const token = localStorage.getItem('token')
    return token ? true : false
  }

}

