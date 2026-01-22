<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTeacherStore } from '@/stores/teacherStore'
import { readTeachers, getSelectedTeachers, updateSelectedTeachers } from '@/api/user'

const router = useRouter()
const teacherStore = useTeacherStore()
const counselors = ref([])

onMounted(async () => {
  try {
    const teachersResponse = await readTeachers()
    const teachers = Array.isArray(teachersResponse) ? teachersResponse : []
    console.log('teachers:', teachers)
    counselors.value = teachers.map((teacher) => ({
      id: teacher.id,
      username: teacher.username,
      name: teacher.full_name,
      role: teacher.user_type === '1' ? '센터' : '상담사',
      checked: true,
      color: teacher.usercolor
    }))

    const selectedTeachers = await getSelectedTeachers()
    // 선택된 상담사 문자열을 배열로 변환
    const selectedTeacherArray = selectedTeachers ? selectedTeachers.split(',') : []

    // 상담사 목록의 체크 상태 업데이트
    counselors.value.forEach((counselor) => {
      counselor.checked = selectedTeacherArray.includes(counselor.username)
    })

    // store에 선택된 상담사 저장
    teacherStore.setSelectedTeachers(selectedTeacherArray)
  } catch (error) {
    console.error('Error fetching teachers:', error)
  }
})

const toggleCounselor = async (counselor) => {
  counselor.checked = !counselor.checked

  // 체크된 상담사들의 username 목록을 store에 저장
  const selectedTeachers = counselors.value.filter((c) => c.checked).map((c) => c.username)
  teacherStore.setSelectedTeachers(selectedTeachers)

  console.log('selectedTeachers:', selectedTeachers)

  // 선택된 상담사 목록을 서버에 등록
  try {
    const selectedTeachersString = selectedTeachers.join(',')
    await updateSelectedTeachers({ selected_teacher: selectedTeachersString })

    // 현재 페이지 확인
    const currentRoute = router.currentRoute.value
    const isWeeklyOrMonthly =
      currentRoute.path === '/admin/weekly' || currentRoute.path === '/admin/monthly'

    // WeeklyView 또는 MonthlyView가 아닌 경우 주간 일정 페이지로 이동
    if (!isWeeklyOrMonthly) {
      router.push('/admin/weekly')
    }
    // WeeklyView, MonthlyView는 teacherStore를 watch하여 자동 갱신됨
  } catch (error) {
    console.error('Error updating selected teachers:', error)
  }
}
</script>

<template>
  <div class="mt-4 bg-white rounded-lg p-4">
    <h3 class="text-gray-700 font-medium mb-3">상담사 목록</h3>
    <div class="space-y-2">
      <div v-for="counselor in counselors" :key="counselor.id"
        class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
        @click="toggleCounselor(counselor)">
        <div class="flex items-center">
          <input type="checkbox" :checked="counselor.checked" class="form-checkbox h-4 w-4 cursor-pointer" :style="{
            color: counselor.color + '80'
          }" />
        </div>
        <div class="flex flex-row items-center">
          <span class="text-sm font-medium text-gray-700">{{ counselor.name }}</span>
          <span class="ml-2 text-xs text-gray-500">{{ counselor.role }}</span>
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
