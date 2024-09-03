<script setup>
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/20/solid'
import { ref, reactive } from 'vue'
const isZoomed = reactive({})
const zoom = (index) => {
  isZoomed[index] = !isZoomed[index]
}
</script>

<template>
  <!-- ====== Page Title Section Start -->
  <section>
    <div class="w-full sm:container">
      <div class="border-black border-l-[5px] pl-5">
        <h2 class="text-dark mb-2 text-2xl font-semibold dark:text-white">Monthly Schedule</h2>
        <!-- <p class="text-body-color dark:text-dark-6 text-sm font-medium"> -->
        <!--   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultrices lectus sem. -->
        <!-- </p> -->
      </div>
    </div>
  </section>
  <!-- ====== Page Title Section End -->
  <div class="max-w-full mx-auto p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <button class="p-2 rounded-full font-semibold">
          <ChevronLeftIcon class="w-6 h-6" />
        </button>
        <h2 class="text-xl font-semibold">January 2022</h2>
        <button class="p-2 rounded-full font-semibold">
          <ChevronRightIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="flex space-x-2 text-sm font-semibold">
        <button class="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center">
          <span>Today</span>
        </button>
        <button class="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center">
          <span>Monthly</span>
        </button>
        <button class="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center">
          <span>Daily</span>
        </button>
        <button class="px-4 py-2 bg-blue-500 text-white rounded-md">상담 등록</button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden text-sm">
      <!-- Day Names -->
      <div class="bg-white py-2 text-center text-sm font-medium">Mon</div>
      <div class="bg-white py-2 text-center text-sm font-medium">Tue</div>
      <div class="bg-white py-2 text-center text-sm font-medium">Wed</div>
      <div class="bg-white py-2 text-center text-sm font-medium">Thu</div>
      <div class="bg-white py-2 text-center text-sm font-medium">Fri</div>
      <div class="bg-white py-2 text-center text-sm font-medium">Sat</div>
      <div class="bg-white py-2 text-center text-sm font-medium">Sun</div>

      <!-- Dates (January 2022) -->
      <!-- Previous Month Dates -->
      <div class="bg-gray-50 h-32 p-2"></div>
      <!-- 27 -->
      <div class="bg-gray-50 h-32 p-2"></div>
      <!-- 28 -->
      <div class="bg-gray-50 h-32 p-2"></div>
      <!-- 29 -->
      <div class="bg-gray-50 h-32 p-2"></div>
      <!-- 30 -->
      <div class="bg-gray-50 h-32 p-2"></div>
      <!-- 31 -->
      <div class="bg-white h-32 p-2">1</div>
      <div class="bg-white h-32 p-2">2</div>

      <!-- Week 2 -->
      <div class="bg-white h-32 p-2">
        <span class="block text-sm">3</span>
        <div class="text-xs mt-1 text-gray-600">
          <p>Design review <span class="block text-gray-500">10AM</span></p>
          <p>Sales meeting <span class="block text-gray-500">2PM</span></p>
        </div>
      </div>
      <div class="bg-white h-32 p-2">4</div>
      <div class="bg-white h-32 p-2">5</div>
      <div class="bg-white h-32 p-2">6</div>
      <div class="bg-white h-32 p-2">
        7
        <p class="text-xs mt-1 text-gray-600">
          Date night <span class="block text-gray-500">6PM</span>
        </p>
      </div>
      <div class="bg-white h-32 p-2">8</div>
      <div class="bg-white h-32 p-2">9</div>

      <!-- Week 3 -->
      <div class="bg-white h-32 p-2">10</div>
      <div class="bg-white h-32 p-2">11</div>
      <div class="bg-white h-32 p-2">
        <span class="block text-sm bg-sky-500 text-white ring rounded-full font-semibold w-5">12</span>
        <p class="flex-row text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 p-1 bg-blue-400/20 *:scale-100 [& *]:scale-100"
          v-for="(item, index) in ['Meeting with Sam', 'Lunch with Sarah', 'Dinner with family']" :key="index" :class="{
            'transform transition duration-500 ease-in-out overflow-hidden': true,
            'scale-100 h-6': !isZoomed[index],
            'scale-150 h-auto': isZoomed[index]
          }" @click="zoom(index)">
        <div class="flex justify-between" v-for="i in [...new Array(index + 1).keys()]">
          <span class="inline-block">{{ item }}</span>
          <span class="ml-auto inline-block text-blue-700">{{ index }}PM</span>
        </div>
        </p>
        <p class="flex text-xs text-purple-600 border border-purple-700/10 rounded-md m-1 p-1 bg-purple-400/20">
          <span class="inline-block">Sam's birthday party</span><span
            class="ml-auto inline-block text-purple-700">2PM</span>
        </p>
      </div>
      <div class="bg-white h-32 p-2">13</div>
      <div class="bg-white h-32 p-2">14</div>
      <div class="bg-white h-32 p-2">15</div>
      <div class="bg-white h-32 p-2">16</div>

      <!-- Week 4 -->
      <div class="bg-white h-32 p-2">17</div>
      <div class="bg-white h-32 p-2">18</div>
      <div class="bg-white h-32 p-2">19</div>
      <div class="bg-white h-32 p-2">20</div>
      <div class="bg-white h-32 p-2">21</div>
      <div class="bg-white h-32 p-2">
        22
        <p class="text-xs mt-1 text-gray-600">
          Maple syrup museum <span class="block text-gray-500">3PM</span>
        </p>
        <p class="text-xs mt-1 text-gray-600">
          Hockey game <span class="block text-gray-500">7PM</span>
        </p>
      </div>
      <div class="bg-white h-32 p-2">23</div>

      <!-- Week 5 -->
      <div class="bg-white h-32 p-2">24</div>
      <div class="bg-white h-32 p-2">25</div>
      <div class="bg-white h-32 p-2">26</div>
      <div class="bg-white h-32 p-2">27</div>
      <div class="bg-white h-32 p-2">28</div>
      <div class="bg-white h-32 p-2">29</div>
      <div class="bg-white h-32 p-2">30</div>

      <!-- Week 6 -->
      <div class="bg-white h-32 p-2">31</div>
      <div class="bg-gray-50 h-32 p-2"></div>
      <!-- Next month -->
      <div class="bg-gray-50 h-32 p-2"></div>
      <!-- Next month -->
      <div class="bg-gray-50 h-32 p-2"></div>
      <!-- Next month -->
      <div class="bg-gray-50 h-32 p-2"></div>
      <!-- Next month -->
      <div class="bg-gray-50 h-32 p-2"></div>
      <!-- Next month -->
      <div class="bg-gray-50 h-32 p-2"></div>
      <!-- Next month -->
    </div>
  </div>
</template>

<style></style>
