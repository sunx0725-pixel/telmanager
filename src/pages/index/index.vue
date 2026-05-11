<template>
  <view class="page">
    <view class="header">
      <view class="user-info">
        <view class="avatar">👤</view>
        <view class="user-text">
          <text class="username">{{ userStore.user?.name || '用户' }}</text>
          <text class="user-phone">{{ userStore.user?.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}</text>
        </view>
      </view>
      <view class="header-actions">
        <view class="action-btn" @click="goToNotifications">
          <text class="action-icon">🔔</text>
          <view v-if="securityStore.unreadCount > 0" class="badge">{{ securityStore.unreadCount }}</view>
        </view>
      </view>
    </view>

    <view v-if="hasLowBalance || hasExpiring" class="warning-section">
      <view v-if="hasLowBalance" class="warning-card" @click="goToPayment">
        <text class="warning-icon">⚠️</text>
        <view class="warning-content">
          <text class="warning-title">余额不足提醒</text>
          <text class="warning-desc">{{ lowBalanceNumbers.length }}个号码余额≤10元</text>
        </view>
        <text class="warning-arrow">›</text>
      </view>
      <view v-if="hasExpiring" class="warning-card" @click="goToNumbers">
        <text class="warning-icon">📅</text>
        <view class="warning-content">
          <text class="warning-title">套餐到期提醒</text>
          <text class="warning-desc">{{ expiringNumbers.length }}个号码套餐≤3天到期</text>
        </view>
        <text class="warning-arrow">›</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">常用号码</text>
        <text v-if="favoriteNumbers.length > 0" class="section-more" @click="goToNumbers">查看全部</text>
      </view>
      
      <view v-if="favoriteNumbers.length > 0" class="numbers-grid">
        <view 
          v-for="item in favoriteNumbers" 
          :key="item.id" 
          class="number-card"
          @click="goToDetail(item.id)"
        >
          <view class="card-header">
            <text class="operator-icon" :style="{ color: getOperatorColor(item.operator) }">
              {{ getOperatorIcon(item.operator) }}
            </text>
            <text class="phone-text">{{ item.maskedPhone }}</text>
          </view>
          <view class="card-body">
            <view class="balance-info">
              <text class="balance-label">余额</text>
              <text class="balance-value" :class="{ warning: item.balance <= 10 }">
                ¥{{ item.balance.toFixed(2) }}
              </text>
            </view>
            <view class="usage-info">
              <view class="usage-item">
                <text class="usage-icon">📊</text>
                <text class="usage-text">{{ item.dataRemaining }}GB</text>
              </view>
              <view class="usage-item">
                <text class="usage-icon">📞</text>
                <text class="usage-text">{{ item.callMinutes }}分钟</text>
              </view>
            </view>
          </view>
          <view class="card-footer">
            <text class="package-expire">套餐到期: {{ formatDate(item.packageExpireDate) }}</text>
          </view>
          <view class="quick-actions">
            <view class="quick-btn" @click.stop="goToRecharge(item.id)">
              <text>充值</text>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="empty-state">
        <text class="empty-icon">📱</text>
        <text class="empty-text">暂无常用号码</text>
        <button class="btn btn-outline mt-base" @click="goToNumbers">添加号码</button>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">全部号码</text>
        <view class="sort-selector">
          <text 
            class="sort-option" 
            :class="{ active: sortBy === 'operator' }"
            @click="sortBy = 'operator'"
          >运营商</text>
          <text 
            class="sort-option" 
            :class="{ active: sortBy === 'balance' }"
            @click="sortBy = 'balance'"
          >余额</text>
        </view>
      </view>
      
      <view class="number-list">
        <view 
          v-for="item in sortedNumbers" 
          :key="item.id" 
          class="number-item"
          @click="goToDetail(item.id)"
        >
          <view class="item-left">
            <view class="operator-badge" :style="{ background: getOperatorColor(item.operator) + '20', color: getOperatorColor(item.operator) }">
              {{ getOperatorIcon(item.operator) }} {{ getOperatorName(item.operator) }}
            </view>
            <view class="item-info">
              <text class="item-phone">{{ item.maskedPhone }}</text>
              <text v-if="item.remark" class="item-remark">{{ item.remark }}</text>
            </view>
          </view>
          <view class="item-right">
            <text class="item-balance" :class="{ warning: item.balance <= 10 }">
              ¥{{ item.balance.toFixed(2) }}
            </text>
            <text class="item-arrow">›</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNumbersStore } from '@/stores/numbers'
import { useSecurityStore } from '@/stores/security'
import { operatorMap } from '@/data/mock'

const userStore = useUserStore()
const numbersStore = useNumbersStore()
const securityStore = useSecurityStore()

const sortBy = ref<'operator' | 'balance'>('operator')

onMounted(() => {
  userStore.checkLogin()
  if (!userStore.isLoggedIn) {
    uni.redirectTo({ url: '/pages/login/index' })
  }
})

const favoriteNumbers = computed(() => numbersStore.favoriteNumbers)
const sortedNumbers = computed(() => 
  sortBy.value === 'operator' ? numbersStore.sortedByOperator : numbersStore.sortedByBalance
)
const lowBalanceNumbers = computed(() => numbersStore.lowBalanceNumbers)
const expiringNumbers = computed(() => numbersStore.expiringNumbers)
const hasLowBalance = computed(() => lowBalanceNumbers.value.length > 0)
const hasExpiring = computed(() => expiringNumbers.value.length > 0)

const getOperatorColor = (operator: string) => operatorMap[operator]?.color || '#999999'
const getOperatorIcon = (operator: string) => operatorMap[operator]?.icon || '📱'
const getOperatorName = (operator: string) => operatorMap[operator]?.name || '未知'

const formatDate = (date: string) => {
  const d = new Date(date)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

const goToDetail = (id: string) => {
  uni.navigateTo({ url: `/pages/numbers/detail?id=${id}` })
}

const goToRecharge = (id: string) => {
  uni.navigateTo({ url: `/pages/payment/recharge?id=${id}` })
}

const goToNumbers = () => {
  uni.switchTab({ url: '/pages/numbers/index' })
}

const goToPayment = () => {
  uni.switchTab({ url: '/pages/payment/index' })
}

const goToNotifications = () => {
  uni.showToast({ title: '通知列表开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 120rpx;
}

.header {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  padding: $spacing-xl $spacing-lg;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .user-info {
    display: flex;
    align-items: center;
    gap: $spacing-base;

    .avatar {
      width: 80rpx;
      height: 80rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
    }

    .user-text {
      display: flex;
      flex-direction: column;

      .username {
        font-size: $font-size-lg;
        font-weight: 600;
        color: #FFFFFF;
      }

      .user-phone {
        font-size: $font-size-sm;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .header-actions {
    position: relative;

    .action-btn {
      width: 72rpx;
      height: 72rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36rpx;
    }

    .badge {
      position: absolute;
      top: -8rpx;
      right: -8rpx;
      min-width: 32rpx;
      height: 32rpx;
      background: $error-color;
      border-radius: 16rpx;
      font-size: 20rpx;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8rpx;
    }
  }
}

.warning-section {
  padding: $spacing-base $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  .warning-card {
    background: $bg-white;
    border-radius: $radius-lg;
    padding: $spacing-base;
    display: flex;
    align-items: center;
    gap: $spacing-base;
    box-shadow: $shadow-sm;

    .warning-icon {
      font-size: 40rpx;
    }

    .warning-content {
      flex: 1;

      .warning-title {
        display: block;
        font-size: $font-size-base;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: 4rpx;
      }

      .warning-desc {
        font-size: $font-size-sm;
        color: $text-secondary;
      }
    }

    .warning-arrow {
      font-size: $font-size-xl;
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

    .sort-selector {
      display: flex;
      gap: $spacing-base;

      .sort-option {
        font-size: $font-size-sm;
        color: $text-secondary;
        padding: 8rpx 16rpx;
        border-radius: $radius-sm;

        &.active {
          background: rgba($primary-color, 0.1);
          color: $primary-color;
        }
      }
    }
  }
}

.numbers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-base;

  .number-card {
    background: $bg-white;
    border-radius: $radius-lg;
    padding: $spacing-base;
    box-shadow: $shadow-sm;

    .card-header {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-sm;

      .operator-icon {
        font-size: 32rpx;
      }

      .phone-text {
        font-size: $font-size-base;
        font-weight: 600;
        color: $text-primary;
      }
    }

    .card-body {
      margin-bottom: $spacing-sm;

      .balance-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: $spacing-xs;

        .balance-label {
          font-size: $font-size-sm;
          color: $text-secondary;
        }

        .balance-value {
          font-size: $font-size-lg;
          font-weight: 600;
          color: $success-color;

          &.warning {
            color: $warning-color;
          }
        }
      }

      .usage-info {
        display: flex;
        gap: $spacing-lg;

        .usage-item {
          display: flex;
          align-items: center;
          gap: 8rpx;

          .usage-icon {
            font-size: 24rpx;
          }

          .usage-text {
            font-size: $font-size-sm;
            color: $text-secondary;
          }
        }
      }
    }

    .card-footer {
      .package-expire {
        font-size: $font-size-xs;
        color: $text-hint;
      }
    }

    .quick-actions {
      margin-top: $spacing-sm;

      .quick-btn {
        background: rgba($primary-color, 0.1);
        color: $primary-color;
        text-align: center;
        padding: 12rpx;
        border-radius: $radius-sm;
        font-size: $font-size-sm;
      }
    }
  }
}

.number-list {
  background: $bg-white;
  border-radius: $radius-lg;
  overflow: hidden;

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

        .item-remark {
          font-size: $font-size-xs;
          color: $text-hint;
        }
      }
    }

    .item-right {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .item-balance {
        font-size: $font-size-base;
        font-weight: 600;
        color: $success-color;

        &.warning {
          color: $warning-color;
        }
      }

      .item-arrow {
        font-size: $font-size-xl;
        color: $text-hint;
      }
    }
  }
}

.empty-state {
  padding: $spacing-xl * 2;
  text-align: center;

  .empty-icon {
    font-size: 80rpx;
    margin-bottom: $spacing-base;
  }

  .empty-text {
    font-size: $font-size-base;
    color: $text-hint;
  }
}
</style>