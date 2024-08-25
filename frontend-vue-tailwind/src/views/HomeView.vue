<script setup>
import { ref } from "vue";
import TheWelcome from "../components/TheWelcome.vue";

// Define the data for the component
const people = ref([
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    imageUrl: "https://picsum.photos/200",
    url: "https://example.com/jane-cooper",
    phone: "555-555-5555",
  },
  {
    name: "Monkey D. Rupi",
    title: "Regional Paradigm Technician",
    imageUrl: "https://picsum.photos/seed/picsum/200",
    url: "https://example.com/jane-cooper",
    phone: "555-555-5555",
  },
  {
    name: "John Doe",
    title: "Regional Paradigm Technician",
    imageUrl: "https://picsum.photos/200?grayscale",
    url: "https://example.com/jane-cooper",
    phone: "555-555-5555",
  },
  {
    name: "Alice Cooper",
    title: "Regional Paradigm Technician",
    imageUrl: "https://picsum.photos/200?blur=2",
    url: "https://example.com/jane-cooper",
    phone: "555-555-5555",
  },
]);
</script>

<template>
  <main>
    <ul role="list" class="mx-auto max-w-md bg-white p-2 shadow">
      <li v-for="(person, index) in people" :key="index"
        class="group/item relative flex items-center justify-between rounded-xl p-4 hover:bg-slate-100">
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <img class="h-12 w-12 rounded-full" :src="person.imageUrl" alt="" />
          </div>
          <div class="w-full text-sm leading-6">
            <a href="#" class="font-semibold text-slate-900"><span class="absolute inset-0 rounded-xl"
                aria-hidden="true"></span>
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">{{ person.name }}</font>
              </font>
            </a>
            <div class="text-slate-500">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">{{ person.title }}</font>
              </font>
            </div>
            <div class="text-slate-500">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">monkey.d.rupi</font>
              </font>
            </div>
          </div>
        </div>
        <a href="https://www.ezyops.kr"
          class="group/edit invisible relative flex items-center whitespace-nowrap rounded-full py-1 pl-4 pr-3 text-sm text-slate-500 transition hover:bg-slate-200 group-hover/item:visible">
          <span class="font-semibold transition group-hover/edit:text-gray-700">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">부르다</font>
            </font>
          </span>
          <svg
            class="mt-px h-5 w-5 text-slate-400 transition group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500"
            viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clip-rule="evenodd"></path>
          </svg>
        </a>
      </li>
    </ul>
    <div class="relative rounded-xl overflow-auto">
      <div class="px-4">
        <div class="max-w-sm mx-auto bg-white shadow pt-6 pb-5 px-6 mt-5">
          <form>
            <div>
              <label for="email-2" class="block text-sm font-medium text-slate-700">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">이메일</font>
                </font>
              </label>
              <div class="mt-1">
                <input type="email" name="email" id="email-2"
                  class="peer px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:shadow-none"
                  value="george@krugerindustrial." placeholder="당신@example.com" />
                <p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">유효한 이메일 주소를 입력해주세요.</font>
                  </font>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto my-5">
      <div class="px-4">
        <fieldset class="mx-auto max-w-md bg-white p-8 text-sm shadow">
          <div class="mb-6 border-b border-slate-200 pb-2 text-base font-semibold">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">게시된 상태</font>
            </font>
          </div>
          <input id="draft" class="peer/draft form-radio mr-2 mb-0.5 border-slate-300 text-sky-400 focus:ring-sky-300"
            type="radio" name="status" checked="" /><label class="peer-checked/draft:text-sky-500 font-medium"
            for="draft">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">초안</font>
            </font>
          </label>
          <input id="published"
            class="peer/published form-radio mr-2 mb-0.5 ml-4 border-slate-300 text-sky-400 focus:ring-sky-300"
            type="radio" name="status" /><label class="peer-checked/published:text-sky-500 font-medium" for="published">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">게시됨</font>
            </font>
          </label>
          <div class="peer-checked/draft:block mt-4 hidden text-gray-500">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">초안은 관리자에게만 표시됩니다.</font>
            </font>
          </div>
          <div class="peer-checked/published:block mt-4 hidden text-gray-500">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">귀하의 게시물은 귀하의 사이트에 공개적으로 표시됩니다.</font>
            </font>
          </div>
        </fieldset>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="max-w-md mx-auto bg-white shadow p-6 dark:bg-slate-800">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-200">
          <font style="vertical-align: inherit">
            <font style="vertical-align: inherit">카테고리</font>
          </font>
        </h2>
        <div
          class="flex flex-wrap gap-2 pt-4 text-sm text-sky-600 *:rounded-full *:border *:border-sky-100 *:bg-sky-50 *:px-2 *:py-0.5 dark:text-sky-300 dark:*:border-sky-500/15 dark:*:bg-sky-500/10">
          <div>
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">매상</font>
            </font>
          </div>
          <div>
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">마케팅</font>
            </font>
          </div>
          <div>
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">검색엔진 최적화(SEO)</font>
            </font>
          </div>
          <div>
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">해석학</font>
            </font>
          </div>
          <div>
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">설계</font>
            </font>
          </div>
          <div>
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">전략</font>
            </font>
          </div>
          <div>
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">보안</font>
            </font>
          </div>
          <div>
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">성장</font>
            </font>
          </div>
          <div>
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">이동하는</font>
            </font>
          </div>
          <div>
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">사용자 경험(UX)</font>
            </font>
          </div>
        </div>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="max-w-md mx-auto bg-white shadow py-6 px-4">
        <fieldset>
          <legend class="text-base font-semibold text-slate-900 dark:text-slate-200">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">결제방법</font>
            </font>
          </legend>
          <div class="mt-4 space-y-2">
            <label for="apple"
              class="text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-900 has-[:checked]:bg-indigo-50 grid grid-cols-[24px_1fr_auto] items-center gap-6 rounded-lg p-4 ring-1 ring-transparent hover:bg-slate-100">
              <svg class="w-8" fill="currentColor" viewBox="0 0 24 13">
                <path
                  d="M3.96299 1.735C3.22833 1.73504 2.50814 1.9393 1.88285 2.32497C1.25756 2.71063 0.751781 3.26252 0.42199 3.919C0.144511 4.47115 0 5.08054 0 5.6985C0 6.31645 0.144511 6.92584 0.42199 7.478C0.751781 8.13447 1.25756 8.68636 1.88285 9.07202C2.50814 9.45769 3.22833 9.66195 3.96299 9.662C5.03299 9.662 5.93299 9.31 6.58999 8.705C7.33799 8.015 7.76999 6.995 7.76999 5.789C7.76976 5.51882 7.74634 5.24916 7.69999 4.983H3.96399V6.509H6.10399C6.06043 6.75276 5.96798 6.98519 5.83221 7.19228C5.69644 7.39937 5.52016 7.57684 5.31399 7.714C4.95799 7.955 4.49999 8.093 3.96399 8.093C2.92999 8.093 2.05299 7.396 1.73899 6.457C1.57315 5.96493 1.57315 5.43207 1.73899 4.94C2.05299 4 2.92999 3.304 3.96399 3.304C4.52899 3.29475 5.07496 3.50811 5.48399 3.898L6.61599 2.768C5.89873 2.09384 4.94728 1.72362 3.96299 1.735ZM10.464 2.285V9.185H11.35V6.39H12.815C13.418 6.39 13.925 6.194 14.337 5.802C14.5421 5.61815 14.705 5.39214 14.8146 5.13945C14.9242 4.88676 14.9779 4.61337 14.972 4.338C14.9762 4.06405 14.9216 3.79238 14.8121 3.54125C14.7026 3.29011 14.5406 3.06533 14.337 2.882C14.1354 2.68674 13.897 2.53337 13.6358 2.43073C13.3746 2.32809 13.0956 2.27822 12.815 2.284L10.464 2.285ZM12.891 3.135C13.0456 3.13769 13.1981 3.17139 13.3395 3.23408C13.4808 3.29678 13.6082 3.3872 13.714 3.5C13.8267 3.60959 13.9162 3.74065 13.9774 3.88544C14.0385 4.03024 14.07 4.18582 14.07 4.343C14.07 4.50017 14.0385 4.65576 13.9774 4.80055C13.9162 4.94534 13.8267 5.07641 13.714 5.186C13.6007 5.30328 13.4642 5.39562 13.3132 5.45709C13.1622 5.51857 13 5.54783 12.837 5.543H11.35V3.135H12.837C12.855 3.13458 12.873 3.13458 12.891 3.135ZM17.015 4.31C16.173 4.31 15.538 4.618 15.108 5.235L15.889 5.726C16.177 5.309 16.569 5.1 17.064 5.1C17.3798 5.09612 17.6855 5.21145 17.92 5.423C18.0354 5.51846 18.1282 5.63844 18.1915 5.77423C18.2548 5.91001 18.2871 6.05818 18.286 6.208V6.41C17.946 6.217 17.512 6.121 16.986 6.121C16.369 6.121 15.876 6.266 15.507 6.555C15.137 6.843 14.953 7.232 14.953 7.72C14.949 7.9396 14.994 8.15734 15.0848 8.35733C15.1757 8.55732 15.31 8.73451 15.478 8.876C15.828 9.184 16.263 9.339 16.783 9.339C17.393 9.339 17.881 9.069 18.248 8.529H18.286V9.184H19.134V6.275C19.134 5.665 18.944 5.185 18.566 4.835C18.186 4.485 17.67 4.31 17.015 4.31ZM19.278 4.464L21.224 8.886L20.126 11.266H21.041L24 4.463H23.035L21.667 7.854H21.647L20.241 4.464H19.278ZM17.132 6.832C17.626 6.832 18.012 6.942 18.288 7.162C18.288 7.534 18.141 7.858 17.848 8.135C17.5835 8.39951 17.225 8.54839 16.851 8.549C16.6011 8.55376 16.3573 8.47178 16.161 8.317C16.0697 8.25093 15.9954 8.16402 15.9445 8.06349C15.8935 7.96295 15.8673 7.85171 15.868 7.739C15.868 7.482 15.988 7.269 16.231 7.092C16.471 6.919 16.772 6.832 17.132 6.832Z">
                </path>
              </svg>
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit"> 구글 페이 </font>
              </font><input name="payment_method" id="apple" value="google" type="radio"
                class="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500"
                checked="" />
            </label>
            <label for="google"
              class="text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-800 has-[:checked]:bg-indigo-50 grid grid-cols-[24px_1fr_auto] items-center gap-6 rounded-lg p-4 ring-1 ring-transparent hover:bg-slate-100">
              <svg class="w-8 mt-1 fill-current" fill="currentColor" viewBox="0 0 24 13">
                <path
                  d="M4.38526 1.86704C4.10401 2.19606 3.65392 2.45565 3.20387 2.41854C3.14762 1.97367 3.36793 1.50091 3.62579 1.20892C3.90704 0.870635 4.39932 0.62962 4.79781 0.611084C4.84468 1.07453 4.66182 1.52871 4.38526 1.86704ZM4.79312 2.50663C4.14146 2.46956 3.5836 2.87272 3.27418 2.87272C2.96012 2.87272 2.48659 2.52517 1.97092 2.53443C1.30056 2.5437 0.677025 2.91906 0.33479 3.51694C-0.368428 4.71265 0.151978 6.48308 0.831712 7.45632C1.16457 7.9383 1.56306 8.46662 2.0881 8.44809C2.58507 8.42955 2.78195 8.12834 3.38204 8.12834C3.98677 8.12834 4.16026 8.44809 4.68531 8.43882C5.2291 8.42955 5.57134 7.95688 5.9042 7.47485C6.28388 6.92799 6.43862 6.39499 6.44799 6.36718C6.43862 6.35791 5.3979 5.96402 5.38853 4.77753C5.37915 3.78576 6.20893 3.31304 6.24643 3.28524C5.77759 2.59931 5.04629 2.52517 4.79312 2.50663ZM8.55765 1.16258V8.38789H9.69212V5.91768H11.2626C12.6971 5.91768 13.7051 4.94445 13.7051 3.53552C13.7051 2.12664 12.7159 1.16262 11.3001 1.16262H8.5576L8.55765 1.16258ZM9.69212 2.10806H11.0001C11.9846 2.10806 12.5471 2.62711 12.5471 3.54011C12.5471 4.4531 11.9846 4.97684 10.9954 4.97684H9.69212V2.10806ZM15.7772 8.44345C16.4898 8.44345 17.1508 8.08664 17.4508 7.52119H17.4743V8.38785H18.5244V4.79143C18.5244 3.74868 17.6806 3.07666 16.3819 3.07666C15.1771 3.07666 14.2864 3.75795 14.2536 4.69412H15.2756C15.36 4.24921 15.7771 3.95722 16.3491 3.95722C17.043 3.95722 17.4321 4.27701 17.4321 4.86562V5.26415L16.0163 5.34756C14.6989 5.42634 13.9864 5.95934 13.9864 6.88629C13.9864 7.82245 14.7224 8.44345 15.7772 8.44345ZM16.0819 7.58607C15.4772 7.58607 15.0927 7.29876 15.0927 6.85844C15.0927 6.4043 15.4631 6.14012 16.171 6.09841L17.4321 6.01963V6.42743C17.4321 7.10408 16.8508 7.58607 16.0819 7.58607H16.0819ZM19.9261 10.3529C21.0325 10.3529 21.5529 9.93584 22.0076 8.67057L24 3.14617H22.8467L21.5107 7.41456H21.4872L20.1511 3.14617H18.9651L20.8871 8.40638L20.784 8.72618C20.6106 9.2684 20.3293 9.47698 19.8277 9.47698C19.7386 9.47698 19.5652 9.46771 19.4948 9.45844V10.3251C19.5604 10.3436 19.8417 10.3529 19.9261 10.3529Z">
                </path>
              </svg>
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit"> 애플 페이 </font>
              </font><input name="payment_method" id="google" value="apple" type="radio"
                class="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" />
            </label>
            <label for="credit-card"
              class="text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-800 has-[:checked]:bg-indigo-50 grid grid-cols-[24px_1fr_auto] items-center gap-6 rounded-lg p-4 ring-1 ring-transparent hover:bg-slate-100">
              <svg class="w-8" viewBox="0 0 24 13" fill="none">
                <rect stroke="currentColor" x="0.5" y="0.5" width="23" height="11" rx="1.5"></rect>
                <path fill="currentColor"
                  d="M16.539 3.18591C16.0742 3.01652 15.5828 2.93152 15.088 2.93491C13.488 2.93491 12.358 3.74091 12.35 4.89791C12.34 5.74791 13.153 6.22691 13.768 6.51091C14.399 6.80291 14.61 6.98691 14.608 7.24791C14.604 7.64491 14.104 7.82491 13.639 7.82491C13 7.82491 12.651 7.73591 12.114 7.51291L11.915 7.41991L11.688 8.75191C12.077 8.91391 12.778 9.05291 13.502 9.06491C15.203 9.06491 16.315 8.26391 16.328 7.03291C16.342 6.35391 15.902 5.84091 14.976 5.41691C14.413 5.14191 14.064 4.95791 14.064 4.67891C14.064 4.43191 14.363 4.16791 14.988 4.16791C15.404 4.15785 15.8174 4.23589 16.201 4.39691L16.351 4.46391L16.578 3.17691L16.539 3.18591ZM20.691 3.04291H19.441C19.052 3.04291 18.759 3.14991 18.589 3.53591L16.185 8.98191H17.886L18.226 8.08891L20.302 8.09091C20.351 8.29991 20.501 8.98191 20.501 8.98191H22.001L20.691 3.04291ZM10.049 2.99291H11.67L10.656 8.93491H9.03705L10.049 2.99091V2.99291ZM5.93405 6.26791L6.10205 7.09291L7.68605 3.04291H9.40305L6.85205 8.97391H5.13905L3.73905 3.95191C3.71637 3.8691 3.66312 3.79798 3.59005 3.75291C3.08545 3.49225 2.55079 3.29444 1.99805 3.16391L2.02005 3.03891H4.62905C4.98305 3.05291 5.26805 3.16391 5.36305 3.54191L5.93305 6.27091L5.93405 6.26791ZM18.691 6.87391L19.337 5.21191C19.329 5.22991 19.47 4.86891 19.552 4.64591L19.663 5.15891L20.038 6.87291H18.69L18.691 6.87391Z">
                </path>
              </svg>
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit"> 신용 카드 </font>
              </font><input name="payment_method" id="credit-card" value="credit-card" type="radio"
                class="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" />
            </label>
          </div>
        </fieldset>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="mx-auto grid max-w-md divide-y divide-slate-100 bg-white text-slate-700 shadow">
        <div class="group grid grid-cols-[32px_1fr_auto] pt-6 items-center gap-x-4 px-4 py-4">
          <img class="size-[32px] rounded-full"
            src="https://spotlight.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Favatar.51a13c67.jpg&amp;w=128&amp;q=80"
            alt="" />
          <h4 class="font-semibold text-slate-900">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">스펜서 샤프</font>
            </font>
          </h4>
          <svg fill="none" viewBox="0 0 24 24" strokewidth="1.5" stroke="currentColor"
            class="size-4 group-has-[a]:block hidden">
            <path strokelinecap="round" strokelinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
          </svg>
          <p class="col-start-2 text-sm">
            <font style="vertical-align: inherit"><a href="#" class="text-blue-500 underline">
                <font style="vertical-align: inherit">planeteria.tech</font>
              </a>
              <font style="vertical-align: inherit">
                의 제품 디자이너</font>
            </font><a href="#" class="text-blue-500 underline">
              <font style="vertical-align: inherit"></font>
            </a>
          </p>
        </div>
        <div class="group grid grid-cols-[32px_1fr_auto] items-center gap-x-4 px-4 py-4">
          <img class="size-[32px] rounded-full"
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&amp;w=256&amp;h=256&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="" />
          <h4 class="font-semibold text-slate-900">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">케이시 조던</font>
            </font>
          </h4>
          <svg fill="none" viewBox="0 0 24 24" strokewidth="1.5" stroke="currentColor"
            class="size-4 group-has-[a]:block hidden">
            <path strokelinecap="round" strokelinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
          </svg>
          <p class="col-start-2 text-sm">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">여기에 올 수 있어서 행복해요.</font>
            </font>
          </p>
        </div>
        <div class="group grid grid-cols-[32px_1fr_auto] items-center gap-x-4 px-4 py-4">
          <img class="size-[32px] rounded-full"
            src="https://images.unsplash.com/photo-1590895340509-793cb98788c9?q=80&amp;w=256&amp;h=256&amp;&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="" />
          <h4 class="font-semibold text-slate-900">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">알렉스 리드</font>
            </font>
          </h4>
          <svg fill="none" viewBox="0 0 24 24" strokewidth="1.5" stroke="currentColor"
            class="size-4 group-has-[a]:block hidden">
            <path strokelinecap="round" strokelinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
          </svg>
          <p class="col-start-2 text-sm">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">예술과 기술의 교차점에서 일하는 다분야 디자이너.
              </font>
            </font><br /><a href="#" class="text-blue-500 underline">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">alex-reed.com</font>
              </font>
            </a>
          </p>
        </div>
        <div class="group grid grid-cols-[32px_1fr_auto] items-center pb-6 gap-x-4 px-4 py-4">
          <img class="size-[32px] rounded-full"
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&amp;w=256&amp;h=256&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="" />
          <h4 class="font-semibold text-slate-900">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">테일러 베일리</font>
            </font>
          </h4>
          <svg fill="none" viewBox="0 0 24 24" strokewidth="1.5" stroke="currentColor"
            class="size-4 group-has-[a]:block hidden">
            <path strokelinecap="round" strokelinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
          </svg>
          <p class="col-start-2 text-sm">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">픽셀을 밀어넣고, div를 던지고.</font>
            </font>
          </p>
        </div>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="max-w-md mx-auto bg-white shadow py-6 px-4">
        <fieldset class="space-y-3">
          <legend class="text-base font-semibold text-slate-900 dark:text-slate-200">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">오늘</font>
            </font>
          </legend>
          <div class="grid grid-cols-[1fr_24px] items-center gap-6">
            <label class="peer grid grid-cols-[auto_1fr] items-center gap-3 rounded-md px-2 hover:bg-slate-100">
              <input type="checkbox"
                class="peer size-3.5 appearance-none rounded-sm border border-slate-300 accent-pink-500 dark:accent-pink-600 checked:appearance-auto"
                checked="" />
              <span class="select-none text-slate-700 peer-checked:text-slate-400 peer-checked:line-through">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">할 일 목록을 만드세요</font>
                </font>
              </span>
            </label>
            <div class="size-[26px] rounded-md p-1 hover:bg-red-50 hover:text-red-500 peer-has-[:checked]:hidden">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
          <div class="grid grid-cols-[1fr_24px] items-center gap-6">
            <label class="peer grid grid-cols-[auto_1fr] items-center gap-3 rounded-md px-2 hover:bg-slate-100">
              <input type="checkbox"
                class="peer size-3.5 appearance-none rounded-sm border border-slate-300 accent-pink-500 dark:accent-pink-600 checked:appearance-auto" />
              <span class="select-none text-slate-700 peer-checked:text-slate-400 peer-checked:line-through">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">첫 번째 항목에 체크 표시를 하세요</font>
                </font>
              </span>
            </label>
            <div class="size-[26px] rounded-md p-1 hover:bg-red-50 hover:text-red-500 peer-has-[:checked]:hidden">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
          <div class="grid grid-cols-[1fr_24px] items-center gap-6">
            <label class="peer grid grid-cols-[auto_1fr] items-center gap-3 rounded-md px-2 hover:bg-slate-100">
              <input type="checkbox"
                class="peer size-3.5 appearance-none rounded-sm border border-slate-300 accent-pink-500 dark:accent-pink-600 checked:appearance-auto" />
              <span class="select-none text-slate-700 peer-checked:text-slate-400 peer-checked:line-through">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">경쟁 조건 조사</font>
                </font>
              </span>
            </label>
            <div class="size-[26px] rounded-md p-1 hover:bg-red-50 hover:text-red-500 block peer-has-[:checked]:hidden">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto mt-5">
      <div class="max-w-sm mx-auto bg-white shadow pt-6 pb-5 px-6">
        <form>
          <label class="block">
            <span class="block text-sm font-medium text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">이메일</font>
              </font>
            </span>
            <input type="email" name="email" id="email"
              class="mt-1 px-3 py-2 bg-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              placeholder="당신@example.com" />
          </label>
        </form>
      </div>
    </div>

    <div class="relative rounded-xl overflow-auto mt-5">
      <div class="max-w-sm mx-auto bg-white shadow pt-6 pb-5 px-6">
        <form>
          <label class="block">
            <span class="block text-sm fotn-medium text-slate-500 after:content-['^^'] after:ml-0.5 after:text-red-500">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">몽키디루피</font>
              </font>
            </span>
            <input type="email" name="email" id="email" placeholder="당신@example.com"
              class="mt-1 px-3 py-2 bg-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none foucs:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" />
          </label>
        </form>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="px-6">
        <div class="max-w-lg mx-auto bg-white shadow py-8 px-6">
          <blockquote class="text-2xl font-semibold italic text-center text-slate-900">
            When you look
            <span
              class="relative inline-block before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500"><span
                class="relative text-white">annoyed</span></span>
            all the time, people think that you're busy.
          </blockquote>
        </div>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto p-8">
      <div class="max-w-sm mx-auto">
        <form>
          <label class="relative block">
            <span class="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg class="h-5 w-5 fill-slate-300" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"></path>
              </svg>
            </span>
            <span class="sr-only">Search</span>
            <input type="text" name="search"
              class="block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm placeholder:italic placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              placeholder="Search for anything..." />
          </label>
        </form>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="px-6">
        <div class="max-w-sm mx-auto bg-white shadow py-8 px-6">
          <form class="flex items-center space-x-6">
            <div class="shrink-0">
              <img class="h-16 w-16 object-cover rounded-full"
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1361&amp;q=80"
                alt="Current profile photo" />
            </div>
            <label class="block">
              <span class="sr-only">Choose profile photo</span>
              <input type="file"
                class="block w-full text-sm text-slate-500 file:text-sm file:font-semibold file:py-2 file:px-4 file:bg-violet-50 file:text-violet-700 file:rounded-full file:border-0 file:mr-4 hover:file:bg-violet-100" />
            </label>
          </form>
        </div>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="px-6">
        <div class="max-w-sm mx-auto bg-white shadow py-8 px-8 dark:bg-slate-800">
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-200">
            Ingredients
          </h2>
          <ul role="list"
            class="mt-3 list-disc pl-5 space-y-3 text-slate-500 marker:text-sky-400 dark:text-slate-400 selection:bg-pink-700">
            <li>5 cups chopped Porcini mushrooms</li>
            <li>1/2 cup of olive oil</li>
            <li>3lb of celery</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="px-6">
        <div
          class="max-w-lg mx-auto bg-white text-slate-700 shadow py-8 px-6 selection:bg-fuchsia-300 selection:text-fuchsia-900 dark:bg-slate-800 dark:text-slate-400">
          <p>
            So I started to walk into the water. I won't lie to you boys, I was
            terrified. But I pressed on, and as I made my way past the breakers
            a strange calm came over me. I don't know if it was divine
            intervention or the kinship of all living things but I tell you
            Jerry at that moment, I <em>was</em> a marine biologist.
          </p>
        </div>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="px-6">
        <div
          class="max-w-lg mx-auto bg-white text-slate-700 shadow py-8 px-6 font-serif dark:bg-slate-800 dark:text-slate-200">
          <p
            class="first-line:uppercase first-line:tracking-widest first-letter:text-slate-900 first-letter:text-7xl first-letter:leading-none first-letter:float-left first-letter:font-bold first-letter:mr-3 dark:first-letter:text-white">
            Well, let me tell you something, funny boy. Y'know that little
            stamp, the one that says "New York Public Library"? Well that may
            not mean anything to you, but that means a lot to me. One whole hell
            of a lot.
          </p>
          <p class="mt-6">
            Sure, go ahead, laugh if you want to. I've seen your type before:
            Flashy, making the scene, flaunting convention. Yeah, I know what
            you're thinking. What's this guy making such a big stink about old
            library books? Well, let me give you a hint, junior.
          </p>
        </div>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2">
        <div class="p-8 pt-7">
          <p class="mb-2 text-sm font-medium text-slate-500">Light mode</p>
          <div class="bg-white rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
            <div>
              <span class="inline-flex items-center justify-center p-2 bg-indigo-500 rounded-md shadow-lg">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                  </path>
                </svg>
              </span>
            </div>
            <h3 class="mt-5 text-base font-medium text-slate-900 tracking-tight">
              Writes Upside-Down
            </h3>
            <p class="mt-2 text-sm text-slate-500">
              The Zero Gravity Pen can be used to write in any orientation,
              including upside-down. It even works in outer space.
            </p>
          </div>
        </div>
        <div class="bg-slate-900 p-8 pt-7">
          <p class="mb-2 text-sm font-medium text-slate-400">Dark mode</p>
          <div class="bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
            <div>
              <span class="inline-flex items-center justify-center p-2 bg-indigo-500 rounded-md shadow-lg">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                  </path>
                </svg>
              </span>
            </div>
            <h3 class="mt-5 text-base font-medium text-white tracking-tight">
              Writes Upside-Down
            </h3>
            <p class="mt-2 text-sm text-slate-400">
              The Zero Gravity Pen can be used to write in any orientation,
              including upside-down. It even works in outer space.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="max-w-sm mx-auto bg-white shadow pt-6 pb-4 px-6">
        <form>
          <legend>Choose a theme:</legend>
          <div class="grid grid-flow-col mt-4">
            <label for="theme-1" class="text-sm font-medium text-slate-700">
              <div
                class="relative h-16 w-16 rounded-xl forced-colors:border-0 bg-transparent border border-transparent text-white hover:bg-slate-50 has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-50 has-[:checked]:text-cyan-50 grid items-center justify-center">
                <input type="radio" name="themes" id="theme-1" class="forced-colors:appearance-auto appearance-none"
                  checked="" />
                <p class="forced-colors:block hidden">Cyan</p>
                <div class="absolute left-3 top-3 h-6 w-6 rounded-full bg-cyan-200 forced-colors:hidden"></div>
                <div
                  class="absolute bottom-3 right-3 h-6 w-6 rounded-full bg-cyan-500 ring-2 ring-current forced-colors:hidden">
                </div>
              </div>
            </label>
            <label for="theme-2" class="text-sm font-medium text-slate-700">
              <div
                class="relative h-16 w-16 rounded-xl forced-colors:border-0 bg-transparent border border-transparent text-white hover:bg-slate-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-50 grid items-center justify-center">
                <input type="radio" name="themes" id="theme-2" class="forced-colors:appearance-auto appearance-none" />
                <p class="forced-colors:block hidden">Blue</p>
                <div class="absolute left-3 top-3 h-6 w-6 rounded-full bg-blue-200 forced-colors:hidden"></div>
                <div
                  class="absolute bottom-3 right-3 h-6 w-6 rounded-full bg-blue-500 ring-2 ring-current forced-colors:hidden">
                </div>
              </div>
            </label>
            <label for="theme-3" class="text-sm font-medium text-slate-700">
              <div
                class="relative h-16 w-16 rounded-xl forced-colors:border-0 border bg-transparent border-transparent text-white hover:bg-slate-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-50 grid items-center justify-center">
                <input type="radio" name="themes" id="theme-3" class="forced-colors:appearance-auto appearance-none" />
                <p class="forced-colors:block hidden">Indigo</p>
                <div class="absolute left-3 top-3 h-6 w-6 rounded-full bg-indigo-200 forced-colors:hidden"></div>
                <div
                  class="absolute bottom-3 right-3 h-6 w-6 rounded-full bg-indigo-500 ring-2 ring-current forced-colors:hidden">
                </div>
              </div>
            </label>
            <label for="theme-4" class="text-sm font-medium text-slate-700">
              <div
                class="relative h-16 w-16 rounded-xl forced-colors:border-0 border bg-transparent border-transparent text-white hover:bg-slate-50 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 has-[:checked]:text-purple-50 grid items-center justify-center">
                <input type="radio" name="themes" id="theme-4" class="forced-colors:appearance-auto appearance-none" />
                <p class="forced-colors:block hidden">Purple</p>
                <div class="absolute left-3 top-3 h-6 w-6 rounded-full bg-purple-200 forced-colors:hidden"></div>
                <div
                  class="absolute bottom-3 right-3 h-6 w-6 rounded-full bg-purple-500 ring-2 ring-current forced-colors:hidden">
                </div>
              </div>
            </label>
          </div>
        </form>
      </div>
    </div>
    <div class="flex items-center">
      <div class="w-1/2 flex-grow border border-pink-100">one</div>
      <div class="w-1/2 text-right flex-grow border border-black">two</div>
    </div>
    <div style="display: flex">
      <div>One</div>
      <div>Two</div>
      <div>Three</div>
      <div style="margin-left: auto">Four</div>
      <div>Five</div>
    </div>
    <div class="box">
      <div>One</div>
      <div>Two</div>
      <div>Three</div>
      <div>Four</div>
      <div>Five</div>
      <div>Six</div>
    </div>
    <button class="bg-sky-500 hover:bg-red-900 text-white font-semibold py-2 px-4 rounded-lg">
      Click me
    </button>
    <div class="relative rounded-xl overflow-auto">
      <div class="px-4">
        <div class="max-w-md mx-auto bg-white shadow">
          <ul role="list" class="p-6 divide-y divide-slate-200">
            <li class="py-4 flex first:pt-0 last:pb-0">
              <img class="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                alt="" />
              <div class="ml-3 overflow-hidden">
                <p class="text-sm font-medium text-slate-900">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">크리스틴 라모스</font>
                  </font>
                </p>
                <p class="text-sm text-slate-500 truncate">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">크리스틴.라모스@example.com</font>
                  </font>
                </p>
              </div>
            </li>
            <li class="py-4 flex first:pt-0 last:pb-0">
              <img class="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                alt="" />
              <div class="ml-3 overflow-hidden">
                <p class="text-sm font-medium text-slate-900">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">플로이드 마일즈</font>
                  </font>
                </p>
                <p class="text-sm text-slate-500 truncate">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">플로이드.마일즈@example.com</font>
                  </font>
                </p>
              </div>
            </li>
            <li class="py-4 flex first:pt-0 last:pb-0">
              <img class="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                alt="" />
              <div class="ml-3 overflow-hidden">
                <p class="text-sm font-medium text-slate-900">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">코트니 헨리</font>
                  </font>
                </p>
                <p class="text-sm text-slate-500 truncate">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">코트니.헨리@example.com</font>
                  </font>
                </p>
              </div>
            </li>
            <li class="py-4 flex first:pt-0 last:pb-0">
              <img class="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                alt="" />
              <div class="ml-3 overflow-hidden">
                <p class="text-sm font-medium text-slate-900">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">테드 폭스</font>
                  </font>
                </p>
                <p class="text-sm text-slate-500 truncate">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">ted.fox@example.com</font>
                  </font>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="px-0 sm:px-6">
        <div class="bg-white shadow">
          <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div class="overflow-hidden">
                <table class="min-w-full">
                  <thead class="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-slate-900">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit"> 이름 </font>
                        </font>
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-slate-900">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit"> 제목 </font>
                        </font>
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-slate-900">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit"> 이메일 </font>
                        </font>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="odd:bg-white even:bg-slate-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            제인 쿠퍼
                          </font>
                        </font>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            지역 패러다임 기술자
                          </font>
                        </font>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            제인.쿠퍼@example.com
                          </font>
                        </font>
                      </td>
                    </tr>
                    <tr class="odd:bg-white even:bg-slate-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            코디 피셔
                          </font>
                        </font>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            제품 지침 책임자
                          </font>
                        </font>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            코디.피셔@example.com
                          </font>
                        </font>
                      </td>
                    </tr>
                    <tr class="odd:bg-white even:bg-slate-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            레너드 크라스너
                          </font>
                        </font>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            시니어 디자이너
                          </font>
                        </font>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            레온드.크라스너@example.com
                          </font>
                        </font>
                      </td>
                    </tr>
                    <tr class="odd:bg-white even:bg-slate-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            에밀리 셀먼
                          </font>
                        </font>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            하드웨어 엔지니어링 부사장
                          </font>
                        </font>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            에밀리.셀만@example.com
                          </font>
                        </font>
                      </td>
                    </tr>
                    <tr class="odd:bg-white even:bg-slate-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            안나 로버츠
                          </font>
                        </font>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            최고 전략 책임자
                          </font>
                        </font>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <font style="vertical-align: inherit">
                          <font style="vertical-align: inherit">
                            안나.로버츠@example.com
                          </font>
                        </font>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="max-w-sm mx-auto bg-white shadow py-5 px-6">
        <form>
          <div>
            <label for="username" class="block text-sm font-medium text-slate-700">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">사용자 이름</font>
              </font>
            </label>
            <div class="mt-1">
              <input type="text" name="username" id="username"
                class="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:shadow-none"
                value="tbone" disabled="" />
            </div>
          </div>
          <div class="mt-6">
            <label for="email" class="block text-sm font-medium text-slate-700">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">이메일</font>
              </font>
            </label>
            <div class="mt-1">
              <input type="email" name="email" id="email"
                class="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:shadow-none"
                value="george@krugerindustrial." placeholder="당신@example.com" />
            </div>
          </div>
          <div class="mt-6">
            <label for="password" class="block text-sm font-medium text-slate-700">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">비밀번호</font>
              </font>
            </label>
            <div class="mt-1">
              <input type="password" name="password" id="password"
                class="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:shadow-none"
                value="Bosco" />
            </div>
          </div>
          <div class="mt-6 text-right">
            <button
              class="bg-sky-500 hover:bg-sky-700 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white">
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit"> 변경 사항 저장 </font>
              </font>
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto p-8">
      <a href="#"
        class="group block max-w-xs mx-auto rounded-lg p-4 bg-white ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-sky-500 hover:ring-sky-500">
        <div class="flex items-center space-x-3">
          <svg class="h-6 w-6 stroke-sky-500 group-hover:stroke-white" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 19H6.931A1.922 1.922 0 015 17.087V8h12.069C18.135 8 19 8.857 19 9.913V11"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M14 7.64L13.042 6c-.36-.616-1.053-1-1.806-1H7.057C5.921 5 5 5.86 5 6.92V11M17 15v4M19 17h-4"></path>
          </svg>
          <h3 class="text-sm text-slate-900 font-semibold group-hover:text-white">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">새로운 프로젝트</font>
            </font>
          </h3>
        </div>
        <p class="text-sm text-slate-500 group-hover:text-white">
          <font style="vertical-align: inherit">
            <font style="vertical-align: inherit">다양한 시작 템플릿으로 새로운 프로젝트를 만듭니다.</font>
          </font>
        </p>
      </a>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="px-4">
        <ul role="list" class="mx-auto max-w-md bg-white p-2 shadow">
          <li class="group/item relative flex items-center justify-between rounded-xl p-4 hover:bg-slate-100">
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <img class="h-12 w-12 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                  alt="" />
              </div>
              <div class="w-full text-sm leading-6">
                <a href="#" class="font-semibold text-slate-900"><span class="absolute inset-0 rounded-xl"
                    aria-hidden="true"></span>
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">레슬리 애벗</font>
                  </font>
                </a>
                <div class="text-slate-500">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">공동 창립자 / CEO</font>
                  </font>
                </div>
              </div>
            </div>
            <a href="#"
              class="group/edit invisible relative flex items-center whitespace-nowrap rounded-full py-1 pl-4 pr-3 text-sm text-slate-500 transition hover:bg-slate-200 group-hover/item:visible">
              <span class="font-semibold transition group-hover/edit:text-gray-700">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">부르다</font>
                </font>
              </span>
              <svg
                class="mt-px h-5 w-5 text-slate-400 transition group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500"
                viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clip-rule="evenodd"></path>
              </svg>
            </a>
          </li>
          <li class="group/item relative flex items-center justify-between rounded-xl p-4 hover:bg-slate-100">
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <img class="h-12 w-12 rounded-full"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                  alt="" />
              </div>
              <div class="w-full text-sm leading-6">
                <a href="#" class="font-semibold text-slate-900"><span class="absolute inset-0 rounded-xl"
                    aria-hidden="true"></span>
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">헥터 아담스</font>
                  </font>
                </a>
                <div class="text-slate-500">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">마케팅 부사장</font>
                  </font>
                </div>
              </div>
            </div>
            <a href="#"
              class="group/edit invisible relative flex items-center whitespace-nowrap rounded-full py-1 pl-4 pr-3 text-sm text-slate-500 transition hover:bg-slate-200 group-hover/item:visible">
              <span class="font-semibold transition group-hover/edit:text-gray-700">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">부르다</font>
                </font>
              </span>
              <svg
                class="mt-px h-5 w-5 text-slate-400 transition group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500"
                viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clip-rule="evenodd"></path>
              </svg>
            </a>
          </li>
          <li class="group/item relative flex items-center justify-between rounded-xl p-4 hover:bg-slate-100">
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <img class="h-12 w-12 rounded-full"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                  alt="" />
              </div>
              <div class="w-full text-sm leading-6">
                <a href="#" class="font-semibold text-slate-900"><span class="absolute inset-0 rounded-xl"
                    aria-hidden="true"></span>
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">블레이크 알렉산더</font>
                  </font>
                </a>
                <div class="text-slate-500">
                  <font style="vertical-align: inherit">
                    <font style="vertical-align: inherit">계정 코디네이터</font>
                  </font>
                </div>
              </div>
            </div>
            <a href="#"
              class="group/edit invisible relative flex items-center whitespace-nowrap rounded-full py-1 pl-4 pr-3 text-sm text-slate-500 transition hover:bg-slate-200 group-hover/item:visible">
              <span class="font-semibold transition group-hover/edit:text-gray-700">
                <font style="vertical-align: inherit">
                  <font style="vertical-align: inherit">부르다</font>
                </font>
              </span>
              <svg
                class="mt-px h-5 w-5 text-slate-400 transition group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500"
                viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clip-rule="evenodd"></path>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto p-8">
      <div class="max-w-lg mx-auto">
        <details
          class="open:bg-white dark:open:bg-slate-900 open:ring-1 open:ring-black/5 dark:open:ring-white/10 open:shadow-lg p-6 rounded-lg">
          <summary class="text-sm leading-6 text-slate-900 dark:text-white font-semibold select-none">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">
                왜 오발틴이라고 부르나요?
              </font>
            </font>
          </summary>
          <div class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            <p>
              <font style="vertical-align: inherit">
                <font style="vertical-align: inherit">머그잔은 둥글다. 항아리도 둥글다. 라운드타인이라고
                  불러야지.</font>
              </font>
            </p>
          </div>
        </details>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto">
      <div class="w-72 sm:w-96 px-8 sm:px-12 py-6 sm:py-8 mx-auto bg-white shadow">
        <div class="flex text-base items-center space-x-2">
          <h4 class="text-base font-semibold text-slate-900">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">기여자</font>
            </font>
          </h4>
          <span class="text-xs rounded-full px-2 py-1 bg-slate-100 font-semibold text-slate-700">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">204</font>
            </font>
          </span>
        </div>
        <div class="mt-3 flex -space-x-2 overflow-hidden">
          <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
            alt="" />
          <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
            alt="" />
          <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2.25&amp;w=256&amp;h=256&amp;q=80"
            alt="" />
          <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
            alt="" />
          <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
            alt="" />
        </div>
        <div class="mt-3 text-sm font-medium">
          <a href="#" class="text-blue-500">
            <font style="vertical-align: inherit">
              <font style="vertical-align: inherit">+ 198명 더</font>
            </font>
          </a>
        </div>
      </div>
    </div>
    <div class="relative rounded-xl overflow-auto p-8">
      <div class="text-center">
        <button type="button"
          class="py-2 px-5 bg-violet-500 text-white font-semibold rounded-full shadow-md hover:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75">
          <font style="vertical-align: inherit">
            <font style="vertical-align: inherit"> 변경 사항 저장 </font>
          </font>
        </button>
      </div>
    </div>
    <div class="columns-2">
      <p>Well, let me tell you something, ...</p>
      <p class="break-after-column">Sure, go ahead, laugh...</p>
      <p>Maybe we can live without...</p>
      <p>Look. If you think this is...</p>
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

    <!-- <TheWelcome /> -->
  </main>
</template>

<style>
.box {
  display: flex;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 2em;
}

.box>* {
  flex: 1;
}
</style>
