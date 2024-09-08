<script setup>
import { defineEmits } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'

const props = defineProps({
  schema: {
    type: Object,
    required: true
  },
  isModal: {
    type: Boolean,
    required: true,
    default: false
  }
})

// const navigateTo = inject('$navigateTo')
const emit = defineEmits(['close'])

const onSubmit = (values) => {
  // console.log(JSON.stringify(values, null, 2))
  alert(JSON.stringify(values, null, 2))

  if (props.isModal) {
    emit('close')
  }
}
</script>
<template>
  <main>
    <Form @submit="onSubmit">
      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div
          class="sm:col-span-3"
          v-for="{ as, name, label, children, ...attrs } in schema.fields"
          :key="name"
        >
          <label :for="name" class="block text-sm font-medium leading-6 text-gray-900">{{
            label
          }}</label>
          <div class="mt-2">
            <Field
              :as="as"
              :id="name"
              :name="name"
              :placeholder="label"
              v-bind="attrs"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <template v-if="children && children.length">
                <component
                  v-for="({ tag, text, ...childAttrs }, idx) in children"
                  :key="idx"
                  :is="tag"
                  v-bind="childAttrs"
                >
                  {{ text }}
                </component>
              </template>
            </Field>
            <ErrorMessage :name="name" />
          </div>
        </div>
      </div>
      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button
          v-if="isModal"
          @click="$emit('close')"
          type="button"
          class="text-sm font-semibold leading-6 text-gray-900"
        >
          Close
        </button>
        <button v-else type="button" class="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </Form>
  </main>
</template>
