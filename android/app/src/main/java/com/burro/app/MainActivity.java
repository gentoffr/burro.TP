package com.burro.app;

import android.os.Build;
import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Instala el splash del sistema ANTES de super.onCreate (recomendado por docs)
        SplashScreen splashScreen = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            splashScreen = SplashScreen.installSplashScreen(this);
        }
        
        super.onCreate(savedInstanceState);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && splashScreen != null) {
            splashScreen.setOnExitAnimationListener(splashScreenView -> {
                // Quitar inmediatamente la vista para evitar el fade
                splashScreenView.remove();
            });
        }
    }
}
