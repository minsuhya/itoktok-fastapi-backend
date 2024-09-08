<script setup>
import { ref, reactive, onMounted, watch, toRefs, toRaw, inject } from 'vue'
import { useForm, Field, Form, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useUserStore } from '@/stores/auth'
import { readCenterInfo, updateCenterInfo } from '@/api/center'
import { readUser, updateUser } from '@/api/user'

const showModal = inject('showModal')

const userStore = useUserStore()

const user = reactive({
  username: userStore.user.username,
  password: '',
  email: userStore.user.email,
  full_name: userStore.user.full_name,
  birth_date: userStore.user.birth_date,
  center_username: userStore.user.center_username,
  phone_number: userStore.user.phone_number,
  hp_number: userStore.user.hp_number,
  address: userStore.user.address,
  address_extra: userStore.user.address_extra,
  zip_code: userStore.user.zip_code,
  user_type: userStore.user.user_type,
  is_active: userStore.user.is_active,
  is_superuser: userStore.user.is_superuser
})

const center = reactive({
  username: userStore.user.username,
  center_name: '',
  center_summary: '',
  center_introduce: '',
  center_export: '',
  center_addr: '',
  center_tel: ''
})

const combined = reactive({
  ...user,
  ...center
})

const schema = yup.object({
  password: yup.string(),
  password_confirm: yup.string().when('password', {
    is: (val) => val && val.length > 0,
    then: () =>
      yup
        .string()
        .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.')
        .required('비밀번호 확인을 입력해주세요.'),
    otherwise: () => yup.string().notRequired()
  }),
  email: yup.string().required('이메일을 입력해주세요.').email('올바른 이메일을 입력하세요.'),
  full_name: yup.string().required('이름을 입력해주세요.'),
  hp_number: yup
    .string()
    .required('휴대폰번호를 입력해주세요.')
    .test('is-valid-phone', '올바른 휴대폰번호를 입력하세요.', (values) => {
      const phoneRegex = /^(010|011)-\d{3,4}-\d{4}$/
      return phoneRegex.test(values)
    }),
  phone_number: yup
    .string()
    .required('전화번호를 입력해주세요.')
    .test('is-valid-phone', '올바른 전화번호를 입력하세요.', (values) => {
      const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/
      return phoneRegex.test(values)
    }),
  center_name: yup.string().required('센터명을 입력해주세요.'),
  center_tel: yup
    .string()
    .required('센터 전화번호를 입력해주세요.')
    .test('is-valid-phone', '올바른 전화번호를 입력하세요.', (values) => {
      const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/
      return phoneRegex.test(values)
    })
})

// const { handleSubmit, errors, values } = useForm({
//   validationSchema: schema,
//   initialValues: user
// })

const fetchUser = async () => {
  try {
    const userInfo = await readUser(userStore.user.id)
    userStore.setUserInfo(userInfo)
    Object.assign(user, userInfo)
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

const modifyUser = async () => {
  try {
    await updateUser(userStore.user.id, user)
    userStore.setUserInfo(user)
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

const fetchCenterInfo = async () => {
  try {
    const centerInfo = await readCenterInfo(userStore.user.username)
    Object.assign(center, centerInfo)
  } catch (error) {
    console.error('Error fetching center info:', error)
  }
}

const modifyCenterInfo = async () => {
  try {
    await updateCenterInfo(userStore.user.username, center)
  } catch (error) {
    console.error('Error updating center info:', error)
  }
}

const onSubmit = async (values) => {
  // console.log(values)
  // user 객체에 존재하는 필드만 할당
  const filteredUserValues = Object.keys(user).reduce((acc, key) => {
    if (key in values) {
      acc[key] = values[key]
    }
    return acc
  }, {})
  Object.assign(user, filteredUserValues) // user = values

  // center 객체에 존재하는 필드만 할당
  const filteredCenterValues = Object.keys(center).reduce((acc, key) => {
    if (key in values) {
      acc[key] = values[key]
    }
    return acc
  }, {})
  Object.assign(center, filteredCenterValues) // center = values

  // 수정 요청
  try {
    await modifyUser()
    await modifyCenterInfo()
    showModal('사용자 정보가 수정되었습니다.')
    // alert('사용자 정보가 수정되었습니다.')
  } catch (error) {
    showModal('사용자 정보 수정 중 오류가 발생했습니다.')
    console.error('Error updating user data:', error)
  }
}

onMounted(() => {
  fetchUser()
  fetchCenterInfo()
})

// watch(
//   () => values.center_username,
//   (newUsername) => {
//     fetchCenterInfo(newUsername)
//   }
// )
</script>

<template>
  <!-- ====== Page Title Section Start -->
  <section>
    <div class="w-full sm:container">
      <div class="border-black border-l-[5px] pl-5">
        <h2 class="text-dark mb-2 text-2xl font-semibold dark:text-white">내정보</h2>
        <!-- <p class="text-body-color dark:text-dark-6 text-sm font-medium"> -->
        <!--   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultrices lectus sem. -->
        <!-- </p> -->
      </div>
    </div>
  </section>
  <!-- ====== Page Title Section End -->
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg border bg-white">
    <div class="container mx-auto p-4">
      <Form :validation-schema="schema" :initial-values="combined" @submit="onSubmit">
        <h1 class="text-2xl font-bold mb-4">
          <span class="font-bold text-2xl text-sky-700">{{ userStore.user.username }} </span> 계정
          정보
        </h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="mb-4 col-span-2 w-1/2">
            <label class="block font-semibold text-gray-700">이메일 <span class="text-red-500">*</span>
            </label>
            <Field name="email" type="email" class="mt-1 block w-full rounded-lg border-gray-400" />
            <ErrorMessage name="email" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">비밀번호 </label>
            <Field name="password" type="password" class="mt-1 block w-full rounded-lg border-gray-400" />
            <ErrorMessage name="password" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">비밀번호 확인 </label>
            <Field name="password_confirm" type="password" class="mt-1 block w-full rounded-lg border-gray-400" />
            <ErrorMessage name="password_confirm" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">이름 <span class="text-red-500">*</span>
            </label>
            <Field name="full_name" type="text" class="mt-1 block w-full rounded-lg border-gray-400" />
            <ErrorMessage name="full_name" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">휴대폰번호 <span class="text-red-500">*</span>
            </label>
            <Field name="hp_number" type="text" class="mt-1 block w-full rounded-lg border-gray-400"
              placeholder="000-0000-0000" />
            <ErrorMessage name="hp_number" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">전화번호</label>
            <Field name="phone_number" type="text" class="mt-1 block w-full rounded-lg border-gray-400" />
            <ErrorMessage name="phone_number" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">생년월일</label>
            <Field name="birth_date" type="date" class="mt-1 block w-full rounded-lg border-gray-400" />
            <ErrorMessage name="birth_date" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">주소</label>
            <Field name="address" type="text" class="mt-1 block w-full rounded-lg border-gray-400" />
            <ErrorMessage name="address" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">주소 상세</label>
            <Field name="address_extra" type="text" class="mt-1 block w-full rounded-lg border-gray-400" />
            <ErrorMessage name="address_extra" class="text-red-500" />
          </div>
        </div>
        <h1 class="text-2xl font-bold mb-4">센터 정보</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">센터명 <span class="text-red-500">*</span>
            </label>
            <Field name="center_name" type="text" v-model="center.center_name"
              class="mt-1 block w-full rounded-lg border-gray-400" />
            <ErrorMessage name="center_name" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">센터 전화번호 <span class="text-red-500">*</span>
            </label>
            <Field name="center_tel" type="text" v-model="center.center_tel"
              class="mt-1 block w-full rounded-lg border-gray-400" />
            <ErrorMessage name="center_tel" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">센터 한줄소개</label>
            <Field name="center_summary" type="text" v-model="center.center_summary"
              class="mt-1 block w-full rounded-lg border-gray-400" />
            <ErrorMessage name="center_summary" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">센터소개</label>
            <Field name="center_introduce" as="textarea" v-model="center.center_introduce"
              class="mt-1 block w-full rounded-lg border-gray-400" />
            <ErrorMessage name="center_introduce" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">전문분야</label>
            <Field name="center_export" type="text" v-model="center.center_export"
              class="mt-1 block w-full rounded-lg border-gray-400" />
          </div>
          <ErrorMessage name="center_export" class="text-red-500" />
          <div class="mb-4">
            <label class="block font-semibold text-gray-700">센터주소</label>
            <Field name="center_addr" type="text" v-model="center.center_addr"
              class="mt-1 block w-full rounded-lg border-gray-400" />
            <ErrorMessage name="center_addr" class="text-red-500" />
          </div>
        </div>
        <div class="mt-6 flex items-center justify-center gap-x-6">
          <button
            class="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Save
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
}
</style>
