<template>
  <div class="about">
    <h1>This is an about page</h1>
    <!-- This calendar requires Tailwind CSS v3.0+ -->
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-semibold mb-4">Upcoming meetings</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center">
            <img src="https://via.placeholder.com/40" alt="Leslie Alexander" class="w-10 h-10 rounded-full mr-4" />
            <div>
              <div class="text-lg font-medium">Leslie Alexander</div>
              <div class="text-gray-500">January 10th, 2022 at 5:00 PM</div>
              <div class="text-gray-500">Starbucks</div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center">
            <img src="https://via.placeholder.com/40" alt="Michael Foster" class="w-10 h-10 rounded-full mr-4" />
            <div>
              <div class="text-lg font-medium">Michael Foster</div>
              <div class="text-gray-500">January 12th, 2022 at 3:00 PM</div>
              <div class="text-gray-500">Tim Hortons</div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center">
            <img src="https://via.placeholder.com/40" alt="Dries Vincent" class="w-10 h-10 rounded-full mr-4" />
            <div>
              <div class="text-lg font-medium">Dries Vincent</div>
              <div class="text-gray-500">January 12th, 2022 at 5:00 PM</div>
              <div class="text-gray-500">Costa Coffee at Braehead</div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center">
            <img src="https://via.placeholder.com/40" alt="Lindsay Walton" class="w-10 h-10 rounded-full mr-4" />
            <div>
              <div class="text-lg font-medium">Lindsay Walton</div>
              <div class="text-gray-500">January 14th, 2022 at 10:00 AM</div>
              <div class="text-gray-500">Silverburn</div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center">
            <img src="https://via.placeholder.com/40" alt="Courtney Henry" class="w-10 h-10 rounded-full mr-4" />
            <div>
              <div class="text-lg font-medium">Courtney Henry</div>
              <div class="text-gray-500">January 14th, 2022 at 12:00 PM</div>
              <div class="text-gray-500">The Glasgow Green</div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6">
        <div class="flex justify-between items-center mb-2">
          <button class="focus:outline-none">
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div class="text-lg font-semibold">January</div>
          <button class="focus:outline-none">
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        <div class="grid grid-cols-7 gap-2 text-center">
          <div class="text-gray-500">S</div>
          <div class="text-gray-500">M</div>
          <div class="text-gray-500">T</div>
          <div class="text-gray-500">W</div>
          <div class="text-gray-500">T</div>
          <div class="text-gray-500">F</div>
          <div class="text-gray-500">S</div>

          <div class="text-gray-400">27</div>
          <div class="text-gray-400">28</div>
          <div class="text-gray-400">29</div>
          <div class="text-gray-400">30</div>
          <div class="text-gray-400">31</div>
          <div class="text-gray-400">1</div>
          <div class="text-gray-400">2</div>
          <div class="text-gray-400">3</div>
          <div class="text-gray-400">4</div>
          <div class="text-gray-400">5</div>
          <div class="text-gray-400">6</div>
          <div class="text-gray-400">7</div>
          <div class="text-gray-400">8</div>
          <div class="text-gray-400">9</div>
          <div class="text-gray-400">10</div>
          <div class="text-gray-400">11</div>
          <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto">
            12
          </div>
          <div class="text-gray-400">13</div>
          <div class="text-gray-400">14</div>
          <div class="text-gray-400">15</div>
          <div class="text-gray-400">16</div>
          <div class="text-gray-400">17</div>
          <div class="text-gray-400">18</div>
          <div class="text-gray-400">19</div>
          <div class="text-gray-400">20</div>
          <div class="text-gray-400">21</div>
          <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto">
            22
          </div>
          <div class="text-gray-400">23</div>
          <div class="text-gray-400">24</div>
          <div class="text-gray-400">25</div>
          <div class="text-gray-400">26</div>
          <div class="text-gray-400">27</div>
          <div class="text-gray-400">28</div>
          <div class="text-gray-400">29</div>
          <div class="text-gray-400">30</div>
          <div class="text-gray-400">31</div>
          <div class="text-gray-400">1</div>
          <div class="text-gray-400">2</div>
          <div class="text-gray-400">3</div>
          <div class="text-gray-400">4</div>
          <div class="text-gray-400">5</div>
        </div>
        <button class="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
          Add event
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
