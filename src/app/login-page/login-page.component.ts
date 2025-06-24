import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ToastController, NavController, IonicModule } from '@ionic/angular';
import { IonText, IonImg, IonInput, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, IonNote, IonButton} from '@ionic/angular/standalone';
import { IndexedDbService } from '../services/indexedDb.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login-page',
  imports: [IonText, IonImg, CommonModule, FormsModule, ReactiveFormsModule, IonInput, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, IonNote, IonButton],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPage  implements OnInit {

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private toastController: ToastController,
    private db: IndexedDbService,
    private dataService: DataService
  ) { }

    loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', Validators.required],
  });

  ngOnInit() {
    // try {
    //   this.db.users.toArray().then( async users => {
    //     if (users.length !== 0) {
    //       await this.db.users.clear();
    //       // Pre-populate with a test user
    //       this.db.addUser({ email: '10022', password: '123456', name: 'Cristopher', lastName: 'Bautista' });
    //       this.db.addUser({ email: '10023', password: 'password', name: 'Juan', lastName: 'Perez' });
    //       this.db.addUser({ email: '10025', password: 'password', name: 'Roberto', lastName: 'Pulido' })
    //       this.db.addUser({ email: '10026', password: 'password', name: 'Antonio', lastName: 'Guzman' })
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error initializing database:', error);
    // }
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
      const user = this.dataService.getUserByEmail(email ? email: '' );
      if (user) {
        if (email === user?.email && password === user?.password) {
        this.navCtrl.navigateForward('/home');
        } else {
         this.presentToast('Incorrect password', 'danger');
        }
      }
      else {
        this.presentToast('User not found', 'danger');
      }
    }
  }

  goToRegister() {
    this.loginForm.reset();
    this.navCtrl.navigateForward('/home');
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    await toast.present();
  }
}
