// stores/calendarStore.js
import { defineStore } from 'pinia'

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    selectedDate: new Date(),
  }),
  actions: {
    setSelectedDate(date) {
      this.selectedDate = date
    }
  }
})