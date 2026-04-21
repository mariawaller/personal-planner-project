import { Injectable, signal } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { database } from '../../firebase.config';
import { Event } from '../../models/event';

@Injectable({
  providedIn: 'root',
})

export class EventService {

  eventCollection = collection(database, "events");
  events = signal<Event[]>([]);

  // CRUD Operations
  // Create
  async addEvent(event: Event) {
    await addDoc(this.eventCollection, event);
    this.loadEvents();
  }

  // Read
  async loadEvents() {
    const snapshot = await getDocs(this.eventCollection);
    const data = snapshot.docs.map(doc => ({...doc.data(), id: doc.id})) as Event[];
    this.events.set(data);
  }

  // Update
  async editEvent(id: string, data: Partial<Event>) {
    const eventReference = doc(database, "events", id);
    await updateDoc(eventReference, {...data});
    this.loadEvents();
  }

  // Delete
  async deleteEvent(id: string) {
    const eventReference = doc(database, "events", id);
    await deleteDoc(eventReference);
    this.loadEvents();
  }

}
