import { ActivatedRoute, Router } from '@angular/router';
import { GmailService } from './../../services/gmail.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Gmail } from '../../interfaces/gmail.interface';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-info-detail',
  templateUrl: './info-detail.component.html',
  styleUrl: './info-detail.component.css',
})
export class InfoDetailComponent implements OnInit {
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  public gmail?: Gmail;
  public safeHtml?: SafeHtml;
  public isLoading = false;

  constructor(
    private readonly gmailService: GmailService,
    private readonly activateRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.activateRoute.params
      .pipe(switchMap(({ id }) => this.gmailService.obtenerPorId(id)))
      .subscribe((gmail) => {
        if (!gmail) this.router.navigate(['/list']);
        this.gmail = gmail;
      });

    this.activateRoute.params
      .pipe(switchMap(({ id }) => this.gmailService.obtenerGmailHtml(id)))
      .subscribe((html) => {
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(html!.content);
        this.isLoading = true;
      });
  }

  adjustIframeSize(event: Event): void {
    if(this.iframe){

      const width =
      this.iframe.nativeElement.contentWindow?.document.body.scrollWidth! + 300;
      const height =
      this.iframe.nativeElement.contentWindow?.document.body.scrollHeight;

      this.iframe.nativeElement.height = height + 'px';
      this.iframe.nativeElement.width = width + 'px';
    }
  }
}
