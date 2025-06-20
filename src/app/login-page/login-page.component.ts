import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { IndexedDbService } from '../services/indexedDb.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPage  implements OnInit {

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private toastController: ToastController,
    private db: IndexedDbService
  ) { }

    loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', Validators.required],
  });

  ngOnInit() {
    try {
      this.db.users.toArray().then( async users => {
        if (users.length !== 0) {
          await this.db.users.clear();
          // Pre-populate with a test user
          this.db.addUser({ email: '10022', password: '123456', name: 'Cristopher', lastName: 'Bautista' });
          this.db.addUser({ email: '10023', password: 'password', name: 'Juan', lastName: 'Perez' });
          this.db.addUser({ email: '10025', password: 'password', name: 'Roberto', lastName: 'Pulido' })
          this.db.addUser({ email: '10026', password: 'password', name: 'Antonio', lastName: 'Guzman' })
        }
      });
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

   get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async onLogin() {
    if (this.loginForm.valid) {
      let { email, password } = this.loginForm.value;
      email = email?.toString().trim();
      await this.db.getUserByEmail(email ? email: '' ).then( async user => {
        if (email === user?.email && password === user?.password) {
        this.navCtrl.navigateForward('/home');
      } else {
        const toast = await this.toastController.create({
          message: 'Invalid email or password',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
      })
    }
  }

  goToRegister() {
    this.navCtrl.navigateForward('/home');
  }
}
