import Dexie, { Table } from 'dexie';
import { Injectable } from '@angular/core';

export interface User {
  id?: number;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class IndexedDbService extends Dexie {
  users!: Table<User>;

  constructor() {
    super('CoppelDB');
    this.version(1).stores({
      users: '++id, email, password, workAddress',
    });
  }

  addUser(user: User) {
    return this.users.add(user);
  }

  getUserByEmail(email: string) {
    return this.users.where('email').equals(email).first();
  }
}
