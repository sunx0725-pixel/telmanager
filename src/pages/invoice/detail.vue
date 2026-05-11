<template>
  <view class="page">
    <view v-if="invoice" class="invoice-card">
      <view class="invoice-header">
        <view class="invoice-icon-wrap">
          <text class="invoice-icon">📄</text>
        </view>
        <text class="invoice-title">电子发票</text>
        <text class="invoice-status" :class="getStatusClass(invoice.status)">
          {{ invoice.statusName }}
        </text>
      </view>

      <view class="invoice-info">
        <view class="info-row">
          <text class="info-label">发票号码</text>
          <text class="info-value">{{ invoice.invoiceNo || '-' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">发票类型</text>
          <text class="info-value">{{ invoice.typeName }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">手机号码</text>
          <text class="info-value">{{ invoice.phone }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">账单月份</text>
          <text class="info-value">{{ invoice.billMonth }}</text>
        </view>
        <view class="info-row amount-row">
          <text class="info-label">发票金额</text>
          <text class="info-value amount">¥{{ invoice.amount.toFixed(2) }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">开具时间</text>
          <text class="info-value">{{ invoice.createdAt }}</text>
        </view>
      </view>

      <view v-if="invoice.status === 'issued'" class="invoice-actions">
        <button class="action-btn" @click="downloadInvoice">
          <text class="btn-icon">📥</text>
          <text>下载PDF</text>
        </button>
        <button class="action-btn secondary" @click="shareInvoice">
          <text class="btn-icon">📤</text>
          <text>转发</text>
        </button>
      </view>

      <view v-else class="no-actions">
        <text class="no-action-text">发票尚未开具</text>
        <button class="btn btn-primary mt-base" @click="goToCreate">开具发票</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useInvoiceStore } from '@/stores/invoice'
import type { Invoice } from '@/types'

const invoiceStore = useInvoiceStore()

const invoiceId = ref('')
const invoice = computed(() => invoiceStore.getInvoiceById(invoiceId.value))

onLoad((options) => {
  if (options?.id) {
    invoiceId.value = options.id
  }
})

const getStatusClass = (status: string) => {
  return status === 'issued' ? 'success' : 'warning'
}

const downloadInvoice = () => {
  uni.showLoading({ title: '下载中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '下载成功', icon: 'success' })
  }, 1500)
}

const shareInvoice = () => {
  uni.showActionSheet({
    itemList: ['发送给朋友', '发送到邮箱', '保存到相册'],
    success: (res) => {
      const actions = ['发送给朋友', '发送到邮箱', '保存到相册']
      uni.showToast({ title: `已选择${actions[res.tapIndex]}`, icon: 'none' })
    }
  })
}

const goToCreate = () => {
  uni.navigateTo({ url: `/pages/invoice/create?id=${invoiceId.value}` })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding: $spacing-lg;
}

.invoice-card {
  background: $bg-white;
  border-radius: $radius-xl;
  padding: $spacing-xl;
  box-shadow: $shadow-sm;

  .invoice-header {
    text-align: center;
    margin-bottom: $spacing-xl;

    .invoice-icon-wrap {
      width: 120rpx;
      height: 120rpx;
      background: rgba($primary-color, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto $spacing-base;

      .invoice-icon {
        font-size: 60rpx;
      }
    }

    .invoice-title {
      display: block;
      font-size: $font-size-xl;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: $spacing-sm;
    }

    .invoice-status {
      padding: 8rpx 24rpx;
      border-radius: $radius-lg;
      font-size: $font-size-sm;

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

  .invoice-info {
    background: $bg-color;
    border-radius: $radius-lg;
    padding: $spacing-lg;
    margin-bottom: $spacing-lg;

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: $spacing-sm 0;

      &:not(:last-child) {
        border-bottom: 1rpx solid $border-color;
      }

      &.amount-row {
        padding-top: $spacing-base;
      }

      .info-label {
        font-size: $font-size-base;
        color: $text-secondary;
      }

      .info-value {
        font-size: $font-size-base;
        color: $text-primary;
        font-weight: 500;

        &.amount {
          font-size: $font-size-xl;
          color: $primary-color;
        }
      }
    }
  }

  .invoice-actions {
    display: flex;
    gap: $spacing-base;

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-sm;
      height: 88rpx;
      background: $primary-color;
      color: #FFFFFF;
      border: none;
      border-radius: $radius-base;
      font-size: $font-size-base;

      .btn-icon {
        font-size: 32rpx;
      }

      &.secondary {
        background: $bg-color;
        color: $text-primary;
      }
    }
  }

  .no-actions {
    text-align: center;

    .no-action-text {
      font-size: $font-size-base;
      color: $text-hint;
    }
  }
}
</style>