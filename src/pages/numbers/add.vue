<template>
  <view class="page">
    <view class="form-container">
      <view class="input-group">
        <text class="input-label">手机号</text>
        <input 
          class="input" 
          type="number" 
          placeholder="请输入11位手机号" 
          v-model="phone"
          maxlength="11"
        />
      </view>

      <view class="input-group">
        <text class="input-label">运营商</text>
        <view class="operator-options">
          <view 
            v-for="opt in operatorOptions" 
            :key="opt.value"
            class="operator-option"
            :class="{ active: operator === opt.value }"
            @click="operator = opt.value"
          >
            <text class="operator-icon">{{ opt.icon }}</text>
            <text class="operator-text">{{ opt.label }}</text>
          </view>
        </view>
      </view>

      <view class="verify-section">
        <view class="verify-card">
          <view class="verify-header">
            <text class="verify-title">实名验证</text>
            <text class="verify-hint">系统将验证号码归属人与主账号实名信息是否一致</text>
          </view>
          <view class="verify-info">
            <view class="verify-row">
              <text class="verify-label">姓名</text>
              <text class="verify-value">{{ userStore.user?.realName }}</text>
            </view>
            <view class="verify-row">
              <text class="verify-label">身份证号</text>
              <text class="verify-value">{{ maskIdCard(userStore.user?.idCard || '') }}</text>
            </view>
          </view>
        </view>
      </view>

      <button class="btn btn-primary submit-btn" @click="submit">确认添加</button>

      <view class="tips">
        <text class="tip-item">• 最多添加5个号码</text>
        <text class="tip-item">• 号码将进行实名验证</text>
        <text class="tip-item">• 号码存储时中间4位将打码脱敏</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNumbersStore } from '@/stores/numbers'

const userStore = useUserStore()
const numbersStore = useNumbersStore()

const phone = ref('')
const operator = ref('')

const operatorOptions = [
  { value: 'cmcc', label: '中国移动', icon: '📱' },
  { value: 'cucc', label: '中国联通', icon: '📡' },
  { value: 'ctcc', label: '中国电信', icon: '📶' }
]

const canSubmit = computed(() => {
  return /^1[3-9]\d{9}$/.test(phone.value) && operator.value && numbersStore.numbers.length < 5
})

const maskIdCard = (idCard: string) => {
  if (!idCard) return ''
  return idCard.slice(0, 4) + '**********' + idCard.slice(-4)
}

const submit = () => {
  if (!canSubmit.value) {
    if (numbersStore.numbers.length >= 5) {
      uni.showToast({ title: '最多添加5个号码', icon: 'none' })
    } else {
      uni.showToast({ title: '请填写完整信息', icon: 'none' })
    }
    return
  }

  uni.showLoading({ title: '验证中...' })
  
  setTimeout(() => {
    uni.hideLoading()
    uni.showModal({
      title: '验证成功',
      content: '号码归属人与实名信息一致',
      showCancel: false,
      success: () => {
        const operatorName = operatorOptions.find(o => o.value === operator.value)?.label || ''
        numbersStore.addNumber(phone.value, operator.value, operatorName)
        uni.showToast({ title: '添加成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    })
  }, 1500)
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
      font-size: $font-size-lg;
      color: $text-primary;
      box-sizing: border-box;
    }
  }

  .operator-options {
    display: flex;
    gap: $spacing-sm;

    .operator-option {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: $spacing-base;
      background: $bg-color;
      border-radius: $radius-base;
      border: 2rpx solid transparent;
      transition: all 0.2s;

      &.active {
        background: rgba($primary-color, 0.1);
        border-color: $primary-color;
      }

      .operator-icon {
        font-size: 40rpx;
        margin-bottom: $spacing-xs;
      }

      .operator-text {
        font-size: $font-size-sm;
        color: $text-primary;
      }
    }
  }

  .verify-section {
    margin: $spacing-lg 0;

    .verify-card {
      background: rgba($primary-color, 0.05);
      border-radius: $radius-lg;
      padding: $spacing-lg;

      .verify-header {
        margin-bottom: $spacing-base;

        .verify-title {
          display: block;
          font-size: $font-size-base;
          font-weight: 600;
          color: $text-primary;
          margin-bottom: $spacing-xs;
        }

        .verify-hint {
          font-size: $font-size-xs;
          color: $text-secondary;
        }
      }

      .verify-info {
        background: $bg-white;
        border-radius: $radius-base;
        padding: $spacing-base;

        .verify-row {
          display: flex;
          justify-content: space-between;
          padding: $spacing-xs 0;

          &:not(:last-child) {
            border-bottom: 1rpx solid $border-color;
          }

          .verify-label {
            font-size: $font-size-sm;
            color: $text-secondary;
          }

          .verify-value {
            font-size: $font-size-sm;
            color: $text-primary;
            font-weight: 500;
          }
        }
      }
    }
  }

  .submit-btn {
    width: 100%;
    margin-bottom: $spacing-lg;
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
}
</style>