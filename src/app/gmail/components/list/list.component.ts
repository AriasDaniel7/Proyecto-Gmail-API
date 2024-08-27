import { Component, OnInit, ViewChild } from '@angular/core';
import { GmailService } from '../../services/gmail.service';
import { Gmail } from '../../interfaces/gmail.interface';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';

@Component({
  selector: 'gmail-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent;
  public gmails: Gmail[] = [];
  public isLoading: boolean = false;
  public myOptions: NgxMasonryOptions = {
    percentPosition: true,
  };

  constructor(private readonly gmailService: GmailService) {}

  ngOnInit(): void {
    this.loadInitialGmails();
  }

  private loadInitialGmails(): void {
    this.gmailService.obtenerTodos().subscribe((gmails) => {
      this.gmails = gmails;
      this.isLoading = true;
      this.masonry.layout();
    });
  }
}
