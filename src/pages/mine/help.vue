<template>
  <view class="page">
    <view class="help-list">
      <view 
        v-for="(item, index) in helpCenterData" 
        :key="index" 
        class="help-item"
        @click="toggleExpand(index)"
      >
        <view class="help-header">
          <text class="help-title">{{ item.title }}</text>
          <text class="help-arrow" :class="{ expanded: expandedIndex === index }">▼</text>
        </view>
        <view v-if="expandedIndex === index" class="help-content">
          <text>{{ item.content }}</text>
        </view>
      </view>
    </view>

    <view class="contact-section">
      <text class="contact-title">联系客服</text>
      <view class="contact-methods">
        <view class="contact-item">
          <text class="contact-icon">📞</text>
          <view class="contact-info">
            <text class="contact-label">客服热线</text>
            <text class="contact-value">400-888-8888</text>
          </view>
        </view>
        <view class="contact-item">
          <text class="contact-icon">✉️</text>
          <view class="contact-info">
            <text class="contact-label">邮箱</text>
            <text class="contact-value">support@telmanager.com</text>
          </view>
        </view>
        <view class="contact-item">
          <text class="contact-icon">🕐</text>
          <view class="contact-info">
            <text class="contact-label">服务时间</text>
            <text class="contact-value">9:00 - 21:00</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { helpCenterData } from '@/data/mock'

const expandedIndex = ref(-1)

const toggleExpand = (index: number) => {
  expandedIndex.value = expandedIndex.value === index ? -1 : index
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 120rpx;
}

.help-list {
  padding: $spacing-lg;

  .help-item {
    background: $bg-white;
    border-radius: $radius-lg;
    margin-bottom: $spacing-base;
    overflow: hidden;
    box-shadow: $shadow-sm;

    .help-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-base;

      .help-title {
        flex: 1;
        font-size: $font-size-base;
        font-weight: 500;
        color: $text-primary;
      }

      .help-arrow {
        font-size: $font-size-sm;
        color: $text-hint;
        transition: transform 0.2s;

        &.expanded {
          transform: rotate(180deg);
        }
      }
    }

    .help-content {
      padding: 0 $spacing-base $spacing-base;
      font-size: $font-size-base;
      color: $text-secondary;
      line-height: 1.8;
    }
  }
}

.contact-section {
  margin: $spacing-lg;
  background: $bg-white;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-sm;

  .contact-title {
    display: block;
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-lg;
  }

  .contact-methods {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;

    .contact-item {
      display: flex;
      align-items: center;
      gap: $spacing-base;

      .contact-icon {
        font-size: 40rpx;
      }

      .contact-info {
        display: flex;
        flex-direction: column;

        .contact-label {
          font-size: $font-size-xs;
          color: $text-hint;
        }

        .contact-value {
          font-size: $font-size-base;
          color: $text-primary;
          font-weight: 500;
        }
      }
    }
  }
}
</style>