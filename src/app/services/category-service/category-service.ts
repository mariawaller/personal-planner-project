import { Injectable, signal } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { database } from '../../firebase.config';
import { Category } from '../../models/category';

@Injectable({
  providedIn: 'root',
})

export class CategoryService {
  
  categoryCollection = collection(database, "categories");
  categories = signal<Category[]>([]);

  // CRUD Operations
  // Create
  async addCategory(category: Category) {
    await addDoc(this.categoryCollection, category);
    this.loadCategories();
  }

  // Read
  async loadCategories() {
    const snapshot = await getDocs(this.categoryCollection);
    const data = snapshot.docs.map(doc => ({...doc.data(), id: doc.id})) as Category[];
    this.categories.set(data);
  }

  // Update
  async editCategory(id: string, data: Partial<Category>) {
    const categoryReference = doc(database, "categories", id);
    await updateDoc(categoryReference, {...data});
    this.loadCategories();
  }

  // Delete
  async deleteCategory(id: string) {
    const categoryReference = doc(database, "categories", id);
    await deleteDoc(categoryReference);
    this.loadCategories();
  }

}
