import { Component, inject, Signal, signal } from '@angular/core';
import { Group } from '../../app/models/group';
import { GroupService } from '../../app/services/group-service/group-service';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { User } from '../../app/models/user';

@Component({
  selector: 'app-group-page-component',
  imports: [],
  templateUrl: './group-page-component.html',
  styleUrl: './group-page-component.css',
})
export class GroupPageComponent {
  currentUser = inject(ROUTER_OUTLET_DATA) as Signal<User | null>;

  activeGroups = signal<Group[]>([]);
  selectedGroup = signal<Group | null>(null);
  groupService = inject(GroupService);
}
