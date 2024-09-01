import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import vee-validate
import { configure } from 'vee-validate'
import { defineRule } from 'vee-validate'
import { all } from '@vee-validate/rules'

// axios api intercepter import
import '@/api/interceptors'

// global define rules
Object.keys(all).forEach((rule) => {
  defineRule(rule, all[rule])
})

// configure vee-validate
configure({
  generateMessage: (context) => {
    const messages = {
      required: `${context.field} is required.`,
      min: `${context.field} is too short.`,
      email: `Please enter a valid email address.`
    }
    return messages[context.rule.name]
      ? messages[context.rule.name]
      : `${context.field} is not valid.`
  }
})

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

app.mount('#app')
