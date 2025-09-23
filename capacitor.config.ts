import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.burro.app',
  appName: 'burro',
  webDir: 'www',
  
  plugins: {
    StatusBar: {
      backgroundColor: '#00000000',   // negro
      style: 'LIGHT'                // LIGHT = texto/iconos claros (blancos) sobre fondo oscuro
    },

  },
};

export default config;