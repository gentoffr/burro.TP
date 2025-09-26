import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from 'src/app/features/auth/register/register.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonText,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { perfil, Usuario } from 'src/app/core/models/usuario.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.empleado.html',
  styleUrls: ['./register.empleado.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonText,
    IonSelect,
    IonSelectOption,
  ],
})
export class RegisterComponentEmpleado extends RegisterComponent{

    override registerForm: any = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    numeroDocumento: [null, [Validators.required, Validators.min(1)]],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    confirmarContrasena: ['', [Validators.required]],
    perfil: ['', [Validators.required]] // Campo adicional
  }, { validators: this.passwordMatchValidator });

  private mapearPerfil(perfilString: string): perfil {
    switch (perfilString) {
      case 'supervisor':
        return perfil.Supervisor;
      case 'maitre':
        return perfil.Maitre;
      case 'mozo':
        return perfil.Mozo;
      case 'cocinero':
        return perfil.Cocinero;
      case 'bartender':
        return perfil.Bartender;
      default:
        return perfil.Mozo; // Por defecto
    }
  }
  override crearUsuario(): Usuario {
    return new Usuario(
      '', // Se asignará en el backend
      this.registerForm.value.nombre!,
      this.registerForm.value.apellido!,
      this.registerForm.value.numeroDocumento!,
      this.registerForm.value.correo!,
      this.mapearPerfil(this.registerForm.value.perfil!),
      this.photoPreview as string // foto_url se puede actualizar luego
    )
  }
  override async navegar() {
    await this.router.navigateByUrl("/dashboard/duenio");
}
}

