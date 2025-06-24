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
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  users: User[] = [
    { email: '10022', password: '123456', name: 'Cristopher', lastName: 'Bautista' },
    { email: '10023', password: 'password', name: 'Juan', lastName: 'Perez' },
    { email: '10025', password: 'password', name: 'Roberto', lastName: 'Pulido' },
    { email: '10026', password: 'password', name: 'Antonio', lastName: 'Guzman' },
    // Add more users as needed
    { email: '10027', password: 'password', name: 'Maria', lastName: 'Lopez' },
    { email: '10028', password: 'password', name: 'Carlos', lastName: 'Martinez' },
    { email: '10029', password: 'password', name: 'Laura', lastName: 'Gomez' }
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
