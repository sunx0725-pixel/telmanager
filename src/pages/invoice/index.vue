<template>
  <view class="page">
    <view class="header-actions">
      <button class="sync-btn" @click="syncInvoices">
        <text>🔄 同步发票</text>
      </button>
    </view>

    <view class="tabs">
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        <text>全部</text>
        <text class="tab-count">{{ invoiceStore.invoices.length }}</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'unissued' }"
        @click="activeTab = 'unissued'"
      >
        <text>未开具</text>
        <text class="tab-count warning">{{ invoiceStore.unissuedInvoices.length }}</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'issued' }"
        @click="activeTab = 'issued'"
      >
        <text>已开具</text>
        <text class="tab-count success">{{ invoiceStore.issuedInvoices.length }}</text>
      </view>
    </view>

    <view v-if="filteredInvoices.length > 0" class="invoice-list">
      <view 
        v-for="invoice in filteredInvoices" 
        :key="invoice.id" 
        class="invoice-card"
      >
        <view class="invoice-header">
          <view class="invoice-left">
            <text class="invoice-icon">{{ invoice.type === 'monthly' ? '📅' : '💳' }}</text>
            <view class="invoice-info">
              <text class="invoice-phone">{{ invoice.phone }}</text>
              <text class="invoice-type">{{ invoice.typeName }}</text>
            </view>
          </view>
          <text class="invoice-status" :class="getStatusClass(invoice.status)">
            {{ invoice.statusName }}
          </text>
        </view>

        <view class="invoice-body">
          <view class="invoice-detail">
            <text class="detail-label">账单月份</text>
            <text class="detail-value">{{ invoice.billMonth }}</text>
          </view>
          <view class="invoice-detail">
            <text class="detail-label">金额</text>
            <text class="detail-value amount">¥{{ invoice.amount.toFixed(2) }}</text>
          </view>
        </view>

        <view class="invoice-footer">
          <text class="invoice-time">{{ invoice.createdAt }}</text>
          <view class="invoice-actions">
            <view 
              v-if="invoice.status === 'unissued'" 
              class="action-btn primary"
              @click="goToCreate(invoice.id)"
            >
              <text>开具发票</text>
            </view>
            <view 
              v-else 
              class="action-btn"
              @click="goToDetail(invoice.id)"
            >
              <text>查看详情</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty-state">
      <text class="empty-icon">📄</text>
      <text class="empty-text">暂无发票数据</text>
      <button class="btn btn-outline mt-base" @click="syncInvoices">同步发票</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInvoiceStore } from '@/stores/invoice'

const invoiceStore = useInvoiceStore()

const activeTab = ref<'all' | 'unissued' | 'issued'>('all')

onMounted(() => {
  invoiceStore.fetchInvoices()
})

const filteredInvoices = computed(() => {
  const invoices = invoiceStore.sortedByTime
  switch (activeTab.value) {
    case 'unissued':
      return invoices.filter(i => i.status === 'unissued')
    case 'issued':
      return invoices.filter(i => i.status === 'issued')
    default:
      return invoices
  }
})

const getStatusClass = (status: string) => {
  return status === 'issued' ? 'success' : 'warning'
}

const syncInvoices = () => {
  invoiceStore.syncInvoices()
}

const goToCreate = (id: string) => {
  uni.navigateTo({ url: `/pages/invoice/create?id=${id}` })
}

const goToDetail = (id: string) => {
  uni.navigateTo({ url: `/pages/invoice/detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 120rpx;
}

.header-actions {
  padding: $spacing-lg;

  .sync-btn {
    width: 100%;
    height: 80rpx;
    background: $bg-white;
    color: $primary-color;
    border: none;
    border-radius: $radius-lg;
    font-size: $font-size-base;
    box-shadow: $shadow-sm;
  }
}

.tabs {
  display: flex;
  background: $bg-white;
  padding: 0 $spacing-lg;
  gap: $spacing-sm;
  box-shadow: $shadow-sm;
  position: sticky;
  top: 0;
  z-index: 10;

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    padding: $spacing-base 0;
    font-size: $font-size-base;
    color: $text-secondary;
    border-bottom: 4rpx solid transparent;

    &.active {
      color: $primary-color;
      border-bottom-color: $primary-color;
    }

    .tab-count {
      min-width: 32rpx;
      height: 32rpx;
      padding: 0 8rpx;
      background: $bg-color;
      border-radius: 16rpx;
      font-size: $font-size-xs;
      display: flex;
      align-items: center;
      justify-content: center;

      &.warning {
        background: rgba($warning-color, 0.1);
        color: $warning-color;
      }

      &.success {
        background: rgba($success-color, 0.1);
        color: $success-color;
      }
    }
  }
}

.invoice-list {
  padding: $spacing-base $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}

.invoice-card {
  background: $bg-white;
  border-radius: $radius-lg;
  padding: $spacing-base;
  box-shadow: $shadow-sm;

  .invoice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;

    .invoice-left {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .invoice-icon {
        font-size: 40rpx;
      }

      .invoice-info {
        display: flex;
        flex-direction: column;

        .invoice-phone {
          font-size: $font-size-base;
          font-weight: 500;
          color: $text-primary;
        }

        .invoice-type {
          font-size: $font-size-xs;
          color: $text-hint;
        }
      }
    }

    .invoice-status {
      font-size: $font-size-sm;
      padding: 8rpx 16rpx;
      border-radius: $radius-sm;

      &.success {
        background: rgba($success-color, 0.1);
        color: $success-color;
      }

      &.warning {
        background: rgba($warning-color, 0.1);
        color: $warning-color;
      }
    }
  }

  .invoice-body {
    background: $bg-color;
    border-radius: $radius-base;
    padding: $spacing-sm $spacing-base;
    margin-bottom: $spacing-sm;

    .invoice-detail {
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

        &.amount {
          font-weight: 600;
          font-size: $font-size-base;
        }
      }
    }
  }

  .invoice-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .invoice-time {
      font-size: $font-size-xs;
      color: $text-hint;
    }

    .invoice-actions {
      .action-btn {
        padding: 12rpx 24rpx;
        border-radius: $radius-base;
        font-size: $font-size-sm;
        background: rgba($primary-color, 0.1);
        color: $primary-color;

        &.primary {
          background: $primary-color;
          color: #FFFFFF;
        }
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