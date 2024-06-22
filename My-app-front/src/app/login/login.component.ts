import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Iuser } from '../../interfaces/interface';
import { NgClass } from '@angular/common';
import { LoginService } from '../../services/login/login.service';
import { ToastrService } from 'ngx-toastr';

declare const M:any
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor( private router: Router,private fb :FormBuilder,private service : LoginService,private toast : ToastrService) {}

  ngOnInit(): void {
    this.service.isAuth()
    this.controlFormCreate()
    this.controlFormLogin()
  }

  ngAfterViewInit(): void {
    if (typeof M !== 'undefined') {
      M.AutoInit();
    }
  }
  @ViewChild('modal') modal : ElementRef

  public createForm:FormGroup
  public connexionForm:FormGroup
  public mdpView: boolean=false;
  public isLogin:boolean=true;

  private controlFormCreate() {
    this.createForm = this.fb.group({
      nom:['',[Validators.required,Validators.pattern(/^[a-zA-Z\s]+$/)]],
      prenom:['',[Validators.pattern(/^[a-zA-Z\s]+$/)]],
      numTel: ['', [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      password:['', Validators.required],
      image:[null]
    });
  }

  private controlFormLogin(){
    this.connexionForm=this.fb.group({
      numTel: ['', [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      password: ['', Validators.required],
    })
  }

  public showMdp() {
    this.mdpView = !this.mdpView;
  }
  public goToCreate(){
    this.isLogin=false
  }
  public leaveCreate(){
    this.isLogin=true
  }


  public dataLocalName='token'

  public connexion(){
    if(this.connexionForm.valid){
      const modal = this.modal.nativeElement
      const instance = M.Modal.getInstance(modal)
      if(modal){
        instance.open()
      }
      const data = this.connexionForm.value
      this.service.login(data).subscribe({
        next : (res=>{
          localStorage.setItem(this.dataLocalName,JSON.stringify(res.token))
          setTimeout(()=>{
            instance.close()
            this.router.navigate(['/dashboard'])
          },1500)
        }),
        error:(err=>{
          this.toast.error('Numero telephone ou mot de passe incorecte')
          instance.close()
          console.log(err)
        })
      })
    }else{
      this.toast.error('Remplir les champs','')
    }
  }

  public selectedFiles : File
  public getImage(event:any){
    this.selectedFiles=event.target?.files[0] as File
    console.log(this.selectedFiles);
  }

  public creation(){
    if(this.createForm.valid){
    const modal = this.modal.nativeElement
    const instance = M.Modal.getInstance(modal)
    if(modal){
    instance.open()
    }

    let reader = new FileReader()
    reader.readAsDataURL(this.selectedFiles)
    reader.onload=()=>{
      const base64 = reader.result as string
      const data = {...this.createForm.value,image:base64}
      this.service.createUser(data).subscribe({
        next : (res=>{
          console.log(res)
          setTimeout(()=>{
            instance.close()
            this.toast.success('creer')
            this.createForm.reset()
          },2000)
        })
      })
    }
    }else{
      this.toast.error('verifier les champs')
    }

  }
}


