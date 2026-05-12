<template>
  <view class="page">
    <view class="quick-actions">
      <view class="action-card" @click="goToRecharge">
        <text class="action-icon">💳</text>
        <text class="action-text">话费充值</text>
      </view>
      <view class="action-card" @click="goToRecords">
        <text class="action-icon">📋</text>
        <text class="action-text">充值记录</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">快捷充值</text>
      </view>

      <view v-if="numbersStore.numbers.length > 0" class="numbers-list">
        <view 
          v-for="item in numbersStore.numbers" 
          :key="item.id" 
          class="number-item"
        >
          <view class="item-left">
            <view class="operator-badge" :style="{ background: getOperatorColor(item.operator) + '20', color: getOperatorColor(item.operator) }">
              {{ getOperatorIcon(item.operator) }} {{ item.operatorName }}
            </view>
            <view class="item-info">
              <text class="item-phone">{{ item.maskedPhone }}</text>
              <text class="item-balance" :class="{ warning: item.balance <= 10 }">
                余额: ¥{{ item.balance.toFixed(2) }}
              </text>
            </view>
          </view>
          <view class="item-right">
            <button class="recharge-btn" @click="goToRechargeWithId(item.id)">充值</button>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <text class="empty-icon">📱</text>
        <text class="empty-text">暂无号码，请先添加</text>
        <button class="btn btn-outline mt-base" @click="goToAddNumber">添加号码</button>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">最近充值</text>
        <text class="section-more" @click="goToRecords">查看全部</text>
      </view>

      <view v-if="recentRecords.length > 0" class="records-list">
        <view 
          v-for="record in recentRecords" 
          :key="record.id" 
          class="record-item"
        >
          <view class="record-left">
            <text class="record-icon">{{ record.method === 'wechat' ? '💚' : '💙' }}</text>
            <view class="record-info">
              <text class="record-phone">{{ record.phone }}</text>
              <text class="record-time">{{ record.createdAt }}</text>
            </view>
          </view>
          <view class="record-right">
            <text class="record-amount">¥{{ record.amount }}</text>
            <text class="record-status" :class="getStatusClass(record.status)">
              {{ record.statusName }}
            </text>
          </view>
        </view>
      </view>
      <view v-else class="empty-record">
        <text>暂无充值记录</text>
      </view>
    </view>

    <view class="tips-card">
      <text class="tips-title">💡 充值小贴士</text>
      <view class="tips-list">
        <text class="tip-item">• 支持微信、支付宝两种支付方式</text>
        <text class="tip-item">• 充值金额≥10元</text>
        <text class="tip-item">• 充值成功后实时到账</text>
        <text class="tip-item">• 充值失败可在记录页面重试</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useNumbersStore } from '@/stores/numbers'
import { usePaymentStore } from '@/stores/payment'
import { operatorMap } from '@/data/mock'

const numbersStore = useNumbersStore()
const paymentStore = usePaymentStore()

const recentRecords = computed(() => paymentStore.sortedByTime.slice(0, 5))

const getOperatorColor = (operator: string) => operatorMap[operator]?.color || '#999999'
const getOperatorIcon = (operator: string) => operatorMap[operator]?.icon || '📱'

const getStatusClass = (status: string) => {
  switch (status) {
    case 'success': return 'success'
    case 'failed': return 'error'
    default: return 'pending'
  }
}

const goToRecharge = () => {
  uni.navigateTo({ url: '/pages/payment/recharge' })
}

const goToRechargeWithId = (id: string) => {
  uni.navigateTo({ url: `/pages/payment/recharge?id=${id}` })
}

const goToRecords = () => {
  uni.navigateTo({ url: '/pages/payment/records' })
}

const goToAddNumber = () => {
  uni.navigateTo({ url: '/pages/numbers/add' })
}

onMounted(() => {
  numbersStore.fetchNumbers()
  paymentStore.fetchRecords()
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 120rpx;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-base;
  padding: $spacing-lg;

  .action-card {
    background: $bg-white;
    border-radius: $radius-lg;
    padding: $spacing-xl;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: $shadow-sm;

    .action-icon {
      font-size: 56rpx;
      margin-bottom: $spacing-sm;
    }

    .action-text {
      font-size: $font-size-base;
      color: $text-primary;
      font-weight: 500;
    }
  }
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
      color: $primary-color;
    }
  }
}

.numbers-list {
  background: $bg-white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;

  .number-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-base;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .item-left {
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

      .item-info {
        display: flex;
        flex-direction: column;

        .item-phone {
          font-size: $font-size-base;
          font-weight: 500;
          color: $text-primary;
        }

        .item-balance {
          font-size: $font-size-sm;
          color: $success-color;

          &.warning {
            color: $warning-color;
          }
        }
      }
    }

    .item-right {
      .recharge-btn {
        background: rgba($primary-color, 0.1);
        color: $primary-color;
        border: none;
        border-radius: $radius-base;
        padding: 12rpx 24rpx;
        font-size: $font-size-sm;
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

.records-list {
  background: $bg-white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;

  .record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-base;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .record-left {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .record-icon {
        font-size: 36rpx;
      }

      .record-info {
        display: flex;
        flex-direction: column;

        .record-phone {
          font-size: $font-size-base;
          color: $text-primary;
        }

        .record-time {
          font-size: $font-size-xs;
          color: $text-hint;
        }
      }
    }

    .record-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .record-amount {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $text-primary;
      }

      .record-status {
        font-size: $font-size-xs;
        padding: 4rpx 12rpx;
        border-radius: $radius-sm;
        margin-top: 4rpx;

        &.success {
          background: rgba($success-color, 0.1);
          color: $success-color;
        }

        &.failed {
          background: rgba($error-color, 0.1);
          color: $error-color;
        }

        &.pending {
          background: rgba($warning-color, 0.1);
          color: $warning-color;
        }
      }
    }
  }
}

.empty-record {
  background: $bg-white;
  border-radius: $radius-lg;
  padding: $spacing-xl * 2;
  text-align: center;
  font-size: $font-size-base;
  color: $text-hint;
  box-shadow: $shadow-sm;
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