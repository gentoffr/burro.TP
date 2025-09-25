import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { perfil, Usuario } from 'src/app/core/models/usuario.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
  ],
})
export class RegisterComponent {
  photoPreview: string | ArrayBuffer | null = null;
  foto: File | null = null;
  user: Usuario | null = null;
  // Reactive Form
  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    numeroDocumento: [null, [Validators.required, Validators.min(1)]],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  ionViewWillEnter() {
    this.registerForm.reset();
    this.foto = null;
    this.photoPreview = null;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private usuarioService: UsuarioService
  ) {}

  registrarse() {
    // Validar formulario y foto
    if (this.registerForm.invalid) {
      this.mostrarErroresValidacion();
      return;
    }

    if (!this.foto) {
      this.mostrarToast('Por favor toma una foto para completar el registro.');
      return;
    }

    // Si todo está válido, proceder con el registro
    const formData = this.registerForm.value;
    console.log('Registrando usuario:', formData);

    // TODO: Integrar con UsuarioService
    this.user = this.crearUsuario(this.photoPreview as string);
    this.usuarioService
      .signUp(this.user, formData.contrasena!)
      .then(() => {
        this.mostrarToast('¡Registro exitoso!', 'success');
        this.router.navigateByUrl('/login');
      })
      .catch((error) => {
        console.log('Error completo:', error);
        console.log('Mensaje:', error.message);
        console.log('Detalles:', error.details); // ← Importante
        this.mostrarToast('Error al registrar el usuario', 'danger');
      });
  }

  private mostrarErroresValidacion() {
    const form = this.registerForm;

    if (form.get('nombre')?.invalid) {
      this.mostrarToast('El nombre debe tener al menos 2 caracteres.');
      return;
    }

    if (form.get('apellido')?.invalid) {
      this.mostrarToast('El apellido debe tener al menos 2 caracteres.');
      return;
    }

    if (form.get('numeroDocumento')?.invalid) {
      this.mostrarToast('Ingresa un número de documento válido.');
      return;
    }

    if (form.get('correo')?.invalid) {
      this.mostrarToast('Ingresa un email válido.');
      return;
    }

    if (form.get('contrasena')?.invalid) {
      this.mostrarToast('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.mostrarToast('Por favor completa todos los campos correctamente.');
  }

  async mostrarToast(
    mensaje: string,
    color: 'success' | 'danger' | 'warning' = 'danger'
  ) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: color,
    });
    await toast.present();
  }
  async abrirCamara() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // o Base64
        source: CameraSource.Camera, // Fuerza usar cámara
      });

      // Convertir DataUrl a File object
      if (image.dataUrl) {
        const file = this.dataUrlToFile(image.dataUrl, 'avatar.jpg');
        this.foto = file;
        this.photoPreview = image.dataUrl;
      }
    } catch (error) {
      console.log('Error accediendo a la cámara:', error);
    }
  }
  private dataUrlToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
  private crearUsuario(foto: string): Usuario {
    return new Usuario(
      '', // id se genera en el backend
      this.registerForm.value.nombre!,
      this.registerForm.value.apellido!,
      this.registerForm.value.numeroDocumento!,
      this.registerForm.value.correo!,
      perfil.Duenio,
      foto // foto_url se puede actualizar luego
    );
  }
}
