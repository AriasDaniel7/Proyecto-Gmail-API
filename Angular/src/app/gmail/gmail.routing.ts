import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { ListComponent } from './components/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';

const routes: Routes = [
  {
    path: 'list',
    component: LayoutComponent,
    children: [{ path: '', component: ListComponent }],
  },
  {
    path: 'gmail/:id',
    component: LayoutComponent,
    children: [{ path: '', component: DetailComponent }],
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];

export const GmailRoutes = RouterModule.forChild(routes);
