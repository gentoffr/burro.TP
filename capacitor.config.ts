import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.burro.app',
  appName: 'burro',
  webDir: 'www',
  
  plugins: {
    SplashScreen: {
      // Mostramos splash nativo con duración mínima fija
      launchShowDuration: 0,
      // Dejamos que el plugin lo oculte automáticamente
      launchAutoHide: true,
      // Usar formato ARGB explícito (FF = opacidad completa) para evitar interpretaciones
      backgroundColor: '#FF74992E',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_INSIDE', // antes: CENTER_CROP (podía recortar/estresar)
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false
    }
  },
};

export default config;