import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { DashboardRoutingService } from 'src/app/core/services/dashboard-routing.service';
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
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  MenuController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    IonGrid,
    IonRow,
    IonCol,
    IonNote,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private menuCtrl: MenuController, 
    private router: Router, 
    private toastController: ToastController,
    private alertController: AlertController,
    private usuarioService: UsuarioService,
    private dashboardRoutingService: DashboardRoutingService
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  ngOnInit() {
    // Formulario ya inicializado en el constructor
  }
  
  
  ionViewWillEnter() {
    this.loginForm.reset();
  }
  
  async login() {
    console.log('[BURRO-LOGIN] Iniciando proceso de login...');
    
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      console.log('[BURRO-LOGIN] Formulario válido, isLoading = true');
      
      try {
        const { correo, contrasena } = this.loginForm.value;
        console.log('[BURRO-LOGIN] Credenciales obtenidas:', { correo, contrasena: '***' });
        
        // Intentar iniciar sesión
        console.log('[BURRO-LOGIN] Llamando a usuarioService.signIn...');
        const usuario = await this.usuarioService.signIn(correo, contrasena);
        console.log('[BURRO-LOGIN] Login exitoso, usuario:', JSON.stringify({
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          perfil: usuario.perfil
        }));
        
        // Mostrar mensaje de éxito
        console.log('[BURRO-LOGIN] Preparando toast de bienvenida...');
        // TEMPORAL: Comentar toast para debug
        // await this.mostrarToast('¡Bienvenido ' + usuario.nombre + '!', 'success');
        console.log('[BURRO-LOGIN] Toast skippeado (debug mode)');
        
        // Navegar al dashboard correspondiente según el perfil
        if (usuario.perfil) {
          console.log('[BURRO-LOGIN] Usuario tiene perfil:', usuario.perfil);
          const dashboardRoute = this.dashboardRoutingService.getDashboardRoute(usuario.perfil);
          console.log('[BURRO-LOGIN] Ruta calculada:', dashboardRoute);
          console.log('[BURRO-LOGIN] Iniciando navegación...');
          
          try {
            const navigationResult = await this.router.navigateByUrl(dashboardRoute);
            console.log('[BURRO-LOGIN] Resultado de navegación:', navigationResult);
            
            if (!navigationResult) {
              console.log('[BURRO-LOGIN] Navegación falló, intentando ruta de emergencia...');
              await this.router.navigateByUrl('/dashboard/duenio');
            }
            
            console.log('[BURRO-LOGIN] Navegación completada');
          } catch (navError) {
            console.error('[BURRO-LOGIN] Error en navegación:', navError);
            // Intentar navegación de emergencia
            await this.router.navigateByUrl('/dashboard/duenio');
          }
        } else {
          // Fallback si no tiene perfil definido
          console.log('[BURRO-LOGIN] Usuario sin perfil, yendo a dashboard default');
          await this.router.navigateByUrl('/dashboard/duenio');
          console.log('[BURRO-LOGIN] Navegación default completada');
        }
        
      } catch (error: any) {
        console.error('[BURRO-LOGIN] Error en login:', error);
        console.error('[BURRO-LOGIN] Error stack:', error.stack);
        
        // Mostrar mensaje de error específico
        let errorMessage = 'Error al iniciar sesión';
        
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Correo o contraseña incorrectos';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'Por favor confirma tu email antes de iniciar sesión';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        console.log('[BURRO-LOGIN] Mostrando error:', errorMessage);
        // TEMPORAL: Comentar toast para debug
        // await this.mostrarToast(errorMessage, 'danger');
        console.log('[BURRO-LOGIN] Toast de error skippeado (debug mode)');
        
      } finally {
        console.log('[BURRO-LOGIN] Finally block: reseteando isLoading');
        this.isLoading = false;
      }
    } else if (!this.loginForm.valid) {
      console.log('[BURRO-LOGIN] Formulario inválido');
      console.log('[BURRO-LOGIN] Errores del formulario:', this.loginForm.errors);
      console.log('[BURRO-LOGIN] Estado de campos:', {
        correo: this.loginForm.get('correo')?.errors,
        contrasena: this.loginForm.get('contrasena')?.errors
      });
      // TEMPORAL: Comentar toast para debug
      // await this.mostrarToast("Por favor complete todos los campos correctamente.", 'warning');
      console.log('[BURRO-LOGIN] Toast de validación skippeado (debug mode)');
    } else if (this.isLoading) {
      console.log('[BURRO-LOGIN] Ya está en proceso de login, ignorando click');
    }
  }

  registrarse(){
    this.router.navigateByUrl("/register");
  }


  async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning' = 'danger') {
    // Intenta con diferentes posiciones si 'top' no funciona
    const positions: ('top' | 'middle' | 'bottom')[] = ['top', 'middle', 'bottom'];
    
    for (const position of positions) {
      try {
        const toast = await this.toastController.create({
          message: mensaje,
          duration: 3000,
          position: position,
          color: color,
          translucent: false,
          cssClass: 'custom-toast',
          buttons: [{
            text: 'X',
            role: 'cancel'
          }]
        });
        
        console.log(`[BURRO-LOGIN] Mostrando toast en posición: ${position}`, mensaje);
        console.log('[BURRO-LOGIN] Toast config:', {
          message: mensaje,
          duration: 3000,
          position: position,
          color: color
        });
        await toast.present();
        
        toast.onDidDismiss().then(() => {
          console.log(`[BURRO-LOGIN] Toast dismissed from position: ${position}`);
        });
        
        break; // Si llega aquí sin error, salir del loop
      } catch (error) {
        console.error(`Error con posición ${position}:`, error);
        continue;
      }
    }
  }

  // Método alternativo para debug en emulador
  async mostrarAlertaDebug(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Debug Message',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  llenarDuenio() {
    this.loginForm.setValue({
      correo: 'franargento23@gmail.com',
      contrasena: 'Francisco'
    });
  }
}
