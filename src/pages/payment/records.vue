<template>
  <view class="page">
    <view class="filter-bar">
      <view class="filter-item" :class="{ active: filterStatus === '' }" @click="filterStatus = ''">
        <text>全部</text>
      </view>
      <view class="filter-item" :class="{ active: filterStatus === 'success' }" @click="filterStatus = 'success'">
        <text>成功</text>
      </view>
      <view class="filter-item" :class="{ active: filterStatus === 'failed' }" @click="filterStatus = 'failed'">
        <text>失败</text>
      </view>
      <view class="filter-item" :class="{ active: filterStatus === 'pending' }" @click="filterStatus = 'pending'">
        <text>待支付</text>
      </view>
    </view>

    <view v-if="filteredRecords.length > 0" class="records-list">
      <view 
        v-for="record in filteredRecords" 
        :key="record.id" 
        class="record-card"
      >
        <view class="record-header">
          <view class="record-left">
            <text class="record-icon">{{ record.method === 'wechat' ? '💚' : '💙' }}</text>
            <view class="record-info">
              <text class="record-phone">{{ record.phone }}</text>
              <text class="record-method">{{ record.methodName }}</text>
            </view>
          </view>
          <text class="record-status" :class="getStatusClass(record.status)">
            {{ record.statusName }}
          </text>
        </view>

        <view class="record-body">
          <view class="record-detail">
            <text class="detail-label">订单号</text>
            <text class="detail-value">{{ record.orderNo }}</text>
          </view>
          <view class="record-detail">
            <text class="detail-label">时间</text>
            <text class="detail-value">{{ record.createdAt }}</text>
          </view>
        </view>

        <view class="record-footer">
          <text class="record-amount">¥{{ record.amount }}</text>
          <view v-if="record.status === 'failed'" class="record-actions">
            <view class="action-btn" @click="retryRecharge(record.id)">
              <text>重试</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty-state">
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无充值记录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePaymentStore } from '@/stores/payment'

const paymentStore = usePaymentStore()

const filterStatus = ref('')

const filteredRecords = computed(() => {
  const records = paymentStore.sortedByTime
  if (!filterStatus.value) return records
  return records.filter(r => r.status === filterStatus.value)
})

const getStatusClass = (status: string) => {
  switch (status) {
    case 'success': return 'success'
    case 'failed': return 'error'
    default: return 'pending'
  }
}

const retryRecharge = (id: string) => {
  uni.showModal({
    title: '重试充值',
    content: '确定要重试此笔充值吗？',
    success: (res) => {
      if (res.confirm) {
        paymentStore.retryRecharge(id)
        uni.showToast({ title: '已提交重试请求', icon: 'success' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 120rpx;
}

.filter-bar {
  display: flex;
  background: $bg-white;
  padding: $spacing-sm $spacing-lg;
  gap: $spacing-sm;
  box-shadow: $shadow-sm;

  .filter-item {
    flex: 1;
    text-align: center;
    padding: $spacing-sm 0;
    font-size: $font-size-base;
    color: $text-secondary;
    border-radius: $radius-sm;

    &.active {
      background: rgba($primary-color, 0.1);
      color: $primary-color;
    }
  }
}

.records-list {
  padding: $spacing-base $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}

.record-card {
  background: $bg-white;
  border-radius: $radius-lg;
  padding: $spacing-base;
  box-shadow: $shadow-sm;

  .record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;

    .record-left {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .record-icon {
        font-size: 40rpx;
      }

      .record-info {
        display: flex;
        flex-direction: column;

        .record-phone {
          font-size: $font-size-base;
          font-weight: 500;
          color: $text-primary;
        }

        .record-method {
          font-size: $font-size-xs;
          color: $text-hint;
        }
      }
    }

    .record-status {
      font-size: $font-size-sm;
      padding: 8rpx 16rpx;
      border-radius: $radius-sm;

      &.success {
        background: rgba($success-color, 0.1);
        color: $success-color;
      }

      &.error {
        background: rgba($error-color, 0.1);
        color: $error-color;
      }

      &.pending {
        background: rgba($warning-color, 0.1);
        color: $warning-color;
      }
    }
  }

  .record-body {
    background: $bg-color;
    border-radius: $radius-base;
    padding: $spacing-sm $spacing-base;
    margin-bottom: $spacing-sm;

    .record-detail {
      display: flex;
      justify-content: space-between;
      padding: 8rpx 0;

      .detail-label {
        font-size: $font-size-sm;
        color: $text-secondary;
      }

      .detail-value {
        font-size: $font-size-sm;
        color: $text-primary;
      }
    }
  }

  .record-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .record-amount {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-primary;
    }

    .record-actions {
      .action-btn {
        background: rgba($primary-color, 0.1);
        color: $primary-color;
        padding: 12rpx 24rpx;
        border-radius: $radius-base;
        font-size: $font-size-sm;
      }
    }
  }
}

.empty-state {
  padding: $spacing-xl * 3;
  text-align: center;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: $spacing-lg;
  }

  .empty-text {
    font-size: $font-size-lg;
    color: $text-hint;
  }
}
</style>