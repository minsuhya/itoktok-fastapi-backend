// stores/teacherStore.ts
import { defineStore } from 'pinia'

export const useTeacherStore = defineStore('teacher', {
  state: () => ({
    selectedTeachers: [] // username 배열
  }),
  
  actions: {
    setSelectedTeachers(teachers) {
      this.selectedTeachers = teachers
      // localStorage에 저장
      localStorage.setItem('selectedTeachers', JSON.stringify(teachers))
    },
    
    loadSelectedTeachers() {
      const saved = localStorage.getItem('selectedTeachers')
      if (saved) {
        this.selectedTeachers = JSON.parse(saved)
      }
    },
    
    clearSelectedTeachers() {
      this.selectedTeachers = []
      localStorage.removeItem('selectedTeachers')
    }
  }
})