<script setup>
// import { Form, Field, ErrorMessage } from 'vee-validate'
// import * as yup from 'yup'

// const schema = yup.object({
//   email: yup.string().email().required(),
//   name: yup.string().required()
// })

// const onSubmit = (values) => {
//   // console.log(JSON.stringify(values, null, 2))
//   alert(JSON.stringify(values, null, 2))
// }

import DynamicForm from '@/components/DynamicForm.vue'
import * as yup from 'yup'

const formSchema = {
  fields: [
    {
      label: 'Your Name',
      name: 'name',
      as: 'input',
      rules: yup.string().required()
    },
    {
      label: 'Your Email',
      name: 'email',
      as: 'input',
      rules: yup.string().email().required()
    },
    {
      label: 'Your Password',
      name: 'password',
      as: 'input',
      type: 'password',
      rules: yup.string().min(8).required()
    },
    {
      label: 'Favorite Drink',
      name: 'drink',
      as: 'select',
      children: [
        {
          tag: 'option',
          value: '',
          text: 'Select a drink'
        },
        {
          tag: 'option',
          value: 'coffee',
          text: 'Coffeee'
        },
        {
          tag: 'option',
          value: 'tea',
          text: 'Tea'
        },
        {
          tag: 'option',
          value: 'coke',
          text: 'Coke'
        }
      ]
    }
  ]
}
</script>

<template>
  <main>
    <div class="w-1/2 mx-auto rounded-lg border p-6 my-3 bg-white">
      <DynamicForm :schema="formSchema" />
    </div>
  </main>
</template>
