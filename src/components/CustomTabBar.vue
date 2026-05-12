<template>
  <view class="custom-tab-bar">
    <view 
      v-for="(item, index) in tabList" 
      :key="index"
      class="tab-item"
      :class="{ active: current === index }"
      @click="switchTab(item.pagePath, index)"
    >
      <view class="tab-icon">
        <text v-html="item[current === index ? 'activeIcon' : 'icon']"></text>
      </view>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tabList = [
  {
    pagePath: '/pages/index/index',
    text: '首页',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2.5L3 9h2v12h6v-7h2v7h6V9h2L12 2.5z" fill="none" stroke="#999999" stroke-width="2" stroke-linejoin="round"/></svg>',
    activeIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2.5L3 9h2v12h6v-7h2v7h6V9h2L12 2.5z" fill="#3182CE"/></svg>'
  },
  {
    pagePath: '/pages/numbers/index',
    text: '号码',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><rect x="6" y="2" width="12" height="20" rx="2" fill="none" stroke="#999999" stroke-width="2"/><circle cx="12" cy="20" r="1" fill="#999999"/><rect x="8" y="4" width="8" height="10" rx="1" fill="none" stroke="#999999" stroke-width="1.5"/></svg>',
    activeIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><rect x="6" y="2" width="12" height="20" rx="2" fill="#3182CE"/><circle cx="12" cy="20" r="1" fill="white"/><rect x="8" y="4" width="8" height="10" rx="1" fill="white" opacity="0.3"/></svg>'
  },
  {
    pagePath: '/pages/payment/index',
    text: '缴费',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="#999999" stroke-width="2"/><rect x="3" y="5" width="18" height="4" fill="none" stroke="#999999" stroke-width="1.5"/><circle cx="19" cy="12" r="2" fill="none" stroke="#999999" stroke-width="1.5"/></svg>',
    activeIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="5" width="18" height="14" rx="2" fill="#3182CE"/><rect x="3" y="5" width="18" height="4" fill="white" opacity="0.3"/><circle cx="19" cy="12" r="2" fill="white"/></svg>'
  },
  {
    pagePath: '/pages/invoice/index',
    text: '发票',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M7 3h10l3 3v14H7V3z" fill="none" stroke="#999999" stroke-width="2" stroke-linejoin="round"/><path d="M17 3v3h3" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="9" y="9" width="6" height="1" fill="#999999" rx="0.5"/><rect x="9" y="12" width="6" height="1" fill="#999999" rx="0.5"/><rect x="9" y="15" width="4" height="1" fill="#999999" rx="0.5"/></svg>',
    activeIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M7 3h10l3 3v14H7V3z" fill="#3182CE"/><path d="M17 3v3h3" fill="white" opacity="0.3"/><rect x="9" y="9" width="6" height="1" fill="white" rx="0.5"/><rect x="9" y="12" width="6" height="1" fill="white" rx="0.5"/><rect x="9" y="15" width="4" height="1" fill="white" rx="0.5"/></svg>'
  },
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="8" r="4" fill="none" stroke="#999999" stroke-width="2"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round"/></svg>',
    activeIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="8" r="4" fill="#3182CE"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" fill="#3182CE"/></svg>'
  }
];

const current = ref(0);

const switchTab = (pagePath: string, index: number) => {
  current.value = index;
  uni.switchTab({ url: pagePath });
};
</script>

<style lang="scss" scoped>
.custom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  padding-bottom: env(safe-area-inset-bottom);
  background: white;
  border-top: 1px solid #E2E8F0;
  display: flex;
  z-index: 999;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  transition: all 0.2s;
  
  &.active {
    .tab-text {
      color: #3182CE;
      font-weight: 500;
    }
  }
}

.tab-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-text {
  font-size: 10px;
  color: #999999;
}
</style>