import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Task {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

export interface CalDay {
  dayNum: number;
  dateStr: string;
  inMonth: boolean;
}

@Component({
  selector: 'app-planner-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  viewDate = new Date();
  selectedDate = this.toDateStr(new Date());
  newTaskTitle = '';

  get monthLabel(): string {
    return this.viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get calDays(): CalDay[] {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: CalDay[] = [];

    for (let i = firstWeekday - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, new Date(year, month, 0).getDate() - i);
      days.push({ dayNum: d.getDate(), dateStr: this.toDateStr(d), inMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({ dayNum: i, dateStr: this.toDateStr(d), inMonth: true });
    }
    for (let i = 1; days.length < 42; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ dayNum: i, dateStr: this.toDateStr(d), inMonth: false });
    }
    return days;
  }

  get selectedDateLabel(): string {
    const d = new Date(this.selectedDate + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  get tasksForDay(): Task[] {
    return this.tasks.filter((t) => t.date === this.selectedDate);
  }

  get completedCount(): number {
    return this.tasksForDay.filter((t) => t.completed).length;
  }

  ngOnInit() {
    const saved = localStorage.getItem('planner_tasks');
    if (saved) this.tasks = JSON.parse(saved);
  }

  prevMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
  }

  nextMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
  }

  goToday() {
    this.viewDate = new Date();
    this.selectedDate = this.toDateStr(new Date());
  }

  selectDay(day: CalDay) {
    if (day.inMonth) this.selectedDate = day.dateStr;
  }

  addTask() {
    const title = this.newTaskTitle.trim();
    if (!title) return;
    this.tasks.push({
      id: crypto.randomUUID(),
      title,
      date: this.selectedDate,
      completed: false,
    });
    this.newTaskTitle = '';
    this.save();
  }

  toggleComplete(task: Task) {
    task.completed = !task.completed;
    this.save();
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
    this.save();
  }

  hasTask(dateStr: string): boolean {
    return this.tasks.some((t) => t.date === dateStr);
  }

  isToday(dateStr: string): boolean {
    return dateStr === this.toDateStr(new Date());
  }

  toDateStr(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  private save() {
    localStorage.setItem('planner_tasks', JSON.stringify(this.tasks));
  }
}
