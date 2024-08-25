<script setup></script>

<template>
  <main>
    <div class="mt-4 -mb-3">
      <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden w-8/12 mx-auto dark:bg-slate-800/25">
        <div class="relative rounded-xl overflow-auto">
          <div class="mx-4 mt-1 box-content bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
            <div
              class="overflow-y-scroll grid grid-cols-[70px,repeat(7,1fr)] grid-rows-[auto,repeat(16,50px)] max-h-[500px]">
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
              <div class="row-start-[10] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[10] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[10] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[10] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[10] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[10] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[10] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
              <div
                class="row-start-[11] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
                2 PM
              </div>
              <div class="row-start-[11] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[11] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[11] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[11] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[11] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[11] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[11] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
              <div
                class="row-start-[12] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
                3 PM
              </div>
              <div class="row-start-[12] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[12] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[12] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[12] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[12] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[12] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[12] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
              <div
                class="row-start-[13] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
                4 PM
              </div>
              <div class="row-start-[13] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[13] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[13] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[13] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[13] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[13] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[13] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
              <div
                class="row-start-[14] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
                5 PM
              </div>
              <div class="row-start-[14] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[14] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[14] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[14] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[14] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[14] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[14] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
              <div
                class="row-start-[15] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
                6 PM
              </div>
              <div class="row-start-[15] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[15] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[15] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[15] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[15] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[15] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[15] col-start-[8] border-slate-100 dark:border-slate-200/5 border-b"></div>
              <div
                class="row-start-[16] col-start-[1] border-slate-100 dark:border-slate-200/5 border-r text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium">
                7 PM
              </div>
              <div class="row-start-[16] col-start-[2] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[16] col-start-[3] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[16] col-start-[4] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[16] col-start-[5] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[16] col-start-[6] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
              <div class="row-start-[16] col-start-[7] border-slate-100 dark:border-slate-200/5 border-b border-r">
              </div>
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
    </div>
  </main>
</template>

<style></style>
