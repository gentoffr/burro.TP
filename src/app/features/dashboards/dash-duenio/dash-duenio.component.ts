import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonAvatar, IonLabel, IonItem } from '@ionic/angular/standalone';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dash-duenio',
  templateUrl: './dash-duenio.component.html',
  styleUrls: ['./dash-duenio.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonAvatar, IonLabel, IonItem]
})
export class DashDuenioComponent implements OnInit {
  currentUser$: Observable<Usuario | null>;

  constructor(private usuarioService: UsuarioService) {
    this.currentUser$ = this.usuarioService.currentUser$;
  }

  ngOnInit() {
    // Opcional: log para debug
    this.currentUser$.subscribe(user => {
      console.log('Usuario actual en dashboard:', user);
    });
  }
}
