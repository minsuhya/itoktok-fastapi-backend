import{a4 as t}from"./index-C8JNOHQq.js";const a=t("calendar",{state:()=>({selectedDate:new Date}),actions:{setSelectedDate(e){this.selectedDate=e}}}),c=t("teacher",{state:()=>({selectedTeachers:[]}),actions:{setSelectedTeachers(e){this.selectedTeachers=e,localStorage.setItem("selectedTeachers",JSON.stringify(e))},loadSelectedTeachers(){const e=localStorage.getItem("selectedTeachers");e&&(this.selectedTeachers=JSON.parse(e))},clearSelectedTeachers(){this.selectedTeachers=[],localStorage.removeItem("selectedTeachers")}}});export{c as a,a as u};