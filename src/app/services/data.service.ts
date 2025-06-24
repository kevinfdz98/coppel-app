import { Injectable } from '@angular/core';

export interface User {
  id?: number;
  email: string;
  name: string;
  lastName: string;
  password: string;
  deliveryRoute?: string;
  pickupRoute?: string;
  onSite?: boolean;
  avatar?: string; // Optional avatar property
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  users: User[] = [
    { email: '10022', password: '123456', name: 'Cristopher', lastName: 'Bautista', avatar: 'assets/icon/user.png' },
    { email: '10023', password: 'password', name: 'Juan', lastName: 'Perez', avatar: 'assets/icon/user.png' },
    { email: '10024', password: 'password', name: 'Maria', lastName: 'Garcia', avatar: 'assets/icon/avatar.png' },
    { email: '10025', password: 'password', name: 'Roberto', lastName: 'Pulido', avatar: 'assets/icon/user.png' },
    { email: '10026', password: 'password', name: 'Antonio', lastName: 'Guzman', avatar: 'assets/icon/user.png' },
    // Add more users as needed
    { email: '10027', password: 'password', name: 'Maria', lastName: 'Lopez', avatar: 'assets/icon/avatar.png' },
    { email: '10028', password: 'password', name: 'Carlos', lastName: 'Martinez', avatar: 'assets/icon/user.png' },
    { email: '10029', password: 'password', name: 'Laura', lastName: 'Gomez', avatar: 'assets/icon/avatar.png' }
  ]
  
  constructor() { }

  addUser(user: User) {
    this.users.push(user);
  }
  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }
  getAllUsers(): User[] {
    return this.users;
  }
  loadRouteInUser(user: string, routeData: string, option: string) {
    const foundUser = this.getUserByEmail(user);
    if (foundUser) {
      if (option === 'pickup') {
        foundUser.pickupRoute = routeData;
      } else {
        foundUser.deliveryRoute = routeData;
      }
    }
  }
  userOnSite(email: string, onSite: boolean) {
    const foundUser = this.getUserByEmail(email);
    if (foundUser) {
      foundUser.onSite = onSite;
    }
  }
  removeDeliveryRoute(email: string) {
    const foundUser = this.getUserByEmail(email);
    if (foundUser) {
      foundUser.deliveryRoute = undefined;
      foundUser.pickupRoute = undefined;
    }
  }
}
