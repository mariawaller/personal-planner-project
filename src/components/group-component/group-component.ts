import { Component, input, output } from '@angular/core';
import { Group } from '../../app/models/group';

@Component({
  selector: 'app-group-component',
  imports: [],
  templateUrl: './group-component.html',
  styleUrl: './group-component.css',
})
export class GroupComponent {
  group = input.required<Group>();
  selectMe = output<Group>();

  selectThis() {
    this.selectMe.emit(this.group());
  }
}
