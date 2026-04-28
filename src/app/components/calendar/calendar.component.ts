import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  currentDate: Date = new Date();
  days: Date[] = [];

  constructor() {
    this.generateCalendar();
  }

  generateCalendar() {
    this.days = [];

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    for (let i = 0; i < startDay; i++) {
      this.days.push(new Date(year, month, i - startDay + 1));
    }

    for (let i = 1; i <= totalDays; i++) {
      this.days.push(new Date(year, month, i));
    }
  }

  prevMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  onDayClick(date: Date) {
    console.log('Clicked:', date);
  }
}