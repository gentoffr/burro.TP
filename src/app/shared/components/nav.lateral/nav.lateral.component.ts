import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-nav-lateral',
  templateUrl: './nav.lateral.component.html',
  styleUrls: ['./nav.lateral.component.scss'],
  standalone: true,
  imports: [CommonModule, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class NavLateralComponent  {
  // Id del contenido principal (debe coincidir con el id del ion-router-outlet o contenedor)
  @Input() contentId: string = 'main-content';
  // Posición del menú: 'start' | 'end'
  @Input() side: 'start' | 'end' = 'start';
  // Tipo de animación: 'overlay' | 'reveal' | 'push'
  @Input() type: 'overlay' | 'reveal' | 'push' = 'overlay';
  // Título del header del menú (opcional)
  @Input() title = '';
  // Controlar habilitación y gesto de swipe
  @Input() disabled = false;
  @Input() swipeGesture = false;
  // Identificador del menú para controlarlo vía MenuController
  @Input() menuId = 'main-menu';

  // Output para notificar cuando se hace clic en un elemento del menú
  @Output() itemClicked = new EventEmitter<void>();

  constructor(private menuCtrl: MenuController) { }

  // API mínima para controlar el menú desde fuera si se necesita
  open() { return this.menuCtrl.open(this.menuId); }
  close() { return this.menuCtrl.close(this.menuId); }
  toggle() { return this.menuCtrl.toggle(this.menuId); }
  isOpen() { return this.menuCtrl.isOpen(this.menuId); }

  // Método para cerrar el menú y emitir evento
  onItemClick() {
    this.itemClicked.emit();
    this.close();
  }

}
