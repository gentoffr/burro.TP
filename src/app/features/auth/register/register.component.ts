import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    FormsModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class RegisterComponent{

  nombre: string = "";
  apellido: string = "";
  numeroDocumento: number | null = null;
  correo: string = "";
  contrasena: string = "";
  foto: File | null = null;

  ionViewWillEnter() {
    this.nombre = "";
    this.apellido = "";
    this.numeroDocumento = null;
    this.correo = "";
    this.contrasena = "";
    this.foto = null;
  }

  constructor(private router : Router, private toastController : ToastController) { }

  registrarse(){
    if(this.nombre === "" || this.apellido === "" || this.numeroDocumento === null || this.correo === "" || this.contrasena === "" || this.foto === null){
      this.mostrarToast("Por favor completar todos los campos para registrarse.");
    }
    else{
      this.router.navigateByUrl("/login");
    }
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
