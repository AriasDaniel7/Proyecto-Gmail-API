import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './pages/layout/layout.component';
import { GmailRoutes } from './gmail.routing';
import { ListComponent } from './components/list/list.component';
import { CardComponent } from './components/card/card.component';
import { NgxMasonryModule } from 'ngx-masonry';
import { DetailComponent } from './pages/detail/detail.component';
import { InfoDetailComponent } from './components/info-detail/info-detail.component';

@NgModule({
  declarations: [LayoutComponent, ListComponent, CardComponent, DetailComponent, InfoDetailComponent],
  imports: [CommonModule, GmailRoutes, NgxMasonryModule],
})
export class GmailModule {}
