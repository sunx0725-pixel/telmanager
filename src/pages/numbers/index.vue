<template>
  <view class="page">
    <view class="header-actions">
      <button class="add-btn" @click="goToAdd">
        <text class="add-icon">+</text>
        <text class="add-text">添加号码</text>
      </button>
    </view>

    <view class="search-bar">
      <input 
        class="search-input" 
        type="text" 
        placeholder="搜索号码..." 
        v-model="searchText"
      />
      <text class="search-icon">🔍</text>
    </view>

    <view v-if="filteredNumbers.length > 0" class="number-list">
      <view 
        v-for="item in filteredNumbers" 
        :key="item.id" 
        class="number-card"
      >
        <view class="card-header" @click="goToDetail(item.id)">
          <view class="operator-icon-wrap" :style="{ background: getOperatorColor(item.operator) + '20' }">
            <text class="operator-icon" :style="{ color: getOperatorColor(item.operator) }">
              {{ getOperatorIcon(item.operator) }}
            </text>
          </view>
          <view class="card-info">
            <text class="phone-text">{{ item.maskedPhone }}</text>
            <text class="operator-text">{{ item.operatorName }}</text>
          </view>
          <view class="card-right">
            <text class="balance-text" :class="{ warning: item.balance <= 10 }">
              ¥{{ item.balance.toFixed(2) }}
            </text>
            <text class="arrow">›</text>
          </view>
        </view>

        <view class="card-body">
          <view class="usage-row">
            <view class="usage-item">
              <text class="usage-label">剩余流量</text>
              <text class="usage-value">{{ item.dataRemaining }}GB</text>
            </view>
            <view class="usage-item">
              <text class="usage-label">剩余通话</text>
              <text class="usage-value">{{ item.callMinutes }}分钟</text>
            </view>
          </view>
          <view class="expire-row">
            <text class="expire-label">套餐到期</text>
            <text class="expire-value" :class="{ warning: isExpiring(item.packageExpireDate) }">
              {{ formatDate(item.packageExpireDate) }}
            </text>
          </view>
        </view>

        <view class="card-footer">
          <view class="footer-left">
            <input 
              class="remark-input" 
              type="text" 
              placeholder="添加备注..." 
              :value="item.remark"
              maxlength="10"
              @blur="updateRemark(item.id, $event)"
            />
            <view 
              class="favorite-btn" 
              :class="{ active: item.isFavorite }"
              @click="toggleFavorite(item.id)"
            >
              <text>{{ item.isFavorite ? '★' : '☆' }}</text>
            </view>
          </view>
          <view class="footer-right">
            <view 
              class="freeze-btn" 
              :class="{ active: item.isFrozen }"
              @click="toggleFreeze(item.id)"
            >
              <text>{{ item.isFrozen ? '解冻' : '冻结' }}</text>
            </view>
            <view class="delete-btn" @click="deleteNumber(item.id)">
              <text>删除</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty-state">
      <text class="empty-icon">📱</text>
      <text class="empty-text">暂无号码</text>
      <button class="btn btn-primary mt-base" @click="goToAdd">添加第一个号码</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNumbersStore } from '@/stores/numbers'
import { operatorMap } from '@/data/mock'

const numbersStore = useNumbersStore()
const searchText = ref('')

const filteredNumbers = computed(() => {
  if (!searchText.value) return numbersStore.numbers
  return numbersStore.numbers.filter(n => 
    n.maskedPhone.includes(searchText.value) || 
    n.remark.includes(searchText.value)
  )
})

const getOperatorColor = (operator: string) => operatorMap[operator]?.color || '#999999'
const getOperatorIcon = (operator: string) => operatorMap[operator]?.icon || '📱'

const formatDate = (date: string) => {
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const isExpiring = (date: string) => {
  const now = new Date()
  const expireDate = new Date(date)
  const diffDays = Math.ceil((expireDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 3 && diffDays > 0
}

const goToAdd = () => {
  uni.navigateTo({ url: '/pages/numbers/add' })
}

const goToDetail = (id: string) => {
  uni.navigateTo({ url: `/pages/numbers/detail?id=${id}` })
}

const updateRemark = (id: string, event: any) => {
  const value = event.detail.value
  numbersStore.updateNumber(id, { remark: value })
}

const toggleFavorite = (id: string) => {
  numbersStore.toggleFavorite(id)
}

const toggleFreeze = (id: string) => {
  const number = numbersStore.getNumberById(id)
  if (!number) return

  if (number.isFrozen) {
    uni.showModal({
      title: '解冻号码',
      content: '解冻后将恢复充值、开票等功能',
      confirmText: '确认解冻',
      success: (res) => {
        if (res.confirm) {
          numbersStore.unfreezeNumber(id)
          uni.showToast({ title: '已解冻', icon: 'success' })
        }
      }
    })
  } else {
    uni.showModal({
      title: '冻结号码',
      content: '冻结后将仅保留查询功能',
      confirmText: '确认冻结',
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          numbersStore.freezeNumber(id)
          uni.showToast({ title: '已冻结', icon: 'success' })
        }
      }
    })
  }
}

const deleteNumber = (id: string) => {
  uni.showModal({
    title: '删除号码',
    content: '删除后将无法恢复，确定删除吗？',
    confirmText: '确定删除',
    confirmColor: '#F44336',
    success: (res) => {
      if (res.confirm) {
        uni.showModal({
          title: '验证密码',
          editable: true,
          placeholderText: '请输入登录密码',
          success: (pwdRes) => {
            if (pwdRes.confirm && pwdRes.content) {
              numbersStore.removeNumber(id)
              uni.showToast({ title: '已删除', icon: 'success' })
            }
          }
        })
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

.header-actions {
  padding: $spacing-lg;

  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    width: 100%;
    height: 88rpx;
    background: $primary-color;
    color: #FFFFFF;
    border: none;
    border-radius: $radius-lg;
    font-size: $font-size-base;

    .add-icon {
      font-size: 40rpx;
      font-weight: 300;
    }
  }
}

.search-bar {
  position: relative;
  margin: 0 $spacing-lg $spacing-base;

  .search-input {
    width: 100%;
    height: 80rpx;
    padding: 0 $spacing-xl 0 $spacing-lg;
    background: $bg-white;
    border-radius: $radius-lg;
    font-size: $font-size-base;
    box-shadow: $shadow-sm;
  }

  .search-icon {
    position: absolute;
    right: $spacing-base;
    top: 50%;
    transform: translateY(-50%);
    font-size: 28rpx;
    color: $text-hint;
  }
}

.number-list {
  padding: 0 $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}

.number-card {
  background: $bg-white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;

  .card-header {
    display: flex;
    align-items: center;
    padding: $spacing-base;
    gap: $spacing-base;

    .operator-icon-wrap {
      width: 72rpx;
      height: 72rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      .operator-icon {
        font-size: 36rpx;
      }
    }

    .card-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .phone-text {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $text-primary;
      }

      .operator-text {
        font-size: $font-size-sm;
        color: $text-secondary;
      }
    }

    .card-right {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .balance-text {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $success-color;

        &.warning {
          color: $warning-color;
        }
      }

      .arrow {
        font-size: $font-size-xl;
        color: $text-hint;
      }
    }
  }

  .card-body {
    padding: 0 $spacing-base $spacing-base;
    border-top: 1rpx solid $border-color;

    .usage-row {
      display: flex;
      padding: $spacing-sm 0;

      .usage-item {
        flex: 1;
        display: flex;
        justify-content: space-between;

        .usage-label {
          font-size: $font-size-sm;
          color: $text-secondary;
        }

        .usage-value {
          font-size: $font-size-sm;
          color: $text-primary;
          font-weight: 500;
        }
      }
    }

    .expire-row {
      display: flex;
      justify-content: space-between;

      .expire-label {
        font-size: $font-size-sm;
        color: $text-secondary;
      }

      .expire-value {
        font-size: $font-size-sm;
        color: $text-primary;

        &.warning {
          color: $warning-color;
        }
      }
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    padding: $spacing-sm $spacing-base;
    background: $bg-color;

    .footer-left {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .remark-input {
        width: 200rpx;
        height: 60rpx;
        padding: 0 $spacing-sm;
        background: $bg-white;
        border-radius: $radius-sm;
        font-size: $font-size-sm;
      }

      .favorite-btn {
        width: 56rpx;
        height: 56rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        color: $text-hint;

        &.active {
          color: $warning-color;
        }
      }
    }

    .footer-right {
      display: flex;
      gap: $spacing-lg;

      .freeze-btn {
        font-size: $font-size-sm;
        color: $warning-color;
        padding: 8rpx 16rpx;
        border-radius: $radius-sm;

        &.active {
          background: rgba($warning-color, 0.1);
        }
      }

      .delete-btn {
        font-size: $font-size-sm;
        color: $error-color;
        padding: 8rpx 16rpx;
        border-radius: $radius-sm;
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