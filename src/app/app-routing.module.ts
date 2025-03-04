import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';

export const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}



// export const routes: Routes = [
//   {
//     path: 'auth',
//     component: NbAuthComponent,
//     children: [
//       { path: '', component: NbLoginComponent },
//       { path: 'login', component: NbLoginComponent },
//       { path: 'register', component: NbRegisterComponent },
//       { path: 'logout', component: NbLogoutComponent },
//       { path: 'request-password', component: NbRequestPasswordComponent },
//       { path: 'reset-password', component: NbResetPasswordComponent },
//     ],
//   },
//   {
//     path: 'pages',
//     loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
//   },
//   { path: '', redirectTo: 'auth/login', pathMatch: 'full' }, // Redirect to login page first
//   { path: '**', redirectTo: 'auth/login' },
// ];



