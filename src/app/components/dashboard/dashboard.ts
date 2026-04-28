import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  @Input() events: any[] = [];
  days: Date[] = [];

  ngOnInit() {
    this.generateDays();
  }

  generateDays() {
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      this.days.push(d);
    }
  }

  getEvents(date: Date) {
    const d = date.toISOString().slice(0,10);
    return this.events.filter(e => e.date === d);
  }
}