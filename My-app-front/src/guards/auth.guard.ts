import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';

export const isAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = inject(LoginService)
  if(token.isAuth()){
    return true
  }
  else{
    router.navigate(['/login'])
    return false
  }
}

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = inject(LoginService)
  if(token.isAuth()){
    router.navigate(['/dashboard'])
    return false
  }
  else{
    return true
  }
}

