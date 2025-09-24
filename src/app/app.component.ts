import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { CommonModule } from '@angular/common';
import { SplashComponent } from './shared/components/splash/splash.component';
import { NavLateralComponent } from './shared/components/nav.lateral/nav.lateral.component';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet, SplashComponent, NavLateralComponent],
})
export class AppComponent {
  showSplash = true;
  constructor() {
    this.configureStatusBar();
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
}
