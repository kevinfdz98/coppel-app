import { Component, OnInit } from '@angular/core';
import { IonList, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonIcon } from '@ionic/angular/standalone';
import { IndexedDbService } from '../services/indexedDb.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
@Component({
  selector: 'app-load-users',
  templateUrl: './load-users.component.html',
  styleUrls: ['./load-users.component.scss'],
  imports: [IonList, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar,
    IonIcon,]

})
export class LoadUsersComponent  implements OnInit {
  public users: any[] = [];
  public navOption: string = '';

  constructor(
    private db: IndexedDbService,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
     const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.navOption = nav.extras.state['option'];
    }
      const users = this.dataService.getAllUsers();
        if(this.navOption === 'pickup') {
          this.users = users.filter(user => user.pickupRoute);
          console.log('Filtered users for pickup:', users);
        } else {
          this.users = users.filter(user => user.deliveryRoute );
          console.log('Filtered users for delivery:', this.users);
        }
  }

  selectUser(email: string, user: any) {
    let route = '';
    console.log('Selected user:', email, user);
    if(this.navOption === 'pickup') {
      route = user.pickupRoute;
    } else {
      route = user.deliveryRoute;
    }
     this.router.navigate(['/nav-map'], {
      state: { routeData: JSON.parse(route), userEmail: email }
     });

  }

}
