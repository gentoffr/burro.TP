import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ IonicModule, FormsModule ],
})
export class LoginComponent {
  email:string = "";

  contrasena:string = "";

  ionViewWillEnter() {
    this.email = "";
    this.contrasena = "";
  }

}
