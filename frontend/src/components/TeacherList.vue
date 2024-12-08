<script setup>
import { ref, onMounted } from 'vue'

const counselors = ref([
  { 
    id: 1, 
    name: '(예시)김상담', 
    role: '치료사',
    checked: false,
    color: 'blue' // 체크박스 색상
  },
  { 
    id: 2, 
    name: '(예시)이열람', 
    role: '치료사',
    checked: true,
    color: 'yellow'
  },
  { 
    id: 3, 
    name: '박경근', 
    role: '센터장님',
    checked: true,
    color: 'black'
  },
  { 
    id: 4, 
    name: '오상혁', 
    role: '치료사',
    checked: true,
    color: 'yellow'
  },
  { 
    id: 5, 
    name: '주창은', 
    role: '미술치료사',
    checked: true,
    color: 'green'
  }
])

const toggleCounselor = (counselor) => {
  counselor.checked = !counselor.checked
  // 여기서 체크 상태 변경 이벤트를 발생시킬 수 있습니다
  // emit('counselor-toggle', counselor)
}
</script>

<template>
  <div class="mt-4 bg-white rounded-lg p-4">
    <h3 class="text-gray-700 font-medium mb-3">상담사 목록</h3>
    <div class="space-y-2">
      <div 
        v-for="counselor in counselors" 
        :key="counselor.id"
        class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
        @click="toggleCounselor(counselor)"
      >
        <div class="flex items-center">
          <input
            type="checkbox"
            :checked="counselor.checked"
            class="form-checkbox h-4 w-4 cursor-pointer"
            :class="{
              'text-blue-500': counselor.color === 'blue',
              'text-yellow-500': counselor.color === 'yellow',
              'text-black': counselor.color === 'black',
              'text-green-500': counselor.color === 'green'
            }"
          />
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-700">{{ counselor.name }}</span>
          <span class="text-xs text-gray-500">{{ counselor.role }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-checkbox {
  border-radius: 3px;
  border: 2px solid #cbd5e0;
}

.form-checkbox:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
  border-color: currentColor;
  background-color: currentColor;
}
</style> 