<template>
  <view class="page">
    <view v-if="number" class="header-card">
      <view class="header-top">
        <view class="operator-info" :style="{ background: getOperatorColor(number.operator) + '20' }">
          <text class="operator-icon" :style="{ color: getOperatorColor(number.operator) }">
            {{ getOperatorIcon(number.operator) }}
          </text>
          <text class="operator-name">{{ number.operatorName }}</text>
        </view>
        <view v-if="number.isFrozen" class="frozen-badge">已冻结</view>
      </view>
      <text class="phone-number">{{ number.maskedPhone }}</text>
      <text v-if="number.remark" class="phone-remark">{{ number.remark }}</text>
    </view>

    <view class="balance-card">
      <view class="balance-header">
        <text class="balance-label">当前余额</text>
        <button class="recharge-btn" @click="goToRecharge">立即充值</button>
      </view>
      <text class="balance-amount" :class="{ warning: number?.balance <= 10 }">
        ¥{{ number?.balance.toFixed(2) }}
      </text>
    </view>

    <view class="info-grid">
      <view class="info-item">
        <text class="info-icon">📊</text>
        <text class="info-value">{{ number?.dataRemaining }}GB</text>
        <text class="info-label">剩余流量</text>
      </view>
      <view class="info-item">
        <text class="info-icon">📞</text>
        <text class="info-value">{{ number?.callMinutes }}分钟</text>
        <text class="info-label">剩余通话</text>
      </view>
      <view class="info-item">
        <text class="info-icon">📅</text>
        <text class="info-value">{{ formatDate(number?.packageExpireDate || '') }}</text>
        <text class="info-label">套餐到期</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">近3个月账单</text>
        <text class="section-more">查看全部</text>
      </view>
      
      <view v-if="bills.length > 0" class="bill-list">
        <view 
          v-for="bill in groupedBills" 
          :key="bill.month" 
          class="bill-group"
        >
          <text class="bill-month">{{ bill.month }}</text>
          <view class="bill-items">
            <view 
              v-for="item in bill.items" 
              :key="item.id" 
              class="bill-item"
            >
              <text class="bill-type">{{ item.typeName }}</text>
              <text class="bill-detail">{{ item.detail }}</text>
              <text class="bill-amount">¥{{ item.amount.toFixed(2) }}</text>
            </view>
          </view>
          <view class="bill-total">
            <text class="total-label">合计</text>
            <text class="total-amount">¥{{ bill.total.toFixed(2) }}</text>
          </view>
        </view>
      </view>
      <view v-else class="empty-bill">
        <text>暂无账单数据</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">当前套餐</text>
      </view>
      <view class="package-card">
        <view class="package-name">5G畅享套餐128元</view>
        <view class="package-detail">
          <view class="package-item">
            <text class="package-icon">📊</text>
            <text class="package-text">国内流量30GB</text>
          </view>
          <view class="package-item">
            <text class="package-icon">📞</text>
            <text class="package-text">国内通话500分钟</text>
          </view>
          <view class="package-item">
            <text class="package-icon">💬</text>
            <text class="package-text">短信100条</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">充值记录</text>
        <text class="section-more" @click="goToRecords">查看全部</text>
      </view>
      
      <view v-if="recentRecharges.length > 0" class="recharge-list">
        <view 
          v-for="record in recentRecharges" 
          :key="record.id" 
          class="recharge-item"
        >
          <view class="recharge-left">
            <text class="recharge-icon">{{ record.method === 'wechat' ? '💚' : '💙' }}</text>
            <view class="recharge-info">
              <text class="recharge-amount">¥{{ record.amount }}</text>
              <text class="recharge-time">{{ record.createdAt }}</text>
            </view>
          </view>
          <text class="recharge-status" :class="getStatusClass(record.status)">
            {{ record.statusName }}
          </text>
        </view>
      </view>
      <view v-else class="empty-recharge">
        <text>暂无充值记录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useNumbersStore } from '@/stores/numbers'
import { usePaymentStore } from '@/stores/payment'
import { operatorMap } from '@/data/mock'
import type { BillItem, RechargeRecord } from '@/types'

const numbersStore = useNumbersStore()
const paymentStore = usePaymentStore()

const numberId = ref('')
const number = computed(() => numbersStore.getNumberById(numberId.value))
const bills = computed(() => numbersStore.getBillsByPhoneId(numberId.value))
const recentRecharges = computed(() => 
  paymentStore.filterByPhone(numberId.value).slice(0, 5)
)

const groupedBills = computed(() => {
  const groups: Record<string, { month: string; items: BillItem[]; total: number }> = {}
  
  bills.value.forEach(bill => {
    if (!groups[bill.month]) {
      groups[bill.month] = { month: bill.month, items: [], total: 0 }
    }
    groups[bill.month].items.push(bill)
    groups[bill.month].total += bill.amount
  })
  
  return Object.values(groups).sort((a, b) => b.month.localeCompare(a.month))
})

onLoad((options) => {
  if (options?.id) {
    numberId.value = options.id
  }
})

const getOperatorColor = (operator: string) => operatorMap[operator]?.color || '#999999'
const getOperatorIcon = (operator: string) => operatorMap[operator]?.icon || '📱'

const formatDate = (date: string) => {
  const d = new Date(date)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'success': return 'success'
    case 'failed': return 'error'
    default: return 'pending'
  }
}

const goToRecharge = () => {
  uni.navigateTo({ url: `/pages/payment/recharge?id=${numberId.value}` })
}

const goToRecords = () => {
  uni.navigateTo({ url: '/pages/payment/records' })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 120rpx;
}

.header-card {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  align-items: center;

  .header-top {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    margin-bottom: $spacing-base;

    .operator-info {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 8rpx 16rpx;
      border-radius: $radius-lg;

      .operator-icon {
        font-size: 28rpx;
      }

      .operator-name {
        font-size: $font-size-sm;
        color: #FFFFFF;
      }
    }

    .frozen-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 8rpx 16rpx;
      border-radius: $radius-sm;
      font-size: $font-size-xs;
      color: #FFFFFF;
    }
  }

  .phone-number {
    font-size: 44rpx;
    font-weight: 600;
    color: #FFFFFF;
    margin-bottom: $spacing-xs;
  }

  .phone-remark {
    font-size: $font-size-sm;
    color: rgba(255, 255, 255, 0.8);
  }
}

.balance-card {
  margin: -40rpx $spacing-lg $spacing-base;
  background: $bg-white;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-base;

  .balance-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;

    .balance-label {
      font-size: $font-size-base;
      color: $text-secondary;
    }

    .recharge-btn {
      background: rgba($primary-color, 0.1);
      color: $primary-color;
      border: none;
      border-radius: $radius-base;
      padding: 12rpx 24rpx;
      font-size: $font-size-sm;
    }
  }

  .balance-amount {
    font-size: 56rpx;
    font-weight: 600;
    color: $success-color;

    &.warning {
      color: $warning-color;
    }
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-sm;
  padding: 0 $spacing-lg;
  margin-bottom: $spacing-base;

  .info-item {
    background: $bg-white;
    border-radius: $radius-lg;
    padding: $spacing-base;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: $shadow-sm;

    .info-icon {
      font-size: 40rpx;
      margin-bottom: $spacing-xs;
    }

    .info-value {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 4rpx;
    }

    .info-label {
      font-size: $font-size-xs;
      color: $text-hint;
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

.bill-list {
  background: $bg-white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;

  .bill-group {
    padding: $spacing-base;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .bill-month {
      font-size: $font-size-base;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: $spacing-sm;
      display: block;
    }

    .bill-items {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;

      .bill-item {
        display: flex;
        align-items: center;
        gap: $spacing-sm;

        .bill-type {
          width: 120rpx;
          font-size: $font-size-sm;
          color: $text-secondary;
        }

        .bill-detail {
          flex: 1;
          font-size: $font-size-sm;
          color: $text-primary;
        }

        .bill-amount {
          font-size: $font-size-sm;
          color: $text-primary;
          font-weight: 500;
        }
      }
    }

    .bill-total {
      display: flex;
      justify-content: space-between;
      margin-top: $spacing-sm;
      padding-top: $spacing-sm;
      border-top: 1rpx dashed $border-color;

      .total-label {
        font-size: $font-size-base;
        font-weight: 600;
        color: $text-primary;
      }

      .total-amount {
        font-size: $font-size-base;
        font-weight: 600;
        color: $primary-color;
      }
    }
  }
}

.empty-bill, .empty-recharge {
  background: $bg-white;
  border-radius: $radius-lg;
  padding: $spacing-xl * 2;
  text-align: center;
  font-size: $font-size-base;
  color: $text-hint;
  box-shadow: $shadow-sm;
}

.package-card {
  background: $bg-white;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-sm;

  .package-name {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-base;
  }

  .package-detail {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;

    .package-item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .package-icon {
        font-size: 28rpx;
      }

      .package-text {
        font-size: $font-size-base;
        color: $text-secondary;
      }
    }
  }
}

.recharge-list {
  background: $bg-white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;

  .recharge-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-base;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .recharge-left {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .recharge-icon {
        font-size: 36rpx;
      }

      .recharge-info {
        display: flex;
        flex-direction: column;

        .recharge-amount {
          font-size: $font-size-base;
          font-weight: 600;
          color: $text-primary;
        }

        .recharge-time {
          font-size: $font-size-xs;
          color: $text-hint;
        }
      }
    }

    .recharge-status {
      font-size: $font-size-sm;
      padding: 8rpx 16rpx;
      border-radius: $radius-sm;

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
</style>