<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().email().required(),
  name: yup.string().required()
})

const onSubmit = (values) => {
  // console.log(JSON.stringify(values, null, 2))
  alert(JSON.stringify(values, null, 2))
}
</script>

<template>
  <main>
    <Form :validation-schema="schema" @submit="onSubmit">
      <div class="flex flex-col gap-2 max-w-96 my-9 mx-auto">
        <Field name="email" type="email" placeholder="Email" />
        <ErrorMessage name="email" />
        <Field name="name" placeholder="Name" />
        <ErrorMessage name="name" />
        <button class="border px-4 py-2 rounded-lg bg-gray-600 text-white">
          Sign up for newsletter
        </button>
      </div>
    </Form>
  </main>
</template>
