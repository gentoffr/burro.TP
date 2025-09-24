import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  MenuController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ 
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  ],
})
export class LoginComponent {
  email:string = "";

  contrasena:string = "";
  constructor(private menuCtrl: MenuController) { }
  ionViewWillEnter() {
    this.email = "";
    this.contrasena = "";
  }
  
}
