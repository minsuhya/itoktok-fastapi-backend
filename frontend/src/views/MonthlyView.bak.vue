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
      <div class="bg-white h-32 p-2" @click="toggleForm(2)">2</div>

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
