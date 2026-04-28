import { Injectable, signal } from '@angular/core';
import { User } from '../../models/user';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { database } from '../../firebase.config';

@Injectable({
  providedIn: 'root',
})

export class UserService {

  userCollection = collection(database, "users");
  users = signal<User[]>([]);

  // CRUD Operations
  // Create
  async addUser(user: User) {
    await addDoc(this.userCollection, user);
    this.loadUsers();
  }

  // Read
  async loadUsers() {
    const snapshot = await getDocs(this.userCollection);
    const data = snapshot.docs.map(doc => ({...doc.data(), id: doc.id})) as User[];
    this.users.set(data);
  }

  // Update
  async editUser(id: string, data: Partial<User>) {
    const userReference = doc(database, "users", id);
    await updateDoc(userReference, {...data});
    this.loadUsers();
  }

  // Delete
  async deleteUser(id: string) {
    const userReference = doc(database, "users", id);
    await deleteDoc(userReference);
    this.loadUsers();
  }

}
