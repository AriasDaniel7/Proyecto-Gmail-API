import { Component, Input } from '@angular/core';
import { Gmail } from '../../interfaces/gmail.interface';

@Component({
  selector: 'gmail-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input()
  public gmail?: Gmail;
}
