import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EtudiantComponent } from './etudiant-page/etudiant/etudiant.component';
import { FichesComponent } from './fiches/fiches.component';
import { PaymentComponent } from './payment/payment.component';
import { ActuComponent } from './actu/actu.component';
import { EtudiantFormComponent } from './etudiant-page/etudiant-form/etudiant-form.component';
import { EtudiantDetailComponent } from './etudiant-page/etudiant-detail/etudiant-detail.component';
import { EtudiantPageComponent } from './etudiant-page/etudiant-page.component';
import { isAuthGuard, loginGuard } from '../guards/auth.guard';
import { CePageComponent } from './ce-page/ce-page.component';
import { ReseignementPageComponent } from './reseignement-page/reseignement-page.component';
import { AttestationPageComponent } from './attestation-page/attestation-page.component';
import { FichesPageComponent } from './fiches-page/fiches-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login', canActivate: [loginGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent, canActivate: [isAuthGuard],
    children: [
      { path: 'actu', component: ActuComponent },
      {
        path: 'etudiant',
        component: EtudiantPageComponent,
        title: 'Etudiant',
        children: [
          {
            path: 'etudiant-liste',
            component: EtudiantComponent,
            title: 'Etudiant',
          },
          { path: 'ajout', component: EtudiantFormComponent, title: 'Ajout' },
          {
            path: ':id/detail',
            component: EtudiantDetailComponent,
            title: 'Etudiant-detail',
          },
          {
            path: ':id/modifier',
            component: EtudiantFormComponent,
            title: 'Modification',
          },
          { path: '', redirectTo: 'etudiant-liste', pathMatch: 'full' },
          { path: '**', redirectTo: 'etudiant-liste', pathMatch: 'full' },
        ],
      },
      {
        path: 'fiche', component: FichesPageComponent, title: 'Fiche', children: [

          { path: '', component: FichesComponent, title: 'Carte d\'etudiants' },
          { path: 'ce', component: CePageComponent, title: 'Carte d\'etudiants' },
          { path: 'renseignement', component: ReseignementPageComponent, title: 'Fiche de Renseignement' },
          { path: 'attestation', component: AttestationPageComponent, title: 'Attestation' }
        ],
      },
      { path: 'payement', component: PaymentComponent, title: 'Payement' },
      { path: '', redirectTo: 'actu', pathMatch: 'full' },
      { path: '**', redirectTo: 'actu', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];
