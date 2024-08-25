<template>
  <div class="max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md">
    <div class="flex justify-between items-center p-4 border-b">
      <h2 class="text-lg font-semibold">January 2022</h2>
      <div>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Today
        </button>
        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Month view
        </button>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600"
        >
          Add event
        </button>
      </div>
    </div>
    <div class="grid grid-cols-7 gap-4 p-4">
      <div class="text-center font-semibold">Mon</div>
      <div class="text-center font-semibold">Tue</div>
      <div class="text-center font-semibold">Wed</div>
      <div class="text-center font-semibold">Thu</div>
      <div class="text-center font-semibold">Fri</div>
      <div class="text-center font-semibold">Sat</div>
      <div class="text-center font-semibold">Sun</div>

      <!-- Empty cells for previous month -->
      <div class="h-24"></div>
      <div class="h-24"></div>
      <div class="h-24"></div>
      <div class="h-24"></div>
      <div class="h-24"></div>
      <div class="h-24"></div>
      <div class="h-24"></div>

      <!-- Calendar cells -->
      <div class="h-24">
        <div class="text-gray-700">3</div>
        <div class="mt-2 text-sm text-gray-500">Design review 10AM</div>
        <div class="text-sm text-gray-500">Sales meeting 2PM</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">4</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">5</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">6</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">7</div>
        <div class="mt-2 text-sm text-gray-500">Date night 6PM</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">8</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">9</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">10</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">11</div>
      </div>
      <div class="h-24 relative">
        <div class="text-gray-700">12</div>
        <div
          class="absolute bottom-2 left-2 bg-blue-200 text-blue-700 text-sm rounded-full px-2"
        >
          Sam's birthday party 2PM
        </div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">13</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">14</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">15</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">16</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">17</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">18</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">19</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">20</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">21</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">22</div>
        <div class="mt-2 text-sm text-gray-500">Maple syrup museum 3PM</div>
        <div class="text-sm text-gray-500">Hockey game 7PM</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">23</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">24</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">25</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">26</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">27</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">28</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">29</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">30</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">31</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">1</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">2</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">3</div>
        <div class="mt-2 text-sm text-gray-500">Cinema with friends 9PM</div>
      </div>
      <div class="h-24">
        <div class="text-gray-700">4</div>
      </div>
      <div class="h-24"></div>
      <div class="h-24"></div>
      <div class="h-24"></div>
      <div class="h-24"></div>
    </div>
  </div>
</template>
