<template>
  <view class="page">
    <view class="select-section">
      <text class="section-label">选择号码</text>
      <view class="select-box" @click="showNumberPicker = true">
        <text v-if="selectedNumber" class="select-value">
          {{ getOperatorIcon(selectedNumber.operator) }} {{ selectedNumber.maskedPhone }}
        </text>
        <text v-else class="select-placeholder">请选择充值号码</text>
        <text class="select-arrow">▼</text>
      </view>
    </view>

    <view class="amount-section">
      <text class="section-label">充值金额</text>
      <view class="amount-options">
        <view 
          v-for="amount in fixedAmounts" 
          :key="amount"
          class="amount-option"
          :class="{ active: amount === selectedAmount }"
          @click="selectedAmount = amount"
        >
          ¥{{ amount }}
        </view>
      </view>
      <view class="custom-amount">
        <input 
          class="custom-input" 
          type="digit" 
          placeholder="自定义金额" 
          v-model="customAmount"
          @input="onCustomAmountChange"
        />
        <text class="custom-hint">（≥10元）</text>
      </view>
    </view>

    <view class="method-section">
      <text class="section-label">支付方式</text>
      <view class="method-options">
        <view 
          class="method-option"
          :class="{ active: payMethod === 'wechat' }"
          @click="payMethod = 'wechat'"
        >
          <text class="method-icon">💚</text>
          <text class="method-text">微信支付</text>
        </view>
        <view 
          class="method-option"
          :class="{ active: payMethod === 'alipay' }"
          @click="payMethod = 'alipay'"
        >
          <text class="method-icon">💙</text>
          <text class="method-text">支付宝</text>
        </view>
      </view>
    </view>

    <view class="summary-section">
      <view class="summary-row">
        <text class="summary-label">充值号码</text>
        <text class="summary-value">{{ selectedNumber?.maskedPhone || '-' }}</text>
      </view>
      <view class="summary-row">
        <text class="summary-label">充值金额</text>
        <text class="summary-value">¥{{ finalAmount }}</text>
      </view>
      <view class="summary-row">
        <text class="summary-label">支付方式</text>
        <text class="summary-value">{{ payMethod === 'wechat' ? '微信支付' : '支付宝' }}</text>
      </view>
    </view>

    <button 
      class="btn btn-primary submit-btn" 
      :class="{ disabled: !canSubmit }"
      @click="submit"
    >
      {{ isProcessing ? '处理中...' : `确认充值 ¥${finalAmount}` }}
    </button>

    <view v-if="showNumberPicker" class="picker-mask" @click="showNumberPicker = false">
      <view class="picker-container" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择号码</text>
          <text class="picker-close" @click="showNumberPicker = false">✕</text>
        </view>
        <scroll-view class="picker-list" scroll-y>
          <view 
            v-for="item in numbersStore.numbers" 
            :key="item.id"
            class="picker-item"
            :class="{ active: selectedNumber?.id === item.id }"
            @click="selectNumber(item)"
          >
            <text class="picker-icon" :style="{ color: getOperatorColor(item.operator) }">
              {{ getOperatorIcon(item.operator) }}
            </text>
            <text class="picker-phone">{{ item.maskedPhone }}</text>
            <text class="picker-balance">余额: ¥{{ item.balance.toFixed(2) }}</text>
          </view>
        </scroll-view>
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
import type { PhoneNumber } from '@/types'

const numbersStore = useNumbersStore()
const paymentStore = usePaymentStore()

const selectedNumber = ref<PhoneNumber | null>(null)
const selectedAmount = ref(50)
const customAmount = ref('')
const payMethod = ref<'wechat' | 'alipay'>('wechat')
const showNumberPicker = ref(false)
const isProcessing = ref(false)

const fixedAmounts = [10, 20, 50, 100, 200]

onLoad((options) => {
  if (options?.id) {
    selectedNumber.value = numbersStore.getNumberById(options.id)
  }
})

const finalAmount = computed(() => {
  if (customAmount.value && parseFloat(customAmount.value) >= 10) {
    return parseFloat(customAmount.value)
  }
  return selectedAmount.value
})

const canSubmit = computed(() => {
  return selectedNumber.value && finalAmount.value >= 10 && !isProcessing.value
})

const getOperatorColor = (operator: string) => operatorMap[operator]?.color || '#999999'
const getOperatorIcon = (operator: string) => operatorMap[operator]?.icon || '📱'

const onCustomAmountChange = () => {
  const val = parseFloat(customAmount.value)
  if (val < 10) {
    customAmount.value = ''
  }
}

const selectNumber = (item: PhoneNumber) => {
  selectedNumber.value = item
  showNumberPicker.value = false
}

const submit = async () => {
  if (!canSubmit.value) return

  if (selectedNumber.value?.isFrozen) {
    uni.showToast({ title: '该号码已冻结，无法充值', icon: 'none' })
    return
  }

  isProcessing.value = true
  uni.showLoading({ title: '支付中...' })

  try {
    const result = await paymentStore.createRecharge(
      selectedNumber.value.id,
      selectedNumber.value.phone,
      finalAmount.value,
      payMethod.value
    )

    uni.hideLoading()
    isProcessing.value = false

    if (result.success) {
      uni.showToast({ title: '充值成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      uni.showToast({ title: '充值失败，请重试', icon: 'none' })
    }
  } catch (error) {
    uni.hideLoading()
    isProcessing.value = false
    uni.showToast({ title: '充值失败，请重试', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding: $spacing-lg;
  padding-bottom: 200rpx;
}

.section-label {
  display: block;
  font-size: $font-size-base;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.select-section {
  margin-bottom: $spacing-lg;

  .select-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 $spacing-base;
    background: $bg-white;
    border-radius: $radius-base;
    box-shadow: $shadow-sm;

    .select-value {
      font-size: $font-size-base;
      color: $text-primary;
    }

    .select-placeholder {
      font-size: $font-size-base;
      color: $text-hint;
    }

    .select-arrow {
      font-size: $font-size-sm;
      color: $text-hint;
    }
  }
}

.amount-section {
  margin-bottom: $spacing-lg;

  .amount-options {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    margin-bottom: $spacing-base;

    .amount-option {
      width: calc(33.33% - 12rpx);
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $bg-white;
      border-radius: $radius-base;
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-primary;
      border: 2rpx solid transparent;
      box-shadow: $shadow-sm;

      &.active {
        background: rgba($primary-color, 0.1);
        border-color: $primary-color;
        color: $primary-color;
      }
    }
  }

  .custom-amount {
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    .custom-input {
      flex: 1;
      height: 88rpx;
      padding: 0 $spacing-base;
      background: $bg-white;
      border-radius: $radius-base;
      font-size: $font-size-lg;
      font-weight: 600;
      box-shadow: $shadow-sm;
    }

    .custom-hint {
      font-size: $font-size-sm;
      color: $text-hint;
    }
  }
}

.method-section {
  margin-bottom: $spacing-lg;

  .method-options {
    display: flex;
    gap: $spacing-base;

    .method-option {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-sm;
      height: 88rpx;
      background: $bg-white;
      border-radius: $radius-base;
      border: 2rpx solid transparent;
      box-shadow: $shadow-sm;

      &.active {
        background: rgba($primary-color, 0.1);
        border-color: $primary-color;
      }

      .method-icon {
        font-size: 40rpx;
      }

      .method-text {
        font-size: $font-size-base;
        color: $text-primary;
        font-weight: 500;
      }
    }
  }
}

.summary-section {
  background: $bg-white;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  box-shadow: $shadow-sm;

  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: $spacing-xs 0;

    &:not(:last-child) {
      border-bottom: 1rpx solid $border-color;
    }

    .summary-label {
      font-size: $font-size-base;
      color: $text-secondary;
    }

    .summary-value {
      font-size: $font-size-base;
      color: $text-primary;
      font-weight: 500;
    }
  }
}

.submit-btn {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  border-radius: 0;
  height: 100rpx;

  &.disabled {
    opacity: 0.5;
  }
}

.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 100;
}

.picker-container {
  width: 100%;
  background: $bg-white;
  border-radius: $radius-xl $radius-xl 0 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-lg;
    border-bottom: 1rpx solid $border-color;

    .picker-title {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-primary;
    }

    .picker-close {
      font-size: $font-size-xl;
      color: $text-hint;
    }
  }

  .picker-list {
    max-height: 60vh;

    .picker-item {
      display: flex;
      align-items: center;
      gap: $spacing-base;
      padding: $spacing-base;
      border-bottom: 1rpx solid $border-color;

      &.active {
        background: rgba($primary-color, 0.05);
      }

      .picker-icon {
        font-size: 32rpx;
      }

      .picker-phone {
        flex: 1;
        font-size: $font-size-base;
        color: $text-primary;
      }

      .picker-balance {
        font-size: $font-size-sm;
        color: $text-secondary;
      }
    }
  }
}
</style>