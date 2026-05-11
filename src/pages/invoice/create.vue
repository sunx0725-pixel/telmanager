<template>
  <view class="page">
    <view v-if="invoice" class="form-container">
      <view class="invoice-preview">
        <text class="preview-title">发票信息</text>
        <view class="preview-info">
          <view class="preview-row">
            <text class="preview-label">发票类型</text>
            <text class="preview-value">{{ invoice.typeName }}</text>
          </view>
          <view class="preview-row">
            <text class="preview-label">手机号码</text>
            <text class="preview-value">{{ invoice.phone }}</text>
          </view>
          <view class="preview-row">
            <text class="preview-label">账单月份</text>
            <text class="preview-value">{{ invoice.billMonth }}</text>
          </view>
          <view class="preview-row">
            <text class="preview-label">金额</text>
            <text class="preview-value amount">¥{{ invoice.amount.toFixed(2) }}</text>
          </view>
        </view>
      </view>

      <view class="input-group">
        <text class="input-label">发票抬头</text>
        <view class="header-options">
          <view 
            class="header-option"
            :class="{ active: invoiceType === 'personal' }"
            @click="invoiceType = 'personal'"
          >
            <text>个人</text>
          </view>
          <view 
            class="header-option"
            :class="{ active: invoiceType === 'company' }"
            @click="invoiceType = 'company'"
          >
            <text>企业</text>
          </view>
        </view>
      </view>

      <view class="input-group">
        <text class="input-label">抬头名称</text>
        <input 
          class="input" 
          type="text" 
          placeholder="请输入抬头名称" 
          v-model="headerName"
        />
      </view>

      <view v-if="invoiceType === 'company'" class="input-group">
        <text class="input-label">税号</text>
        <input 
          class="input" 
          type="text" 
          placeholder="请输入企业税号" 
          v-model="taxNo"
        />
        <text class="input-tip">企业发票必填税号</text>
      </view>

      <view class="input-group">
        <text class="input-label">接收邮箱</text>
        <input 
          class="input" 
          type="text" 
          placeholder="请输入邮箱地址" 
          v-model="email"
        />
        <text class="input-tip">发票将发送至该邮箱</text>
      </view>

      <button 
        class="btn btn-primary submit-btn" 
        :class="{ disabled: !canSubmit }"
        @click="submit"
      >
        {{ isProcessing ? '提交中...' : '确认开具' }}
      </button>

      <view class="tips">
        <text class="tip-item">• 电子发票将发送至您填写的邮箱</text>
        <text class="tip-item">• 发票开具后可在APP内下载</text>
        <text class="tip-item">• 企业发票需填写正确税号</text>
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

const invoiceType = ref<'personal' | 'company'>('personal')
const headerName = ref('')
const taxNo = ref('')
const email = ref('')
const isProcessing = ref(false)

onLoad((options) => {
  if (options?.id) {
    invoiceId.value = options.id
  }
})

const canSubmit = computed(() => {
  if (!headerName.value.trim()) return false
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return false
  if (invoiceType.value === 'company' && !taxNo.value.trim()) return false
  return true
})

const submit = () => {
  if (!canSubmit.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }

  isProcessing.value = true
  uni.showLoading({ title: '开具中...' })

  setTimeout(() => {
    invoiceStore.createInvoice(invoiceId.value, headerName.value, taxNo.value, email.value)
    uni.hideLoading()
    isProcessing.value = false
    uni.showToast({ title: '开具成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }, 2000)
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding: $spacing-lg;
}

.form-container {
  background: $bg-white;
  border-radius: $radius-xl;
  padding: $spacing-xl;
  box-shadow: $shadow-sm;
}

.invoice-preview {
  background: rgba($primary-color, 0.05);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;

  .preview-title {
    display: block;
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-base;
  }

  .preview-info {
    background: $bg-white;
    border-radius: $radius-base;
    padding: $spacing-base;

    .preview-row {
      display: flex;
      justify-content: space-between;
      padding: $spacing-xs 0;

      &:not(:last-child) {
        border-bottom: 1rpx solid $border-color;
      }

      .preview-label {
        font-size: $font-size-sm;
        color: $text-secondary;
      }

      .preview-value {
        font-size: $font-size-sm;
        color: $text-primary;

        &.amount {
          font-weight: 600;
          color: $primary-color;
        }
      }
    }
  }
}

.input-group {
  margin-bottom: $spacing-lg;

  .input-label {
    display: block;
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  .input {
    width: 100%;
    height: 88rpx;
    padding: 0 $spacing-base;
    background: $bg-color;
    border-radius: $radius-base;
    font-size: $font-size-base;
    box-sizing: border-box;
  }

  .input-tip {
    display: block;
    font-size: $font-size-xs;
    color: $text-hint;
    margin-top: $spacing-xs;
  }
}

.header-options {
  display: flex;
  gap: $spacing-sm;

  .header-option {
    flex: 1;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $bg-color;
    border-radius: $radius-base;
    font-size: $font-size-base;
    color: $text-primary;
    border: 2rpx solid transparent;

    &.active {
      background: rgba($primary-color, 0.1);
      border-color: $primary-color;
      color: $primary-color;
    }
  }
}

.submit-btn {
  width: 100%;
  margin-bottom: $spacing-lg;

  &.disabled {
    opacity: 0.5;
  }
}

.tips {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

  .tip-item {
    font-size: $font-size-xs;
    color: $text-hint;
  }
}
</style>