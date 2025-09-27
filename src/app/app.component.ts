import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonItem, IonAvatar, IonLabel, IonList, IonIcon, IonToast } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { CommonModule } from '@angular/common';
import { SplashComponent } from './shared/components/splash/splash.component';
import { NavLateralComponent } from './shared/components/nav.lateral/nav.lateral.component';
import { UsuarioService } from './core/services/usuario.service';
import { Usuario, perfil } from './core/models/usuario.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  peopleOutline, 
  restaurantOutline, 
  receiptOutline, 
  settingsOutline, 
  logOutOutline,
  analyticsOutline,
  personOutline,
  flameOutline,
  wineOutline,
  bookOutline,
  cafeOutline,
  personAddOutline
} from 'ionicons/icons';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  action?: () => void;
  route?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet, SplashComponent, NavLateralComponent, IonItem, IonAvatar, IonLabel, IonList, IonIcon, IonToast],
})
export class AppComponent implements OnInit {
  showSplash = true;
  currentUser$: Observable<Usuario | null>;

  constructor(
    private usuarioService: UsuarioService, 
    private router: Router,
    private menuCtrl: MenuController
  ) {
    // Registrar solo los iconos necesarios para mejor rendimiento
    addIcons({
      'home-outline': homeOutline,
      'people-outline': peopleOutline,
      'restaurant-outline': restaurantOutline,
      'receipt-outline': receiptOutline,
      'settings-outline': settingsOutline,
      'log-out-outline': logOutOutline,
      'analytics-outline': analyticsOutline,
      'person-outline': personOutline,
      'flame-outline': flameOutline,
      'wine-outline': wineOutline,
      'book-outline': bookOutline,
      'cafe-outline': cafeOutline,
      'person-add-outline': personAddOutline
    });
    
    this.configureStatusBar();
    this.currentUser$ = this.usuarioService.currentUser$;
  }

  ngOnInit() {
    // Inicialización del componente
    this.currentUser$.subscribe(user => {
      // Suscripción al usuario actual
    });
  }

  private async configureStatusBar() {
    try {
      // Asegurarnos de que la status bar no se superponga al WebView
      await StatusBar.setOverlaysWebView({ overlay: false });
      // Color sólido que combina con el background (puedes ajustar)
      await StatusBar.setBackgroundColor({ color: '#74992e' });
      // Texto claro u oscuro según contraste: aquí escogemos light
      await StatusBar.setStyle({ style: Style.Light });
    } catch (err) {
      // En web o si el plugin no está disponible no hacemos nada
      console.warn('StatusBar config skipped:', err);
    }
  }

  onSplashDone() {
    this.showSplash = false;
  }

  // Cache para mejorar rendimiento
  private menuItemsCache = new Map<perfil, MenuItem[]>();

  getMenuItems(userPerfil?: perfil): MenuItem[] {
    if (!userPerfil) return [];

    // Usar cache para evitar recrear arrays constantemente
    if (this.menuItemsCache.has(userPerfil)) {
      return this.menuItemsCache.get(userPerfil)!;
    }

    let items: MenuItem[] = [];

    const homeItem: MenuItem = {
      id: 'home',
      label: 'Inicio',
      icon: 'home-outline',
      route: '/home'
    };

    switch (userPerfil) {
      case perfil.Duenio:
        items = [
          homeItem,
          { id: 'users', label: 'Usuarios', icon: 'people-outline', route: '/usuarios' },
          { id: 'tables', label: 'Mesas', icon: 'restaurant-outline', route: '/mesas' },
          { id: 'orders', label: 'Pedidos', icon: 'receipt-outline', route: '/pedidos' },
          { id: 'reports', label: 'Reportes', icon: 'analytics-outline', route: '/reportes' },
          { id: 'settings', label: 'Configuración', icon: 'settings-outline', route: '/configuracion' },
          { id: 'addEmployee', label: 'Agregar Empleado', icon: 'person-add-outline', route: '/empleado/registro' }
        ];
        break;

      case perfil.Supervisor:
        items = [
          homeItem,
          { id: 'users', label: 'Usuarios', icon: 'people-outline', route: '/usuarios' },
          { id: 'tables', label: 'Mesas', icon: 'restaurant-outline', route: '/mesas' },
          { id: 'orders', label: 'Pedidos', icon: 'receipt-outline', route: '/pedidos' },
          { id: 'reports', label: 'Reportes', icon: 'analytics-outline', route: '/reportes' }
        ];
        break;

      case perfil.Maitre:
        items = [
          homeItem,
          { id: 'tables', label: 'Mesas', icon: 'restaurant-outline', route: '/mesas' },
          { id: 'orders', label: 'Pedidos', icon: 'receipt-outline', route: '/pedidos' },
          { id: 'customers', label: 'Clientes', icon: 'person-outline', route: '/clientes' }
        ];
        break;

      case perfil.Mozo:
        items = [
          homeItem,
          { id: 'my-tables', label: 'Mis Mesas', icon: 'restaurant-outline', route: '/mis-mesas' },
          { id: 'orders', label: 'Pedidos', icon: 'receipt-outline', route: '/pedidos' }
        ];
        break;

      case perfil.Cocinero:
        items = [
          homeItem,
          { id: 'kitchen-orders', label: 'Pedidos Cocina', icon: 'flame-outline', route: '/cocina/pedidos' },
          { id: 'menu', label: 'Menú', icon: 'book-outline', route: '/menu' }
        ];
        break;

      case perfil.Bartender:
        items = [
          homeItem,
          { id: 'bar-orders', label: 'Pedidos Bar', icon: 'wine-outline', route: '/bar/pedidos' },
          { id: 'drinks', label: 'Bebidas', icon: 'cafe-outline', route: '/bebidas' }
        ];
        break;

      case perfil.ClienteRegistrado:
        items = [
          homeItem,
          { id: 'my-orders', label: 'Mis Pedidos', icon: 'receipt-outline', route: '/mis-pedidos' },
          { id: 'menu', label: 'Menú', icon: 'book-outline', route: '/menu' },
          { id: 'profile', label: 'Mi Perfil', icon: 'person-outline', route: '/perfil' }
        ];
        break;

      case perfil.ClienteAnonimo:
        items = [
          { id: 'menu', label: 'Menú', icon: 'book-outline', route: '/menu' },
          { id: 'register', label: 'Registrarse', icon: 'person-add-outline', route: '/registro' }
        ];
        break;

      default:
        items = [homeItem];
    }

    // Guardar en cache
    this.menuItemsCache.set(userPerfil, items);
    return items;
  }

  async navigateToRoute(route?: string) {
    if (route) {
      // Cerrar menú y navegar (esperar a que se cierre para evitar que quede abierto)
      try {
        await this.menuCtrl.close();
      } catch (e) {
        // Si no hay menú abierto, continuar
      }
      await this.router.navigateByUrl(route);
    }
  }

  async logout() {
    try {
      // Cerrar menú primero
      await this.menuCtrl.close();
      await this.usuarioService.signOut();
      this.router.navigateByUrl('/login');
    } catch (error) {
      // Error al cerrar sesión
    }
  }
}
