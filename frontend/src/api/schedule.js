import { useTeacherStore } from '@/stores/teacherStore'
import axios from 'axios'

const teacherStore = useTeacherStore()

export const createSchedule = async (scheduleCreate) => {
  return axios.post('/schedules', scheduleCreate)
}

export const readSchedule = async (scheduleId) => {
  return axios.get(`/schedules/${scheduleId}`)
}

export const readSchedules = async (skip = 0, limit = 10) => {
  return axios.get('/schedules', {
    params: {
      skip,
      limit
    }
  })
}

export const updateSchedule = async (scheduleId, scheduleListId, scheduleUpdate) => {
  return axios.put(`/schedules/${scheduleId}/${scheduleListId}`, scheduleUpdate)
}

export const deleteSchedule = async (scheduleId, scheduleListId, updateRange) => {
  return axios.delete(`/schedules/${scheduleId}/${scheduleListId}`, {
    params: {
      update_range: updateRange.update_range
    }
  })
}

export const deleteScheduleList = async (scheduleListId) => {
  return axios.delete(`/schedules/list/${scheduleListId}`)
}

// 월간 일정 조회
export const getMonthlyCalendar = async (year, month) => {
  return axios.get(`/schedules/calendar/${year}/${month}`, {
      params: {
        selected_teachers: teacherStore.selectedTeachers.join(',')
      }
  })
}

// 주간 일정 조회
export const getWeeklyCalendar = async (year, month, day) => {
  return axios.get(`/schedules/calendar/${year}/${month}/${day}`, {
      params: {
        selected_teachers: teacherStore.selectedTeachers.join(',')
      }
  })
}

// 일별 일정 조회
export const getDailyCalendar = async (year, month, day) => {
  return axios.get(`/schedules/calendar/daily/${year}/${month}/${day}`)
}

export const updateScheduleDate = async (params) => {
  try {
    const response = await axios.put('/schedules/update-date', null, {
      params: {
        schedule_id: params.scheduleId,
        schedule_list_id: params.scheduleListId,
        new_date: params.newDate,
        update_all_future: params.updateAllFuture
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating schedule date:', error)
    throw error
  }
}

export const updateScheduleDateTime = async (params) => {
  try {
    const response = await axios.put('/schedules/update-date-time', null, {
      params: {
        schedule_id: params.scheduleId,
        schedule_list_id: params.scheduleListId,
        new_date: params.newDate,
        new_time: params.newTime,
        update_all_future: params.updateAllFuture
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating schedule date and time:', error)
    throw error
  }
}
