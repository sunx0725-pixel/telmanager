<template>
  <view class="page">
    <view class="tool-card">
      <text class="tool-title">📍 号码归属地查询</text>
      <view class="query-form">
        <input 
          class="query-input" 
          type="number" 
          placeholder="请输入手机号" 
          v-model="queryPhone"
          maxlength="11"
        />
        <button class="query-btn" @click="handleQuery">查询</button>
      </view>
      
      <view v-if="toolsStore.queryResult" class="query-result">
        <view class="result-row">
          <text class="result-label">手机号码</text>
          <text class="result-value">{{ toolsStore.queryResult.phone }}</text>
        </view>
        <view class="result-row">
          <text class="result-label">运营商</text>
          <text class="result-value">{{ toolsStore.queryResult.operatorName }}</text>
        </view>
        <view class="result-row">
          <text class="result-label">归属地</text>
          <text class="result-value">{{ toolsStore.queryResult.province }} {{ toolsStore.queryResult.city }}</text>
        </view>
        <view class="result-row">
          <text class="result-label">号段类型</text>
          <text class="result-value">{{ toolsStore.queryResult.type }}</text>
        </view>
      </view>
    </view>

    <view class="tool-card">
      <text class="tool-title">💰 话费计算器</text>
      <view class="calculator-form">
        <view class="calc-item">
          <text class="calc-label">套餐月费（元）</text>
          <input 
            class="calc-input" 
            type="digit" 
            placeholder="0" 
            v-model="monthlyFee"
          />
        </view>
        <view class="calc-item">
          <text class="calc-label">流量使用（GB）</text>
          <input 
            class="calc-input" 
            type="digit" 
            placeholder="0" 
            v-model="dataUsage"
          />
        </view>
        <view class="calc-item">
          <text class="calc-label">流量套餐（GB）</text>
          <input 
            class="calc-input" 
            type="digit" 
            placeholder="0" 
            v-model="dataLimit"
          />
        </view>
        <view class="calc-item">
          <text class="calc-label">超额流量费（元/GB）</text>
          <input 
            class="calc-input" 
            type="digit" 
            placeholder="0" 
            v-model="overRate"
          />
        </view>
        <view class="calc-item">
          <text class="calc-label">通话时长（分钟）</text>
          <input 
            class="calc-input" 
            type="digit" 
            placeholder="0" 
            v-model="callMinutes"
          />
        </view>
        <view class="calc-item">
          <text class="calc-label">通话套餐（分钟）</text>
          <input 
            class="calc-input" 
            type="digit" 
            placeholder="0" 
            v-model="callLimit"
          />
        </view>
        <view class="calc-item">
          <text class="calc-label">超额通话费（元/分钟）</text>
          <input 
            class="calc-input" 
            type="digit" 
            placeholder="0" 
            v-model="callRate"
          />
        </view>
      </view>

      <button class="calc-btn" @click="calculate">计算</button>

      <view v-if="calcResult" class="calc-result">
        <text class="result-title">预估月消费</text>
        <text class="result-amount">¥{{ calcResult }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToolsStore } from '@/stores/tools'

const toolsStore = useToolsStore()

const queryPhone = ref('')
const monthlyFee = ref('')
const dataUsage = ref('')
const dataLimit = ref('')
const overRate = ref('')
const callMinutes = ref('')
const callLimit = ref('')
const callRate = ref('')
const calcResult = ref('')

const handleQuery = () => {
  if (queryPhone.value.length !== 11) {
    uni.showToast({ title: '请输入11位手机号', icon: 'none' })
    return
  }
  toolsStore.queryLocation(queryPhone.value)
}

const calculate = () => {
  const fee = parseFloat(monthlyFee.value) || 0
  const data = parseFloat(dataUsage.value) || 0
  const dataL = parseFloat(dataLimit.value) || 0
  const over = parseFloat(overRate.value) || 0
  const call = parseFloat(callMinutes.value) || 0
  const callL = parseFloat(callLimit.value) || 0
  const rate = parseFloat(callRate.value) || 0

  calcResult.value = toolsStore.calculateCost(fee, data, dataL, over, call, callL, rate)
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding: $spacing-lg;
  padding-bottom: 120rpx;
}

.tool-card {
  background: $bg-white;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-base;
  box-shadow: $shadow-sm;

  .tool-title {
    display: block;
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-lg;
  }
}

.query-form {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;

  .query-input {
    flex: 1;
    height: 88rpx;
    padding: 0 $spacing-base;
    background: $bg-color;
    border-radius: $radius-base;
    font-size: $font-size-base;
  }

  .query-btn {
    width: 140rpx;
    height: 88rpx;
    background: $primary-color;
    color: #FFFFFF;
    border: none;
    border-radius: $radius-base;
    font-size: $font-size-base;
  }
}

.query-result {
  background: $bg-color;
  border-radius: $radius-base;
  padding: $spacing-base;

  .result-row {
    display: flex;
    justify-content: space-between;
    padding: $spacing-sm 0;

    &:not(:last-child) {
      border-bottom: 1rpx solid $border-color;
    }

    .result-label {
      font-size: $font-size-base;
      color: $text-secondary;
    }

    .result-value {
      font-size: $font-size-base;
      color: $text-primary;
      font-weight: 500;
    }
  }
}

.calculator-form {
  margin-bottom: $spacing-lg;

  .calc-item {
    margin-bottom: $spacing-base;

    .calc-label {
      display: block;
      font-size: $font-size-sm;
      color: $text-secondary;
      margin-bottom: $spacing-xs;
    }

    .calc-input {
      width: 100%;
      height: 80rpx;
      padding: 0 $spacing-base;
      background: $bg-color;
      border-radius: $radius-base;
      font-size: $font-size-base;
      box-sizing: border-box;
    }
  }
}

.calc-btn {
  width: 100%;
  height: 88rpx;
  background: $primary-color;
  color: #FFFFFF;
  border: none;
  border-radius: $radius-base;
  font-size: $font-size-base;
  margin-bottom: $spacing-lg;
}

.calc-result {
  background: rgba($primary-color, 0.05);
  border-radius: $radius-base;
  padding: $spacing-lg;
  text-align: center;

  .result-title {
    display: block;
    font-size: $font-size-base;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
  }

  .result-amount {
    font-size: 48rpx;
    font-weight: 600;
    color: $primary-color;
  }
}
</style>