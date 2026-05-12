<template>
  <view class="page">
    <view class="user-header">
      <view class="avatar-wrap">
        <text class="avatar">👤</text>
        <view class="edit-avatar">📷</view>
      </view>
      <view class="user-info">
        <text class="username">{{ userStore.user?.name || '用户' }}</text>
        <text class="user-phone">{{ userStore.user?.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}</text>
      </view>
      <view class="settings-btn" @click="goToSettings">⚙️</view>
    </view>

    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-value">{{ numbersStore.numbers.length }}</text>
        <text class="stat-label">管理号码</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ paymentStore.records.length }}</text>
        <text class="stat-label">充值记录</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ invoiceStore.invoices.length }}</text>
        <text class="stat-label">发票管理</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-card">
        <view class="menu-item" @click="goToSecurity">
          <text class="menu-icon">🔒</text>
          <text class="menu-text">安全中心</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goToTools">
          <text class="menu-icon">🔧</text>
          <text class="menu-text">实用工具</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goToHelp">
          <text class="menu-icon">❓</text>
          <text class="menu-text">帮助中心</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goToPrivacy">
          <text class="menu-icon">📜</text>
          <text class="menu-text">隐私政策</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goToAgreement">
          <text class="menu-icon">📝</text>
          <text class="menu-text">用户协议</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-card">
        <view class="menu-item" @click="editProfile">
          <text class="menu-icon">✏️</text>
          <text class="menu-text">修改昵称</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="changePassword">
          <text class="menu-icon">🔑</text>
          <text class="menu-text">修改密码</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="toggleBiometric">
          <text class="menu-icon">👆</text>
          <text class="menu-text">指纹/面容解锁</text>
          <view class="toggle" :class="{ active: biometricEnabled }">
            <view class="toggle-dot"></view>
          </view>
        </view>
      </view>
    </view>

    <button class="btn btn-secondary logout-btn" @click="handleLogout">退出登录</button>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNumbersStore } from '@/stores/numbers'
import { usePaymentStore } from '@/stores/payment'
import { useInvoiceStore } from '@/stores/invoice'

const userStore = useUserStore()
const numbersStore = useNumbersStore()
const paymentStore = usePaymentStore()
const invoiceStore = useInvoiceStore()

const biometricEnabled = ref(false)

onMounted(() => {
  userStore.checkLogin()
  numbersStore.fetchNumbers()
  paymentStore.fetchRecords()
  invoiceStore.fetchInvoices()
})

const goToSecurity = () => {
  uni.navigateTo({ url: '/pages/security/index' })
}

const goToTools = () => {
  uni.navigateTo({ url: '/pages/tools/index' })
}

const goToHelp = () => {
  uni.navigateTo({ url: '/pages/mine/help' })
}

const goToPrivacy = () => {
  uni.navigateTo({ url: '/pages/mine/privacy' })
}

const goToAgreement = () => {
  uni.navigateTo({ url: '/pages/mine/agreement' })
}

const goToSettings = () => {
  uni.showToast({ title: '设置页面开发中', icon: 'none' })
}

const editProfile = () => {
  uni.showModal({
    title: '修改昵称',
    editable: true,
    placeholderText: '请输入新昵称',
    success: (res) => {
      if (res.confirm && res.content) {
        userStore.updateUserInfo(res.content, '')
        uni.showToast({ title: '修改成功', icon: 'success' })
      }
    }
  })
}

const changePassword = () => {
  uni.showToast({ title: '修改密码功能开发中', icon: 'none' })
}

const toggleBiometric = () => {
  biometricEnabled.value = !biometricEnabled.value
  uni.showToast({ 
    title: biometricEnabled.value ? '已开启指纹解锁' : '已关闭指纹解锁', 
    icon: 'none' 
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    confirmText: '确定退出',
    confirmColor: '#F44336',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.redirectTo({ url: '/pages/login/index' })
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

.user-header {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  padding: $spacing-xl $spacing-lg;
  display: flex;
  align-items: center;
  gap: $spacing-base;

  .avatar-wrap {
    position: relative;

    .avatar {
      width: 100rpx;
      height: 100rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 50rpx;
    }

    .edit-avatar {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 36rpx;
      height: 36rpx;
      background: $bg-white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20rpx;
    }
  }

  .user-info {
    flex: 1;

    .username {
      display: block;
      font-size: $font-size-xl;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 4rpx;
    }

    .user-phone {
      font-size: $font-size-sm;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .settings-btn {
    font-size: 40rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.stats-card {
  margin: -40rpx $spacing-lg $spacing-base;
  background: $bg-white;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
  align-items: center;
  box-shadow: $shadow-base;

  .stat-item {
    flex: 1;
    text-align: center;

    .stat-value {
      display: block;
      font-size: $font-size-xl;
      font-weight: 600;
      color: $primary-color;
      margin-bottom: 4rpx;
    }

    .stat-label {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }

  .stat-divider {
    width: 1rpx;
    height: 60rpx;
    background: $border-color;
  }
}

.menu-section {
  padding: 0 $spacing-lg;
  margin-bottom: $spacing-base;

  .menu-card {
    background: $bg-white;
    border-radius: $radius-lg;
    overflow: hidden;
    box-shadow: $shadow-sm;

    .menu-item {
      display: flex;
      align-items: center;
      padding: $spacing-base;
      border-bottom: 1rpx solid $border-color;

      &:last-child {
        border-bottom: none;
      }

      .menu-icon {
        font-size: 36rpx;
        margin-right: $spacing-base;
      }

      .menu-text {
        flex: 1;
        font-size: $font-size-base;
        color: $text-primary;
      }

      .menu-arrow {
        font-size: $font-size-xl;
        color: $text-hint;
      }

      .toggle {
        width: 80rpx;
        height: 44rpx;
        background: $bg-color;
        border-radius: 22rpx;
        position: relative;
        transition: background 0.2s;

        &.active {
          background: $primary-color;
        }

        .toggle-dot {
          position: absolute;
          top: 4rpx;
          left: 4rpx;
          width: 36rpx;
          height: 36rpx;
          background: #FFFFFF;
          border-radius: 50%;
          transition: transform 0.2s;
          box-shadow: $shadow-sm;
        }

        &.active .toggle-dot {
          transform: translateX(36rpx);
        }
      }
    }
  }
}

.logout-btn {
  margin: $spacing-lg;
  width: calc(100% - 48rpx);
  background: $bg-color;
  color: $text-secondary;
}
</style>