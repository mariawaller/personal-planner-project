import { Component, computed, inject, Signal, signal } from '@angular/core';
import { Group } from '../../app/models/group';
import { GroupService } from '../../app/services/group-service/group-service';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { User } from '../../app/models/user';
import { GroupComponent } from '../group-component/group-component';
import { FormsModule } from '@angular/forms';
import { User as FirebaseUser } from 'firebase/auth';

@Component({
  selector: 'app-group-page-component',
  imports: [GroupComponent, FormsModule],
  templateUrl: './group-page-component.html',
  styleUrl: './group-page-component.css',
})
export class GroupPageComponent {
  // This thing is accessing the binding to routerOutletData in app.html
  currentUser = inject(ROUTER_OUTLET_DATA) as Signal<FirebaseUser | null>;

  groupService = inject(GroupService);
  activeGroups = computed<Group[]>( () => this.groupService.groups().filter(group => (this.currentUser()!.email! == group.ownerEmail || group.memberEmails.includes(this.currentUser()!.email!) ) ) );
  selectedGroup = signal<Group | null>(null);

  currentState = signal<GroupState>("view");

  groupNameInput = signal<string>("");
  groupDetailsInput = signal<string>("");
  groupMemberInput = signal<string>("");
  selectedGroupMembers = signal<string[]>([]);

  selectGroup(group: Group) {
    this.currentState.set("view");
    this.selectedGroup.set(group);
    this.selectedGroupMembers.set(this.selectedGroup()!.memberEmails);
  }

  resetFields() {
    this.groupNameInput.set("");
    this.groupDetailsInput.set("");
    this.selectedGroupMembers.set([])
  }

  addGroupSetup() {
    this.currentState.set("add");
    this.resetFields();
  }

  addGroup() {
    this.groupService.addGroup({name: this.groupNameInput(), description: this.groupDetailsInput(), ownerEmail: this.currentUser()!.email!, memberEmails: this.selectedGroupMembers() })
    this.currentState.set("view");
  }

  editGroupSetup() {
    if (this.selectedGroup()!.ownerEmail == this.currentUser()!.email) {
      this.currentState.set("edit");
      this.groupNameInput.set(this.selectedGroup()!.name);
      this.groupDetailsInput.set(this.selectedGroup()!.description);
      this.selectedGroupMembers.set(this.selectedGroup()!.memberEmails);
    } else {
      // no permissions, no edit
    }
  }

  editGroup() {
    const newName = (this.groupNameInput() == "" ? this.selectedGroup()!.name : this.groupNameInput());
    const newDescription = (this.groupDetailsInput() == "" ? this.selectedGroup()!.description : this.groupDetailsInput());
    this.groupService.editGroup(this.selectedGroup()!.id!, {name: newName, description: newDescription, memberEmails: this.selectedGroupMembers()});
    this.currentState.set("view");
  }

  async addMember() {
    this.selectedGroupMembers.update(memberList => [...memberList, this.groupMemberInput()])
//    await this.groupService.editGroup(this.selectedGroup()!.id!, {memberEmails: [...this.selectedGroup()!.memberEmails, this.groupMemberInput()]});
    this.groupMemberInput.set("");
  }

  async removeMember(memberEmail: string) {
    this.selectedGroupMembers.update(memberList => memberList.filter(member => member != memberEmail))
//    await this.groupService.editGroup(this.selectedGroup()!.id!, {memberEmails: this.selectedGroup()!.memberEmails.filter(email => email != memberEmail)});
  }

  deleteGroup() {
    this.groupService.deleteGroup(this.selectedGroup()!.id!);
    this.selectedGroup.set(null);
    this.currentState.set("view");
  }
}

type GroupState = "view" | "edit" | "add";