import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import axios from 'axios';

import App from './App.vue'
import router from './router'

import { configure } from 'vee-validate';
import { defineRule } from 'vee-validate';
import { all } from '@vee-validate/rules';

import '@/api/interceptors'

// global axios
// axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

// Define global rules
Object.entries(all).forEach(([name, rule]) => {
  defineRule(name, rule);
});

// Configure VeeValidate
configure({
  generateMessage: (context) => {
    const messages = {
      required: `${context.field} is required.`,
      min: `${context.field} is too short.`,
      email: `Please enter a valid email address.`,
    };
    return messages[context.rule.name]
      ? messages[context.rule.name]
      : `${context.field} is not valid.`;
  },
});


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
