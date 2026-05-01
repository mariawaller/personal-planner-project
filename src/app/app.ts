import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { User } from './models/user';
import { UserService } from './services/user-service/user-service';
import { EventService } from './services/event-service/event-service';
import { GroupService } from './services/group-service/group-service';
import { CategoryService } from './services/category-service/category-service';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase.config';
import { MatButtonModule } from '@angular/material/button';
import { User as FirebaseUser } from 'firebase/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('final-group-project-csci313');

  currentUser = signal<FirebaseUser | null>(null);

  userService = inject(UserService);
  eventService = inject(EventService);
  groupService = inject(GroupService);
  categoryService = inject(CategoryService);
  router = inject(Router);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
    });
  }

  async logout() {
    await signOut(auth);
    this.router.navigate(['/login']);
  }
}
