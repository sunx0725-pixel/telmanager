<template>
  <view class="page">
    <view class="section">
      <view class="section-header">
        <text class="section-title">安全日志</text>
        <text class="section-more">保存6个月</text>
      </view>

      <view v-if="securityStore.sortedLogs.length > 0" class="logs-list">
        <view 
          v-for="log in securityStore.sortedLogs" 
          :key="log.id" 
          class="log-item"
          :class="{ abnormal: log.isAbnormal }"
        >
          <view class="log-icon">
            <text>{{ getLogIcon(log.type) }}</text>
          </view>
          <view class="log-content">
            <view class="log-header">
              <text class="log-type">{{ log.typeName }}</text>
              <text v-if="log.isAbnormal" class="log-warning">异常</text>
            </view>
            <view class="log-detail">
              <text class="log-device">{{ log.device }}</text>
              <text class="log-divider">·</text>
              <text class="log-location">{{ log.location }}</text>
            </view>
            <text class="log-time">{{ log.createdAt }}</text>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无安全日志</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">号码冻结管理</text>
      </view>

      <view v-if="numbersStore.numbers.length > 0" class="freeze-list">
        <view 
          v-for="item in numbersStore.numbers" 
          :key="item.id" 
          class="freeze-item"
        >
          <view class="freeze-left">
            <view class="operator-badge" :style="{ background: getOperatorColor(item.operator) + '20', color: getOperatorColor(item.operator) }">
              {{ getOperatorIcon(item.operator) }} {{ item.operatorName }}
            </view>
            <view class="freeze-info">
              <text class="freeze-phone">{{ item.maskedPhone }}</text>
              <text class="freeze-status" :class="{ frozen: item.isFrozen }">
                {{ item.isFrozen ? '已冻结' : '正常' }}
              </text>
            </view>
          </view>
          <view class="freeze-right">
            <button 
              class="freeze-btn" 
              :class="{ frozen: item.isFrozen }"
              @click="toggleFreeze(item)"
            >
              <text>{{ item.isFrozen ? '解冻' : '冻结' }}</text>
            </button>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <text class="empty-icon">📱</text>
        <text class="empty-text">暂无号码</text>
      </view>
    </view>

    <view class="tips-card">
      <text class="tips-title">🔒 安全提示</text>
      <view class="tips-list">
        <text class="tip-item">• 冻结后号码仅保留查询功能</text>
        <text class="tip-item">• 解冻需完成身份验证</text>
        <text class="tip-item">• 异常登录会被标记并提醒</text>
        <text class="tip-item">• 安全日志保存6个月</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useSecurityStore } from '@/stores/security'
import { useNumbersStore } from '@/stores/numbers'
import { operatorMap } from '@/data/mock'
import type { PhoneNumber } from '@/types'

const securityStore = useSecurityStore()
const numbersStore = useNumbersStore()

const getLogIcon = (type: string) => {
  const icons: Record<string, string> = {
    login: '🔐',
    recharge: '💳',
    invoice: '📄',
    addNumber: '➕',
    freeze: '❄️'
  }
  return icons[type] || '📋'
}

const getOperatorColor = (operator: string) => operatorMap[operator]?.color || '#999999'
const getOperatorIcon = (operator: string) => operatorMap[operator]?.icon || '📱'

const toggleFreeze = (item: PhoneNumber) => {
  if (item.isFrozen) {
    uni.showModal({
      title: '解冻号码',
      content: '解冻需要验证身份',
      success: (res) => {
        if (res.confirm) {
          uni.showModal({
            title: '短信验证',
            editable: true,
            placeholderText: '请输入验证码',
            success: (codeRes) => {
              if (codeRes.confirm && codeRes.content) {
                numbersStore.unfreezeNumber(item.id)
                uni.showToast({ title: '解冻成功', icon: 'success' })
              }
            }
          })
        }
      }
    })
  } else {
    uni.showModal({
      title: '冻结号码',
      content: '冻结后将仅保留查询功能',
      confirmText: '确认冻结',
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          numbersStore.freezeNumber(item.id)
          uni.showToast({ title: '冻结成功', icon: 'success' })
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 120rpx;
}

.section {
  padding: $spacing-base $spacing-lg;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-base;

    .section-title {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-primary;
    }

    .section-more {
      font-size: $font-size-sm;
      color: $text-hint;
    }
  }
}

.logs-list {
  background: $bg-white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;

  .log-item {
    display: flex;
    gap: $spacing-base;
    padding: $spacing-base;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    &.abnormal {
      background: rgba($error-color, 0.03);
    }

    .log-icon {
      width: 64rpx;
      height: 64rpx;
      background: $bg-color;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      flex-shrink: 0;
    }

    .log-content {
      flex: 1;
      min-width: 0;

      .log-header {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        margin-bottom: 4rpx;

        .log-type {
          font-size: $font-size-base;
          font-weight: 500;
          color: $text-primary;
        }

        .log-warning {
          font-size: $font-size-xs;
          color: $error-color;
          padding: 4rpx 12rpx;
          background: rgba($error-color, 0.1);
          border-radius: $radius-sm;
        }
      }

      .log-detail {
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        margin-bottom: 4rpx;

        .log-device, .log-location {
          font-size: $font-size-sm;
          color: $text-secondary;
        }

        .log-divider {
          color: $text-hint;
        }
      }

      .log-time {
        font-size: $font-size-xs;
        color: $text-hint;
      }
    }
  }
}

.empty-state {
  background: $bg-white;
  border-radius: $radius-lg;
  padding: $spacing-xl * 2;
  text-align: center;
  box-shadow: $shadow-sm;

  .empty-icon {
    font-size: 80rpx;
    margin-bottom: $spacing-base;
  }

  .empty-text {
    font-size: $font-size-base;
    color: $text-hint;
  }
}

.freeze-list {
  background: $bg-white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;

  .freeze-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-base;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .freeze-left {
      display: flex;
      align-items: center;
      gap: $spacing-base;

      .operator-badge {
        padding: 8rpx 16rpx;
        border-radius: $radius-sm;
        font-size: $font-size-xs;
        display: flex;
        align-items: center;
        gap: 8rpx;
      }

      .freeze-info {
        display: flex;
        flex-direction: column;

        .freeze-phone {
          font-size: $font-size-base;
          font-weight: 500;
          color: $text-primary;
        }

        .freeze-status {
          font-size: $font-size-xs;
          color: $success-color;

          &.frozen {
            color: $warning-color;
          }
        }
      }
    }

    .freeze-right {
      .freeze-btn {
        padding: 12rpx 24rpx;
        border-radius: $radius-base;
        font-size: $font-size-sm;
        background: rgba($warning-color, 0.1);
        color: $warning-color;
        border: none;

        &.frozen {
          background: rgba($primary-color, 0.1);
          color: $primary-color;
        }
      }
    }
  }
}

.tips-card {
  margin: $spacing-lg;
  background: rgba($primary-color, 0.05);
  border-radius: $radius-lg;
  padding: $spacing-lg;

  .tips-title {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-sm;
    display: block;
  }

  .tips-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    .tip-item {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
}
</style>