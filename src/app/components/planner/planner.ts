import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';
import { DashboardComponent } from '../dashboard/dashboard';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, CalendarComponent, DashboardComponent],
  templateUrl: './planner.html',
  styleUrls: ['./planner.css']
})
export class PlannerComponent {

  events = [
    { date: this.formatDate(new Date()), title: 'Homework', desc: 'Math' },
    { date: this.formatDate(new Date(Date.now() + 86400000)), title: 'Gym', desc: 'Leg day' },
    { date: this.formatDate(new Date(Date.now() + 2 * 86400000)), title: 'Exam', desc: 'Physics' }
  ];

  formatDate(date: Date): string {
    return date.toISOString().slice(0,10);
  }

}