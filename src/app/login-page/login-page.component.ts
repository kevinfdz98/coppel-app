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
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  ngOnInit() {
    try {
      this.db.users.toArray().then(users => {
        if (users.length === 0) {
          // Pre-populate with a test user
          this.db.addUser({ email: 'test@example.com', password: '123456' });
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
      const { email, password } = this.loginForm.value;
      await this.db.getUserByEmail(email ? email: '' ).then( user => {
        console.log('User found:', user);
      })
      debugger;
      if (email === 'test@example.com' && password === '123456') {
        this.navCtrl.navigateForward('/home');
      } else {
        const toast = await this.toastController.create({
          message: 'Invalid email or password',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    }
  }
}
