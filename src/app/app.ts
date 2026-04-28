import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { User } from './models/user';
import { UserService } from './services/user-service/user-service';
import { EventService } from './services/event-service/event-service';
import { GroupService } from './services/group-service/group-service';
import { CategoryService } from './services/category-service/category-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('final-group-project-csci313');

  currentUser = signal<User | null>(null);

  userService = inject(UserService);
  eventService = inject(EventService);
  groupService = inject(GroupService);
  categoryService = inject(CategoryService);
}
