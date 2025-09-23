import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SplashComponent implements OnInit, OnDestroy {
  /** Finite state: enter -> steady -> exit */
  state: 'enter' | 'steady' | 'exit' = 'enter';
  /** Emite cuando la animación completa terminó */
  @Output() done = new EventEmitter<void>();

  private timeouts: any[] = [];
  private iconLoaded = false;

  ngOnInit() {
    // Paso a steady después de la duración de la animación de entrada
    this.timeouts.push(setTimeout(() => this.state = 'steady', 350));
    // Dispara salida luego de un corto dwell similar a Android 12 (~700-900ms tras steady)
    this.timeouts.push(setTimeout(() => this.startExit(), 1200));
  }

  onIconLoad() {
    this.iconLoaded = true;
  }

  onLogoError(ev: Event) {
    console.error('[SplashComponent] icon failed', ev);
    // Forzar salida temprana si no se pudo cargar
    this.startExit();
  }

  private startExit() {
    if (this.state === 'exit') return;
    this.state = 'exit';
    // Tiempo igual a duración de anim de salida
    this.timeouts.push(setTimeout(() => this.finish(), 320));
  }

  private finish() {
    this.done.emit();
  }

  ngOnDestroy() {
    this.timeouts.forEach(t => clearTimeout(t));
  }
}
