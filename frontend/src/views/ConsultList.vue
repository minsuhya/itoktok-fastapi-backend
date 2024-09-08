<template>
  <div id="webcrumbs">
    <div class="w-[1000px] p-4 bg-neutral-50 shadow-lg rounded-lg">
      <div class="flex items-center">
        <img
          src="https://tools-api.webcrumbs.org/image-placeholder/50/50/avatar/1"
          alt="avatar"
          class="w-[50px] h-[50px] rounded-full mr-4 object-cover"
        />
        <div>
          <div class="font-title">테스트</div>
          <div class="text-sm text-neutral-500">정보조회</div>
        </div>
      </div>
      <div class="mt-4">
        <div class="flex justify-between items-center">
          <div class="text-sm text-neutral-700">등록일: 2024-07-16</div>
          <div class="text-sm text-neutral-700">연락처: 010-1111-1111</div>
        </div>
        <div class="mt-4 text-sm text-neutral-700">
          <div class="mb-2">상담센터: 해와나무 (isunfree02)</div>
          <div>상담사: 박형근 (leyn83)</div>
        </div>
      </div>
      <div class="flex justify-around mt-6 text-neutral-500">
        <div>내담자 정보</div>
        <div>상담 신청서</div>
        <div class="text-primary">상담관리</div>
        <div>검사관리</div>
        <div>문서관리</div>
      </div>
      <div class="flex justify-end mt-4">
        <button class="border border-primary text-primary py-1 px-4 rounded-md mr-2">
          문서전송
        </button>
        <button class="border border-primary text-primary py-1 px-4 rounded-md">검사전송</button>
      </div>
    </div>
  </div>
</template>
