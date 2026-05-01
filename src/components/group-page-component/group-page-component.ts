import { Component, computed, inject, Signal, signal } from '@angular/core';
import { Group } from '../../app/models/group';
import { GroupService } from '../../app/services/group-service/group-service';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { User } from '../../app/models/user';
import { GroupComponent } from '../group-component/group-component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-page-component',
  imports: [GroupComponent, FormsModule],
  templateUrl: './group-page-component.html',
  styleUrl: './group-page-component.css',
})
export class GroupPageComponent {
  // This thing is accessing the binding to routerOutletData in app.html
  currentUser = inject(ROUTER_OUTLET_DATA) as Signal<User | null>;

  groupService = inject(GroupService);
  activeGroups = computed<Group[]>( () => this.groupService.groups().filter(group => group.ownerID == this.currentUser()!.id!) );
// A set of test groups for testing purposes
//  activeGroups = signal<Group[]>([{name: "Test", description: "This is a test", ownerID: "ththththt", memberIDs: []}, {name: "Test 2", description: "This is aslse a test", ownerID: "ththththt", memberIDs: []}, {name: "Test 3", description: "This is, believe it or not, a test", ownerID: "ththththt", memberIDs: []}]);
  selectedGroup = signal<Group | null>(null);


  currentState = signal<GroupState>("view");

  groupNameInput = signal<string>("");
  groupDetailsInput = signal<string>("");

  selectGroup(group: Group) {
    this.currentState.set("view");
    this.selectedGroup.set(group);
  }

  resetFields() {
    this.groupNameInput.set("");
    this.groupDetailsInput.set("");
  }

  addGroupSetup() {
    this.currentState.set("add");
    this.resetFields();
  }

  addGroup() {
    this.groupService.addGroup({name: this.groupNameInput(), description: this.groupDetailsInput(), ownerID: this.currentUser()!.id!, memberIDs: [] })
    this.currentState.set("view");
  }

  editGroupSetup() {
    if (this.selectedGroup()!.ownerID == this.currentUser()!.id!) {
      this.currentState.set("edit");
      this.groupNameInput.set(this.selectedGroup()!.name);
      this.groupDetailsInput.set(this.selectedGroup()!.name);
    } else {
      // no permissions, no edit
    }
  }

  editGroup() {

  }
}

type GroupState = "view" | "edit" | "add";