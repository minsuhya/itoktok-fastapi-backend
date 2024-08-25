<template>
  <div class="p-4">
    <div
      class="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div class="p-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold">January 2022</h2>
          <div class="flex items-center space-x-2">
            <button class="px-3 py-1 bg-gray-200 rounded">Today</button>
            <button class="px-3 py-1 bg-gray-200 rounded">Month view</button>
            <button class="px-3 py-1 bg-blue-500 text-white rounded">
              Add event
            </button>
          </div>
        </div>
        <div class="grid grid-cols-7 gap-4 mt-4">
          <div class="font-bold text-center">Mon</div>
          <div class="font-bold text-center">Tue</div>
          <div class="font-bold text-center">Wed</div>
          <div class="font-bold text-center">Thu</div>
          <div class="font-bold text-center">Fri</div>
          <div class="font-bold text-center">Sat</div>
          <div class="font-bold text-center">Sun</div>
          <div v-for="day in days" :key="day.date" class="border p-2 h-32">
            <div class="text-right">{{ day.date }}</div>
            <div v-for="event in day.events" :key="event.time" class="mt-2">
              <span class="block bg-blue-100 text-blue-700 rounded p-1 text-xs"
                >{{ event.time }} - {{ event.name }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      days: [
        { date: 27, events: [] },
        { date: 28, events: [] },
        { date: 29, events: [] },
        { date: 30, events: [] },
        { date: 31, events: [] },
        { date: 1, events: [] },
        { date: 2, events: [] },
        {
          date: 3,
          events: [
            { time: "10AM", name: "Design review" },
            { time: "2PM", name: "Sales meeting" },
          ],
        },
        { date: 4, events: [] },
        { date: 5, events: [] },
        { date: 6, events: [] },
        { date: 7, events: [{ time: "6PM", name: "Date night" }] },
        { date: 8, events: [] },
        { date: 9, events: [] },
        { date: 10, events: [] },
        { date: 11, events: [] },
        { date: 12, events: [{ time: "2PM", name: "Sam's birthday party" }] },
        { date: 13, events: [] },
        { date: 14, events: [] },
        { date: 15, events: [] },
        { date: 16, events: [] },
        { date: 17, events: [] },
        { date: 18, events: [] },
        { date: 19, events: [] },
        { date: 20, events: [] },
        { date: 21, events: [] },
        {
          date: 22,
          events: [
            { time: "3PM", name: "Maple syrup museum" },
            { time: "7PM", name: "Hockey game" },
          ],
        },
        { date: 23, events: [] },
        { date: 24, events: [] },
        { date: 25, events: [] },
        { date: 26, events: [] },
        { date: 27, events: [] },
        { date: 28, events: [] },
        { date: 29, events: [] },
        { date: 30, events: [] },
        { date: 31, events: [] },
        { date: 1, events: [] },
        { date: 2, events: [] },
        { date: 3, events: [] },
        { date: 4, events: [{ time: "9PM", name: "Cinema with friends" }] },
        { date: 5, events: [] },
        { date: 6, events: [] },
      ],
    };
  },
};
</script>

<style scoped>
/* Add any additional styling if needed */
</style>
