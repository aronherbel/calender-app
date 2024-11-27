import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule]
})
export class CalendarComponent {
  currentDate: Date = new Date(); // Aktuelles Datum
  daysInMonth: { day: number; weekday: string }[] = []; // Tage mit Wochentag
  calendarDays: { day: number | null; weekday: string }[] = []; // Für die Anzeige
  monthNames: string[] = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  weekdayShort: string[] = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']; // Abkürzungen

  // Notizen nach Jahr, Monat und Tag organisiert
  notes: { [year: number]: { [month: number]: { [day: number]: string[] } } } = {};

  constructor() {
    this.generateCalendar();
  }

  // Generiere die Tage des Monats mit Wochentagsabkürzungen
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Erster und letzter Tag des Monats
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Index des ersten Tages (0 = Sonntag, 1 = Montag, ...)
    const firstDayIndex = (firstDay.getDay()); // Montag als erster Tag

    // Array mit allen Tagen des Monats inklusive Wochentagsabkürzungen
    this.daysInMonth = Array.from({ length: lastDay.getDate() }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return {
        day: i + 1,
        weekday: this.weekdayShort[date.getDay()]
      };
    });

    // Kalender mit leeren Feldern für die ersten Tage ergänzen
    this.calendarDays = [
      ...Array(firstDayIndex).fill({ day: null, weekday: '' }), // Leere Felder
      ...this.daysInMonth
    ];
  }

  // Einen Monat zurück
  previousMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  // Einen Monat vor
  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  getMonthName(monthIndex: number): string {
    const adjustedIndex = (monthIndex + 12) % 12; // Damit der Monat korrekt angezeigt wird
    return this.monthNames[adjustedIndex];
  }

  // Notiz hinzufügen
  addNote(day: number) {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const note = prompt('Bitte gib eine Notiz ein:');
    if (note) {
      if (!this.notes[year]) {
        this.notes[year] = {};
      }
      if (!this.notes[year][month]) {
        this.notes[year][month] = {};
      }
      if (!this.notes[year][month][day]) {
        this.notes[year][month][day] = [];
      }
      this.notes[year][month][day].push(note);
    }
  }

  // Notiz löschen
  deleteNote(day: number, noteIndex: number) {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    if (this.notes[year] && this.notes[year][month] && this.notes[year][month][day]) {
      this.notes[year][month][day].splice(noteIndex, 1);
      // Wenn keine Notizen mehr für den Tag existieren, den Tag löschen
      if (this.notes[year][month][day].length === 0) {
        delete this.notes[year][month][day];
        // Wenn keine Notizen mehr für den Monat existieren, den Monat löschen
        if (Object.keys(this.notes[year][month]).length === 0) {
          delete this.notes[year][month];
        }
      }
    }
  }

  // Aktuellen Monat ausgeben
  get currentMonthYear(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }
}
