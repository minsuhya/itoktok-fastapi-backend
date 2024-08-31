<script setup></script>

<template>
  <!-- ====== Page Title Section Start -->
  <section>
    <div class="w-full sm:container">
      <div class="border-black border-l-[5px] pl-5">
        <h2 class="text-dark mb-2 text-2xl font-semibold dark:text-white">Daily Schedule</h2>
        <!-- <p class="text-body-color dark:text-dark-6 text-sm font-medium"> -->
        <!--   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ultrices lectus sem. -->
        <!-- </p> -->
      </div>
    </div>
  </section>
  <!-- ====== Page Title Section End -->
  <section class="flex items-center">
    <div class="max-w-full mx-auto w-full">
      <!-- Start coding here -->
      <div class="relative">
        <div class="flex flex-col items-center justify-between p-2 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
          <div class="w-full md:w-1/2">
            <form class="flex items-center">
              <label for="simple-search" class="sr-only">Search</label>
              <div class="relative w-full">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor"
                    viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <input type="text" id="simple-search"
                  class="block w-[300px] p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search" required="" />
              </div>
            </form>
          </div>
          <div
            class="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
            <button type="button"
              class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
              <svg class="h-3.5 w-3.5 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true">
                <path clip-rule="evenodd" fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              Add product
            </button>
            <div class="flex items-center w-full space-x-3 md:w-auto">
              <button id="actionsDropdownButton" data-dropdown-toggle="actionsDropdown"
                class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button">
                <svg class="-ml-1 mr-1.5 w-5 h-5" fill="currentColor" viewbox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clip-rule="evenodd" fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
                Actions
              </button>
              <div id="actionsDropdown"
                class="z-10 hidden bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="actionsDropdownButton">
                  <li>
                    <a href="#"
                      class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mass
                      Edit</a>
                  </li>
                </ul>
                <div class="py-1">
                  <a href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete
                    all</a>
                </div>
              </div>
              <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown"
                class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="w-4 h-4 mr-2 text-gray-400"
                  viewbox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clip-rule="evenodd" />
                </svg>
                Filter
                <svg class="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewbox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clip-rule="evenodd" fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>
              <!-- Dropdown menu -->
              <div id="filterDropdown" class="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700">
                <h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Category</h6>
                <ul class="space-y-2 text-sm" aria-labelledby="dropdownDefault">
                  <li class="flex items-center">
                    <input id="apple" type="checkbox" value=""
                      class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="apple" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Apple (56)
                    </label>
                  </li>
                  <li class="flex items-center">
                    <input id="fitbit" type="checkbox" value=""
                      class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="fitbit" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Fitbit (56)
                    </label>
                  </li>
                  <li class="flex items-center">
                    <input id="dell" type="checkbox" value=""
                      class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="dell" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Dell (56)
                    </label>
                  </li>
                  <li class="flex items-center">
                    <input id="asus" type="checkbox" value="" checked
                      class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="asus" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Asus (97)
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden w-full mx-auto dark:bg-slate-800/25">
    <div class="relative rounded-xl overflow-auto">
      <div class="mx-4 my-4 box-content bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
        <div class="grid grid-cols-[70px,repeat(7,1fr)] grid-rows-[auto,repeat(16,50px)] max-h-full">
          <!-- class="overflow-y-scroll grid grid-cols-[70px,repeat(7,1fr)] grid-rows-[auto,repeat(16,50px)] max-h-screen"> -->
          <!-- Calendar frame -->
          <div
            class="row-start-[1] col-start-[1] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2">
          </div>
          <div
            class="row-start-[1] col-start-[2] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            Sun
          </div>
          <div
            class="row-start-[1] col-start-[3] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            Mon
          </div>
          <div
            class="row-start-[1] col-start-[4] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            Tue
          </div>
          <div
            class="row-start-[1] col-start-[5] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            Wed
          </div>
          <div
            class="row-start-[1] col-start-[6] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            Thu
          </div>
          <div
            class="row-start-[1] col-start-[7] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            Fri
          </div>
          <div
            class="row-start-[1] col-start-[8] sticky top-0 z-10 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
            Sat
          </div>
          <div
            class="row-start-[2] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            5 AM
          </div>
          <div class="row-start-[2] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[2] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[2] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[2] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[2] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[2] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[2] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[3] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            6 AM
          </div>
          <div class="row-start-[3] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[3] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[3] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[3] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[3] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[3] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[3] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[4] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            7 AM
          </div>
          <div class="row-start-[4] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[4] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[4] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[4] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[4] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[4] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[4] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[5] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            8 AM
          </div>
          <div class="row-start-[5] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[5] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[5] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[5] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[5] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[5] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[5] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[6] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            9 AM
          </div>
          <div class="row-start-[6] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[6] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[6] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[6] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[6] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[6] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[6] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[7] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            10 AM
          </div>
          <div class="row-start-[7] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[7] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[7] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[7] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[7] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[7] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[7] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[8] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            11 AM
          </div>
          <div class="row-start-[8] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[8] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[8] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[8] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[8] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[8] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[8] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[9] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            12 PM
          </div>
          <div class="row-start-[9] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[9] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[9] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[9] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[9] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[9] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[9] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[10] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            1 PM
          </div>
          <div class="row-start-[10] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[10] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[10] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[10] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[10] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[10] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[10] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[11] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            2 PM
          </div>
          <div class="row-start-[11] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[11] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[11] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[11] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[11] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[11] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[11] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[12] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            3 PM
          </div>
          <div class="row-start-[12] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[12] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[12] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[12] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[12] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[12] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[12] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[13] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            4 PM
          </div>
          <div class="row-start-[13] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[13] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[13] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[13] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[13] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[13] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[13] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[14] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            5 PM
          </div>
          <div class="row-start-[14] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[14] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[14] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[14] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[14] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[14] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[14] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[15] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            6 PM
          </div>
          <div class="row-start-[15] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[15] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[15] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[15] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[15] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[15] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[15] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[16] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            7 PM
          </div>
          <div class="row-start-[16] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[16] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[16] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[16] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[16] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[16] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r"></div>
          <div class="row-start-[16] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
          <div
            class="row-start-[17] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
            8 PM
          </div>
          <div class="row-start-[17] col-start-[2] border-slate-100 dark:border-slate-200/5 border-r"></div>
          <div class="row-start-[17] col-start-[3] border-slate-100 dark:border-slate-200/5 border-r"></div>
          <div class="row-start-[17] col-start-[4] border-slate-100 dark:border-slate-200/5 border-r"></div>
          <div class="row-start-[17] col-start-[5] border-slate-100 dark:border-slate-200/5 border-r"></div>
          <div class="row-start-[17] col-start-[6] border-slate-100 dark:border-slate-200/5 border-r"></div>
          <div class="row-start-[17] col-start-[7] border-slate-100 dark:border-slate-200/5 border-r"></div>
          <div class="row-start-[17] col-start-[8]"></div>
          <!-- Calendar contents -->
          <div
            class="row-start-[2] col-start-3 row-span-4 bg-blue-400/20 dark:bg-sky-600/50 border border-blue-700/10 dark:border-sky-500 rounded-lg m-1 p-1 flex flex-col">
            <span class="text-xs text-blue-600 dark:text-sky-100">5 AM</span>
            <span class="text-xs font-medium text-blue-600 dark:text-sky-100">Flight to Vancouver</span>
            <span class="text-xs text-blue-600 dark:text-sky-100">Toronto YYZ</span>
          </div>
          <div
            class="row-start-[3] col-start-[4] row-span-4 bg-purple-400/20 dark:bg-fuchsia-600/50 border border-purple-700/10 dark:border-fuchsia-500 rounded-lg m-1 p-1 flex flex-col">
            <span class="text-xs text-purple-600 dark:text-fuchsia-100">6 AM</span>
            <span class="text-xs font-medium text-purple-600 dark:text-fuchsia-100">Breakfast</span>
            <span class="text-xs text-purple-600 dark:text-fuchsia-100">Mel's Diner</span>
          </div>
          <div
            class="row-start-[14] col-start-[7] row-span-3 bg-pink-400/20 dark:bg-indigo-600/50 border border-pink-700/10 dark:border-indigo-500 rounded-lg m-1 p-1 flex flex-col">
            <span class="text-xs text-pink-600 dark:text-indigo-100">5 PM</span>
            <span class="text-xs font-medium text-pink-600 dark:text-indigo-100">🎉 Party party 🎉</span>
            <span class="text-xs text-pink-600 dark:text-indigo-100">We like to party!</span>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
  </div>
</template>

<style></style>
