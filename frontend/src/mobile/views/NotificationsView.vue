<template>
  <MobileLayout
    header-title="알림"
    :show-menu="true"
    :show-bell="true"
    active-tab="profile"
    @menu="handleMenu"
    @bell="handleBell"
  >
    <div class="p-4">
      <div v-if="notifications.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
        알림이 없습니다.
      </div>
      <div v-else class="space-y-3">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          @click="viewNotification(notification)"
          class="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50"
          :class="{ 'bg-blue-50': !notification.read }"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="text-sm text-gray-500 mb-1">{{ notification.date }} {{ notification.time }}</div>
              <div class="font-semibold text-lg mb-1">{{ notification.title }}</div>
              <div class="text-sm text-gray-600">{{ notification.content }}</div>
            </div>
            <div v-if="!notification.read" class="w-2 h-2 bg-red-500 rounded-full ml-2 mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  </MobileLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MobileLayout from '@/mobile/components/MobileLayout.vue'
// import { getNotifications } from '@/api/notification' // API가 있다면 사용

const router = useRouter()
const notifications = ref([])

const handleMenu = () => {
  // 메뉴는 MobileLayout에서 처리
}

const handleBell = () => {
  // 알림 설정으로 이동할 수도 있음
}

const viewNotification = (notification) => {
  // 알림 상세 보기 또는 관련 화면으로 이동
  console.log('View notification:', notification)
}

const fetchNotifications = async () => {
  try {
    // TODO: 실제 API 호출로 대체
    // const response = await getNotifications()
    // notifications.value = response.data || []
    
    // 임시 데이터
    notifications.value = [
      {
        id: 1,
        date: '2023-09-06',
        time: '10:30',
        title: '알림 제목 1',
        content: '알림 내용이 여기에 표시됩니다.',
        read: false
      },
      {
        id: 2,
        date: '2023-09-05',
        time: '14:20',
        title: '알림 제목 2',
        content: '알림 내용이 여기에 표시됩니다.',
        read: true
      }
    ]
  } catch (error) {
    console.error('알림 조회 오류:', error)
  }
}

onMounted(() => {
  fetchNotifications()
})
</script>

