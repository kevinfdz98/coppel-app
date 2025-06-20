import Dexie, { Table } from 'dexie';
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

@Injectable({ providedIn: 'root' })
export class IndexedDbService extends Dexie {
  users!: Table<User>;

  constructor() {
    super('CoppelDB');
    this.version(1).stores({
      users: '++id, email, password, name, lastName, deliveryRoute, pickupRoute' // Define the schema,
    });
  }

  addUser(user: User) {
    return this.users.add(user);
  }

  getUserByEmail(email: string) {
    return this.users.where('email').equals(email).first();
  }

  getAllUsers() {
    return this.users.toArray();
  }

  loadRouteInUser(user: string, routeData: string, option: string) {
    if (option === 'pickup') {
      return this.users.where('email').equals(user).modify({
        pickupRoute: routeData,
      });
    } else {
       return this.users.where('email').equals(user).modify({
      deliveryRoute: routeData,
    });
    }

  }

  userOnSite(email: string, onSite: boolean) {
    return this.users.where('email').equals(email).modify({
      onSite: onSite,
    });
  }

  removeDeliveryRoute(email: string) {
    return this.users.where('email').equals(email).modify({
      deliveryRoute: undefined,
      pickupRoute: undefined,
    });
  }
}
