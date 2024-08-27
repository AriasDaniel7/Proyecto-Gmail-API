import { NgModule } from '@angular/core';
import {
  provideRouter,
  RouterModule,
  Routes,
  withViewTransitions,
} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./gmail/gmail.module').then((m) => m.GmailModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [provideRouter(routes, withViewTransitions())],
})
export class AppRoutingModule {}
