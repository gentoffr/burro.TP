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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  MenuController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class LoginComponent {
  correo:string = "";

  contrasena:string = "";

  constructor(private menuCtrl: MenuController, private router : Router, private toastController : ToastController) { }
  
  
  ionViewWillEnter() {
    this.correo = "";
    this.contrasena = "";
  }
  
  login(){
    if(this.correo === "" || this.contrasena === ""){
      this.mostrarToast("Por favor ingresar correo y contraseña.");
    }
    else{
    }
  }

  registrarse(){
    this.router.navigateByUrl("/register");
  }


  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
  }

}
