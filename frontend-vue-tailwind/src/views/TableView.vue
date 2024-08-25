<script setup></script>

<template>
  <main>
    <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25 w-10/12 mx-auto mt-6">
      <div style="background-position: 10px 10px"
        class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]">
      </div>
      <div class="relative rounded-xl overflow-auto">
        <div class="shadow-sm overflow-hidden my-8">
          <div class="table border-collapse table-auto w-full text-sm">
            <div class="table-header-group">
              <div class="table-row">
                <div
                  class="table-cell border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">노래</font>
                  </font>
                </div>
                <div
                  class="table-cell border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">아티스트</font>
                  </font>
                </div>
                <div
                  class="table-cell border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">년도</font>
                  </font>
                </div>
              </div>
            </div>
            <div class="table-row-group bg-white dark:bg-slate-800">
              <div class="table-row">
                <div
                  class="table-cell border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">슬라이딩 Mr. Bones (다음 정거장, 포터스빌)</font>
                  </font>
                </div>
                <div
                  class="table-cell border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">말콤 로키어</font>
                  </font>
                </div>
                <div
                  class="table-cell border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">1961</font>
                  </font>
                </div>
              </div>
              <div class="table-row">
                <div
                  class="table-cell border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">마녀의 여자</font>
                  </font>
                </div>
                <div
                  class="table-cell border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">이글스</font>
                  </font>
                </div>
                <div
                  class="table-cell border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">1972</font>
                  </font>
                </div>
              </div>
              <div class="table-row">
                <div
                  class="table-cell border-b border-slate-200 dark:border-slate-600 p-4 pl-8 text-slate-500 dark:text-slate-400">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">샤이닝 스타</font>
                  </font>
                </div>
                <div
                  class="table-cell border-b border-slate-200 dark:border-slate-600 p-4 text-slate-500 dark:text-slate-400">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">땅, 바람, 불</font>
                  </font>
                </div>
                <div
                  class="table-cell border-b border-slate-200 dark:border-slate-600 p-4 pr-8 text-slate-500 dark:text-slate-400">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">1975</font>
                  </font>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
    </div>

    <div class="mt-4 -mb-3 w-10/12 mx-auto">
      <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">
        <div
          class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
          style="background-position: 10px 10px"></div>
        <div class="relative rounded-xl overflow-auto">
          <div class="py-8">
            <div class="mb-3 pl-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              Showing all rows
            </div>
            <table
              class="border-collapse w-full border-y border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm">
              <thead class="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-600 font-semibold px-4 py-3 text-slate-900 dark:text-slate-200 text-left">
                    Invoice #
                  </th>
                  <th
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-600 font-semibold px-4 py-3 text-slate-900 dark:text-slate-200 text-left">
                    Client
                  </th>
                  <th
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-600 font-semibold px-4 py-3 text-slate-900 dark:text-slate-200 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    #100
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    Pendant Publishing
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400 text-right tabular-nums">
                    $2,000.00
                  </td>
                </tr>
                <tr>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    #101
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    Kruger Industrial Smoothing
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400 text-right tabular-nums">
                    $545.00
                  </td>
                </tr>
                <tr>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    #102
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    J. Peterman
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400 text-right tabular-nums">
                    $10,000.25
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="mt-10 mb-3 pl-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              Hiding a row using
              <code class="text-xs text-slate-700 dark:text-slate-300">`collapse`</code>
            </div>
            <table
              class="border-collapse w-full border-y border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm">
              <thead class="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-600 font-semibold px-4 py-3 text-slate-900 dark:text-slate-200 text-left">
                    Invoice #
                  </th>
                  <th
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-600 font-semibold px-4 py-3 text-slate-900 dark:text-slate-200 text-left">
                    Client
                  </th>
                  <th
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-600 font-semibold px-4 py-3 text-slate-900 dark:text-slate-200 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    #100
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    Pendant Publishing
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400 text-right tabular-nums">
                    $2,000.00
                  </td>
                </tr>
                <tr class="collapse">
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    #101
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    Kruger Industrial Smoothing
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400 text-right tabular-nums">
                    $545.00
                  </td>
                </tr>
                <tr>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    #102
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    J. Peterman
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400 text-right tabular-nums">
                    $10,000.25
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="mt-10 mb-3 pl-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              Hiding a row using
              <code class="text-xs text-slate-700 dark:text-slate-300">`hidden`</code>
            </div>
            <table
              class="border-collapse w-full border-y border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm">
              <thead class="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-600 font-semibold px-4 py-3 text-slate-900 dark:text-slate-200 text-left">
                    Invoice #
                  </th>
                  <th
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-600 font-semibold px-4 py-3 text-slate-900 dark:text-slate-200 text-left">
                    Client
                  </th>
                  <th
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-600 font-semibold px-4 py-3 text-slate-900 dark:text-slate-200 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    #100
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    Pendant Publishing
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400 text-right tabular-nums">
                    $2,000.00
                  </td>
                </tr>
                <tr class="hidden">
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    #101
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    Kruger Industrial Smoothing
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400 text-right tabular-nums">
                    $545.00
                  </td>
                </tr>
                <tr>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    #102
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400">
                    J. Peterman
                  </td>
                  <td
                    class="border first:border-l-0 last:border-r-0 border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-500 dark:text-slate-400 text-right tabular-nums">
                    $10,000.25
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
      </div>
    </div>
    <div class="mt-4 -mb-3">
      <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">
        <div
          class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
          style="background-position: 10px 10px"></div>
        <div class="relative rounded-xl overflow-auto p-8">
          <div class="flex justify-center -space-x-3 font-mono text-white text-sm font-bold leading-6">
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center bg-pink-500 shadow-lg ring-2 ring-white z-40 dark:ring-slate-900">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">05</font>
              </font>
            </div>
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center bg-pink-500 shadow-lg ring-2 ring-white z-30 dark:ring-slate-900">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">04</font>
              </font>
            </div>
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center bg-pink-500 shadow-lg ring-2 ring-white z-20 dark:ring-slate-900">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">03</font>
              </font>
            </div>
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center bg-pink-500 shadow-lg ring-2 ring-white z-10 dark:ring-slate-900">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">02</font>
              </font>
            </div>
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center bg-pink-500 shadow-lg ring-2 ring-white z-0 dark:ring-slate-900">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">01</font>
              </font>
            </div>
          </div>
        </div>
        <div class="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
      </div>
    </div>
    <div class="mt-4 mx-auto w-1">
      <p class="truncate w-20">This is a long text that will be truncated</p>
    </div>
    <div class="mt-4 mx-auto w-96 divide-red-600 divide-y">
      <div class="border-x-4 border-slate-500 dark:border-slate-400">
        <p class="truncate">This is a long text that will be truncated</p>
      </div>
      <div class="border-x-4 border-slate-500 dark:border-slate-400">
        <p class="truncate">This is a long text that will be truncated</p>
      </div>
      <div class="border-x-4 border-slate-500 dark:border-slate-400">
        <p class="truncate">This is a long text that will be truncated</p>
      </div>
      <div class="border-x-4 border-slate-500 dark:border-slate-400">
        <p class="truncate">This is a long text that will be truncated</p>
        <button
          class="px-4 py-2 font-semibold text-sm text-slate-700 rounded-md shadow-sm ring-1 rign-slate-900/5 border-2 border-indigo-500 border-none">
          Save Changes
        </button>
      </div>
    </div>
    <div class="mt-4 -mb-3">
      <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">
        <div
          class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
          style="background-position: 10px 10px"></div>
        <div class="relative rounded-xl overflow-auto p-8">
          <div
            class="grid grid-cols-3 divide-x font-mono text-sm text-center font-bold leading-6 rounded-lg shadow-lg overflow-hidden dark:divide-slate-700">
            <div class="p-4 text-slate-400 bg-white dark:bg-slate-800">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">01</font>
              </font>
            </div>
            <div class="p-4 text-slate-400 bg-white dark:bg-slate-800">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">02</font>
              </font>
            </div>
            <div class="p-4 text-slate-400 bg-white dark:bg-slate-800">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">03</font>
              </font>
            </div>
          </div>
        </div>
        <div class="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
      </div>
    </div>
    <div class="mt-4 -mb-3">
      <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">
        <div
          class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
          style="background-position: 10px 10px"></div>
        <div class="relative rounded-xl overflow-auto p-8">
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 font-bold text-white text-sm text-center">
            <div class="flex flex-col items-center shrink-0">
              <p class="font-medium text-sm text-slate-500 font-mono text-center mb-3 dark:text-slate-400">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">개요-1</font>
                </font>
              </p>
              <button
                class="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm outline outline-1 outline-offset-4 outline-blue-500 dark:bg-slate-700 dark:text-slate-200 dark:border-transparent">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">버튼 A</font>
                </font>
              </button>
            </div>
            <div class="flex flex-col items-center shrink-0">
              <p class="font-medium text-sm text-slate-500 font-mono text-center mb-3 dark:text-slate-400">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">개요-2</font>
                </font>
              </p>
              <button
                class="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm outline outline-2 outline-offset-2 outline-blue-500 dark:bg-slate-700 dark:text-slate-200 dark:border-transparent">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">버튼 B</font>
                </font>
              </button>
            </div>
            <div class="flex flex-col items-center shrink-0">
              <p class="font-medium text-sm text-slate-500 font-mono text-center mb-3 dark:text-slate-400">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">개요-4</font>
                </font>
              </p>
              <button
                class="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm outline outline-4 outline-offset-2 outline-blue-500 dark:bg-slate-700 dark:text-slate-200 dark:border-transparent">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">버튼 C</font>
                </font>
              </button>
            </div>
          </div>
        </div>
        <div class="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
      </div>
    </div>
    <div class="mt-4 -mb-3">
      <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden">
        <div class="relative rounded-xl overflow-auto">
          <div class="flex sm:block overflow-scroll sm:overflow-visible scroll-p-8">
            <div class="flex items-center justify-around gap-12 font-mono font-bold shrink-0 p-8 border">
              <div class="flex flex-col items-center shrink-0 border">
                <p class="font-medium text-sm text-slate-500 font-mono text-center mb-3">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">섀도우-md</font>
                  </font>
                </p>
                <div class="w-24 h-24 rounded-lg bg-white shadow-md"></div>
              </div>
              <div class="flex flex-col items-center shrink-0">
                <p class="font-medium text-sm text-slate-500 font-mono text-center mb-3">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">그림자-lg</font>
                  </font>
                </p>
                <div class="w-24 h-24 rounded-lg bg-white shadow-lg"></div>
              </div>
              <div class="flex flex-col items-center shrink-0">
                <p class="font-medium text-sm text-slate-500 font-mono text-center mb-3">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">섀도우-xl</font>
                  </font>
                </p>
                <div class="w-24 h-24 rounded-lg bg-white shadow-xl"></div>
              </div>
              <div class="flex flex-col items-center shrink-0">
                <p class="font-medium text-sm text-slate-500 font-mono text-center mb-3">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">섀도우-2xl</font>
                  </font>
                </p>
                <div class="w-24 h-24 rounded-lg bg-white shadow-2xl"></div>
              </div>
            </div>
            <div class="flex flex-col items-center shrink-0">
              <p class="font-medium text-sm text-slate-500 font-mono text-center mb-3">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">섀도우-inner</font>
                </font>
              </p>
              <div class="w-24 h-24 rounded-lg bg-white shadow-inner shadow-pink-600"></div>
            </div>
          </div>
        </div>
        <div class="absolute inset-0 pointer-events-none border border-black/5 rounded-xl"></div>
      </div>
    </div>
    <div class="mt-4 -mb-3">
      <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25 w-10/12 mx-auto">
        <div
          class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
          style="background-position: 10px 10px"></div>
        <div class="relative rounded-xl overflow-auto">
          <div class="shadow-sm overflow-hidden my-8">
            <table class="border-collapse table-auto w-full text-sm">
              <caption class="caption-bottom">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">노래 목록</font>
                </font>
              </caption>
              <thead>
                <tr>
                  <th
                    class="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                    <font style="vertical-align: inherit">
                      <font style="vertical-align: inherit">노래</font>
                    </font>
                  </th>
                  <th
                    class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                    <font style="vertical-align: inherit">
                      <font style="vertical-align: inherit">아티스트</font>
                    </font>
                  </th>
                  <th
                    class="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                    <font style="vertical-align: inherit">
                      <font style="vertical-align: inherit">년도</font>
                    </font>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-slate-800">
                <tr>
                  <td
                    class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                    <font style="vertical-align: inherit">
                      <font style="vertical-align: inherit">슬라이딩 Mr. Bones (다음 정거장, 포터스빌)</font>
                    </font>
                  </td>
                  <td class="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                    <font style="vertical-align: inherit">
                      <font style="vertical-align: inherit">말콤 로키어</font>
                    </font>
                  </td>
                  <td
                    class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                    <font style="vertical-align: inherit">
                      <font style="vertical-align: inherit">1961</font>
                    </font>
                  </td>
                </tr>
                <tr>
                  <td
                    class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                    <font style="vertical-align: inherit">
                      <font style="vertical-align: inherit">마녀의 여자</font>
                    </font>
                  </td>
                  <td class="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                    <font style="vertical-align: inherit">
                      <font style="vertical-align: inherit">이글스</font>
                    </font>
                  </td>
                  <td
                    class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                    <font style="vertical-align: inherit">
                      <font style="vertical-align: inherit">1972</font>
                    </font>
                  </td>
                </tr>
                <tr>
                  <td
                    class="border-b border-slate-200 dark:border-slate-600 p-4 pl-8 text-slate-500 dark:text-slate-400">
                    <font style="vertical-align: inherit">
                      <font style="vertical-align: inherit">샤이닝 스타</font>
                    </font>
                  </td>
                  <td class="border-b border-slate-200 dark:border-slate-600 p-4 text-slate-500 dark:text-slate-400">
                    <font style="vertical-align: inherit">
                      <font style="vertical-align: inherit">땅, 바람, 불</font>
                    </font>
                  </td>
                  <td
                    class="border-b border-slate-200 dark:border-slate-600 p-4 pr-8 text-slate-500 dark:text-slate-400">
                    <font style="vertical-align: inherit">
                      <font style="vertical-align: inherit">1975</font>
                    </font>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
      </div>
    </div>
    <div class="mt-4 -mb-3">
      <div class="not-prose mb-4">
        <div class="flex space-x-2">
          <svg class="flex-none w-5 h-5" viewBox="0 0 20 20" fill="none" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <path
              d="m9.813 9.25.346-5.138a1.276 1.276 0 0 0-2.54-.235L6.75 11.25 5.147 9.327a1.605 1.605 0 0 0-2.388-.085.018.018 0 0 0-.004.019l1.98 4.87a5 5 0 0 0 4.631 3.119h3.885a4 4 0 0 0 4-4v-1a3 3 0 0 0-3-3H9.813Z"
              class="stroke-slate-400 dark:stroke-slate-300"></path>
            <path d="M3 5s.35-.47 1.25-.828m9.516-.422c2.078.593 3.484 1.5 3.484 1.5"
              class="stroke-slate-400 dark:stroke-sky-400"></path>
          </svg>
          <p class="text-slate-700 text-sm font-medium dark:text-slate-200">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">예상되는 동작을 보려면 버튼을 마우스로 가리킵니다.</font>
            </font>
          </p>
        </div>
      </div>
      <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">
        <div
          class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
          style="background-position: 10px 10px"></div>
        <div class="relative rounded-xl overflow-auto p-8">
          <div class="flex justify-around text-white text-sm font-bold leading-6">
            <button
              class="px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-md shadow-sm hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 ease-in-out delay-150 duration-300">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit"> 변경 사항 저장 </font>
              </font>
            </button>
          </div>
        </div>
        <div class="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
      </div>
    </div>
    <div class="mt-4 -mb-3">
      <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">
        <div
          class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
          style="background-position: 10px 10px"></div>
        <div class="relative rounded-xl overflow-auto p-8">
          <div class="flex items-center justify-center">
            <span class="relative inline-flex">
              <button type="button"
                class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-sky-500 bg-white dark:bg-slate-800 transition ease-in-out duration-150 cursor-not-allowed ring-1 ring-slate-900/10 dark:ring-slate-200/20"
                disabled="">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit"> 업무 </font>
                </font>
              </button>
              <span class="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>
            </span>
          </div>
        </div>
        <div class="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
      </div>
    </div>
    <div class="mt-4 -mb-3">
      <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">
        <div
          class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
          style="background-position: 10px 10px"></div>
        <div class="relative rounded-xl overflow-auto p-8">
          <div class="flex flex-wrap justify-center gap-6">
            <label class="flex items-center space-x-2">
              <input type="checkbox" checked="" />
              <div class="text-slate-900 text-sm font-semibold dark:text-slate-200">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">
                    브라우저 기본값
                  </font>
                </font>
              </div>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" class="accent-pink-500" checked="" />
              <div class="text-slate-900 text-sm font-semibold dark:text-slate-200">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit"> 맞춤형 </font>
                </font>
              </div>
            </label>
          </div>
        </div>
        <div class="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
      </div>
    </div>
  </main>
</template>

<style></style>
