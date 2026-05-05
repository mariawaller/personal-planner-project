import { Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

import { auth, database } from '../../app/firebase.config';
import { onAuthStateChanged, User, Unsubscribe } from 'firebase/auth';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { Group } from '../../app/models/group';
import { GroupService } from '../../app/services/group-service/group-service';

export type TaskCategory = 'work' | 'personal' | 'health' | 'kids' | 'other';

export interface Task {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  userId: string;
  category: TaskCategory;
  groupID: string;
  time?: {
    hour: number;
    minute: number;
  };
}

export interface CalDay {
  dayNum: number;
  dateStr: string;
  inMonth: boolean;
}

export interface CategoryOption {
  value: TaskCategory;
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-planner-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCard,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatChipsModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  tasks = signal<Task[]>([]);
  currentUser = signal<User | null>(null);
  loading = signal(true);
  viewDate = signal(new Date());
  selectedDate = signal(this.toDateStr(new Date()));
  newTaskTitle = '';
  newTaskTime = '';
  newTaskCategory: TaskCategory = 'personal';
  newTaskGroup = signal<string>('');
  filterCategory = signal<TaskCategory | 'all'>('all');

  groupService = inject(GroupService);
  ownedGroups = computed<Group[]>(() =>
    this.groupService.groups().filter((group) => group.ownerEmail == this.currentUser()?.email),
  );

  private unsubAuth!: Unsubscribe;
  private unsubTasks: Unsubscribe | null = null;

  readonly categories: CategoryOption[] = [
    { value: 'work', label: 'Work', icon: 'work', color: '#5C6BC0' },
    { value: 'personal', label: 'Personal', icon: 'home', color: '#26A69A' },
    { value: 'health', label: 'Health', icon: 'favorite', color: '#EF5350' },
    { value: 'kids', label: 'Kids', icon: 'child_care', color: '#FFA726' },
    { value: 'other', label: 'Other', icon: 'push_pin', color: '#AB47BC' },
  ];

  getCat(value: TaskCategory): CategoryOption {
    return this.categories.find((c) => c.value === value) ?? this.categories[4];
  }

  get monthLabel(): string {
    return this.viewDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get calDays(): CalDay[] {
    const year = this.viewDate().getFullYear();
    const month = this.viewDate().getMonth();
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
    const d = new Date(this.selectedDate() + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  tasksForDay = computed(() =>
    this.tasks()
      .filter((t) => t.date === this.selectedDate())
      .filter((t) => this.filterCategory() === 'all' || t.category === this.filterCategory())
      .sort((a, b) => {
        const aTime = a.time ? a.time.hour * 60 + a.time.minute : 99999;
        const bTime = b.time ? b.time.hour * 60 + b.time.minute : 99999;
        return aTime - bTime;
      }),
  );

  completedCount = computed(() => this.tasksForDay().filter((t) => t.completed).length);

  ngOnInit() {
    this.unsubAuth = onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
      if (user) {
        this.selectedDate.set(this.toDateStr(new Date()));
        this.groupService.loadGroups().then(() => {
          this.subscribeToTasks(user.uid);
        });
      } else {
        this.unsubTasks?.();
        this.tasks.set([]);
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy() {
    this.unsubAuth?.();
    this.unsubTasks?.();
  }

  private subscribeToTasks(uid: string) {
    this.loading.set(true);
    const q = query(collection(database, 'tasks'));
    this.unsubTasks = onSnapshot(q, (snapshot) => {
      this.tasks.set(
        snapshot.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Task, 'id'>) }))
          .filter(
            (task) =>
              task.userId == uid ||
              this.groupService
                .getGroupByID(task.groupID)
                ?.memberEmails.includes(this.currentUser()?.email!),
          ),
      );
      this.loading.set(false);
    });
  }

  prevMonth() {
    const v = this.viewDate();
    this.viewDate.set(new Date(v.getFullYear(), v.getMonth() - 1, 1));
  }

  nextMonth() {
    const v = this.viewDate();
    this.viewDate.set(new Date(v.getFullYear(), v.getMonth() + 1, 1));
  }

  goToday() {
    this.viewDate.set(new Date());
    this.selectedDate.set(this.toDateStr(new Date()));
  }

  selectDay(day: CalDay) {
    if (day.inMonth) this.selectedDate.set(day.dateStr);
  }

  async addTask() {
    const title = this.newTaskTitle.trim();
    if (!title || !this.currentUser()) return;

    await addDoc(collection(database, 'tasks'), {
      title,
      date: this.selectedDate(),
      time: this.newTaskTime
        ? {
            hour: Number(this.newTaskTime.split(':')[0]),
            minute: Number(this.newTaskTime.split(':')[1]),
          }
        : null,
      completed: false,
      userId: this.currentUser()!.uid,
      category: this.newTaskCategory,
      groupID: this.newTaskGroup(),
    });

    this.newTaskTitle = '';
    this.newTaskTime = '';
  }

  async toggleComplete(task: Task) {
    await updateDoc(doc(database, 'tasks', task.id), { completed: !task.completed });
  }

  async deleteTask(task: Task) {
    if (task.userId == this.currentUser()?.uid) {
      await deleteDoc(doc(database, 'tasks', task.id));
    }
  }

  hasTask(dateStr: string): boolean {
    return this.tasks().some((t) => t.date === dateStr);
  }

  isToday(dateStr: string): boolean {
    return dateStr === this.toDateStr(new Date());
  }

  toDateStr(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatTaskTime(time?: { hour: number; minute: number }): string {
    if (!time) return '';
    const date = new Date();
    date.setHours(time.hour, time.minute);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
}
