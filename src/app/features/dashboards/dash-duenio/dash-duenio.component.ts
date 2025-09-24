import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dash-duenio',
  templateUrl: './dash-duenio.component.html',
  styleUrls: ['./dash-duenio.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonMenuButton]
})
export class DashDuenioComponent  {}
