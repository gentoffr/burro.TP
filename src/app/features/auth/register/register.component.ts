import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
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
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { perfil, Usuario } from 'src/app/core/models/usuario.model';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';


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
    IonSelect,
    IonSelectOption,
  ],
})
export class RegisterComponent  {
  photoPreview: string | ArrayBuffer | null = null;
  foto: File | null = null;
  user: Usuario | null = null;
  isSupported = false;
  barcodes: Barcode[] = [];
  
  // Reactive Form
  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    numeroDocumento: [null as number | null, [Validators.required, Validators.min(1)]],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    confirmarContrasena: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('contrasena')?.value;
    const confirmPassword = form.get('confirmarContrasena')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  ionViewWillEnter() {
    this.registerForm.reset();
    this.foto = null;
    this.photoPreview = null;
  }

  constructor(
    protected fb: FormBuilder,
    protected router: Router,
    protected toastController: ToastController,
    protected usuarioService: UsuarioService,
    //protected barcodeScanner: BarcodeScanner
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

    // Validación adicional de contraseñas
    if (this.registerForm.errors?.['passwordMismatch']) {
      this.mostrarToast('Las contraseñas no coinciden.');
      return;
    }

    // Si todo está válido, proceder con el registro
    const formData = this.registerForm.value;
    console.log('Registrando cliente:', formData);

    // Crear usuario con perfil específico
    this.user = this.crearUsuario();
    this.usuarioService
      .signUp(this.user, formData.contrasena!)
      .then(() => {
        this.mostrarToast('Peticion de registro enviada', 'success');
        this.navegar();
      })
      .catch((error) => {
        console.log('Error completo:', error);
        console.log('Mensaje:', error.message);
        console.log('Detalles:', error.details);
        this.mostrarToast('Error al registrar el cliente', 'danger');
      });
  }

  protected mostrarErroresValidacion() {
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

    if (form.get('confirmarContrasena')?.invalid) {
      this.mostrarToast('Confirma la contraseña.');
      return;
    }

    if (form.errors?.['passwordMismatch']) {
      this.mostrarToast('Las contraseñas no coinciden.');
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
  protected dataUrlToFile(dataUrl: string, filename: string): File {
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
  protected crearUsuario(): Usuario {
    // Mapear el valor del formulario al enum de perfil
    
    return new Usuario(
      '', // id se genera en el backend
      this.registerForm.value.nombre!,
      this.registerForm.value.apellido!,
      this.registerForm.value.numeroDocumento!,
      this.registerForm.value.correo!,
      perfil.ClienteRegistrado,
      this.photoPreview as string // foto_url se puede actualizar luego
    );
  }

  async escanear(): Promise<void> {
  try {
    // Pedir permisos
    const granted = await this.requestPermissions();
    if (!granted) {
      this.mostrarToast('Permiso de cámara denegado.');
      return;
    }

    // Escanear
    const { barcodes } = await BarcodeScanner.scan();

    if (barcodes.length > 0) {
      const codigo = Number(barcodes[0].rawValue ?? '');
      console.log('Código escaneado:', codigo);

      // 👉 ejemplo: rellenar el campo numeroDocumento
      if (!isNaN(codigo)) {
        this.registerForm.patchValue({ numeroDocumento: codigo });
      } else {
        this.mostrarToast('El QR no contiene un número válido.');
      }

      this.mostrarToast('Código escaneado con éxito', 'success');
    } else {
      this.mostrarToast('No se detectó ningún código.');
    }
  } catch (err) {
    console.error('Error al escanear:', err);
    this.mostrarToast('Error al escanear QR.');
  }
}

private async requestPermissions(): Promise<boolean> {
  const { camera } = await BarcodeScanner.requestPermissions();
  return camera === 'granted' || camera === 'limited';
}

  async navegar() {
    await this.router.navigateByUrl("/login");
  }
}
