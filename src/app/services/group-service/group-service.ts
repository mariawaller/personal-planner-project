import { Injectable, signal } from '@angular/core';
import { Group } from '../../models/group';
import { database } from '../../firebase.config';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})

export class GroupService {

  groupCollection = collection(database, "groups");
  groups = signal<Group[]>([]);

  // CRUD Operations
  // Create
  async addGroup(group: Group) {
    await addDoc(this.groupCollection, group);
    this.loadGroups();
  }

  // Read
  async loadGroups() {
    const snapshot = await getDocs(this.groupCollection);
    const data = snapshot.docs.map(doc => ({...doc.data(), id: doc.id})) as Group[];
    this.groups.set(data);
  }

  // Update
  async editGroup(id: string, data: Partial<Group>) {
    const groupReference = doc(database, "groups", id);
    await updateDoc(groupReference, {...data});
    this.loadGroups();
  }

  // Delete
  async deleteGroup(id: string) {
    const groupReference = doc(database, "groups", id);
    await deleteDoc(groupReference);
    this.loadGroups();
  }

}
