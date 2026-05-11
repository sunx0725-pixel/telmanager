<template>
  <view class="page">
    <scroll-view class="content" scroll-y>
      <text class="content-text">{{ privacyPolicy }}</text>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { privacyPolicy } from '@/data/mock'
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-white;
}

.content {
  height: 100vh;
  padding: $spacing-lg;

  .content-text {
    font-size: $font-size-base;
    color: $text-secondary;
    line-height: 1.8;
    white-space: pre-wrap;
  }
}
</style>