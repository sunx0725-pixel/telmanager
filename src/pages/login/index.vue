<template>
  <view class="login-page">
    <view class="header">
      <view class="logo-area">
        <view class="logo-icon">💳</view>
        <text class="app-name">手机号管家</text>
      </view>
      <text class="app-slogan">安全可靠，便捷支付</text>
    </view>

    <view class="form-area">
      <view class="form-card">
        <view class="input-group">
          <view class="input-row">
            <text class="input-prefix">+86</text>
            <view class="input-line"></view>
            <input
              class="phone-input"
              type="number"
              placeholder="请输入手机号"
              placeholder-class="ph"
              v-model="phone"
              maxlength="11"
            />
          </view>
        </view>

        <view class="input-group">
          <view class="input-row">
            <input
              class="code-input"
              type="number"
              placeholder="请输入验证码"
              placeholder-class="ph"
              v-model="code"
              maxlength="6"
            />
            <view class="code-btn" :class="{ active: codeBtnDisabled }" @click="sendCode">
              <text>{{ codeBtnText }}</text>
            </view>
          </view>
        </view>

        <view class="input-group">
          <view class="input-row">
            <input
              class="password-input"
              :type="showPwd ? 'text' : 'password'"
              placeholder="请输入登录密码"
              placeholder-class="ph"
              v-model="password"
            />
            <view class="eye-btn" @click="showPwd = !showPwd">
              <text>{{ showPwd ? '👁' : '👁️‍🗨️' }}</text>
            </view>
          </view>
        </view>

        <view class="agreement-row">
          <view class="check-box" :class="{ checked: agreed }" @click="agreed = !agreed">
            <text v-if="agreed" class="check-mark">✓</text>
          </view>
          <text class="agreement-text">
            我已阅读并同意
            <text class="link" @click.stop="openAgreement">《用户协议》</text>
            和
            <text class="link" @click.stop="openPrivacy">《隐私政策》</text>
          </text>
        </view>

        <button class="login-btn" :class="{ loading: isLoggingIn }" @click="handleLogin">
          <view v-if="isLoggingIn" class="btn-loader"></view>
          <text v-else>登录</text>
        </button>

        <view class="bottom-links">
          <text class="link-text" @click="forgotPwd">忘记密码</text>
          <text class="divider">|</text>
          <text class="link-text">注册账号</text>
        </view>
      </view>
    </view>

    <view class="third-party">
      <text class="third-title">其他登录方式</text>
      <view class="third-icons">
        <view class="third-item">
          <text class="third-icon">💚</text>
          <text class="third-name">微信</text>
        </view>
        <view class="third-item">
          <text class="third-icon">💙</text>
          <text class="third-name">支付宝</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const phone = ref('')
const code = ref('')
const password = ref('')
const agreed = ref(false)
const codeTimer = ref(0)
const showPwd = ref(false)
const isLoggingIn = ref(false)

const codeBtnDisabled = computed(() => codeTimer.value > 0 || phone.value.length !== 11)
const codeBtnText = computed(() => codeTimer.value > 0 ? `${codeTimer.value}s后重发` : '获取验证码')

const sendCode = () => {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  codeTimer.value = 60
  uni.showToast({ title: '验证码已发送', icon: 'success' })
  const timer = setInterval(() => {
    codeTimer.value--
    if (codeTimer.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleLogin = () => {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!/^\d{6}$/.test(code.value)) {
    uni.showToast({ title: '请输入6位验证码', icon: 'none' })
    return
  }
  if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(password.value)) {
    uni.showToast({ title: '密码需8-16位，包含字母和数字', icon: 'none' })
    return
  }
  if (!agreed.value) {
    uni.showToast({ title: '请同意用户协议和隐私政策', icon: 'none' })
    return
  }

  isLoggingIn.value = true
  setTimeout(() => {
    userStore.login(phone.value, code.value)
    isLoggingIn.value = false
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1500)
  }, 1500)
}

const forgotPwd = () => {
  uni.showToast({ title: '忘记密码功能开发中', icon: 'none' })
}

const openAgreement = () => {
  uni.navigateTo({ url: '/pages/mine/agreement' })
}

const openPrivacy = () => {
  uni.navigateTo({ url: '/pages/mine/privacy' })
}
</script>

<style lang="scss" scoped>
$primary: #3182CE;
$primary-light: #63B3ED;
$primary-dark: #2C5282;
$bg: #F7FAFC;
$white: #FFFFFF;
$text: #2D3748;
$text-light: #718096;
$border: #E2E8F0;

.login-page {
  min-height: 100vh;
  background: $bg;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 120rpx 60rpx 60rpx;
  text-align: center;
  background: linear-gradient(180deg, $primary 0%, $primary-light 100%);

  .logo-area {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20rpx;
    margin-bottom: 16rpx;

    .logo-icon {
      font-size: 64rpx;
    }

    .app-name {
      font-size: 44rpx;
      font-weight: 600;
      color: $white;
      letter-spacing: 4rpx;
    }
  }

  .app-slogan {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.form-area {
  flex: 1;
  padding: 0 40rpx;
  margin-top: -40rpx;
}

.form-card {
  background: $white;
  border-radius: 24rpx;
  padding: 50rpx 40rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
}

.input-group {
  margin-bottom: 36rpx;
}

.input-row {
  display: flex;
  align-items: center;
  background: $bg;
  border-radius: 16rpx;
  padding: 0 24rpx;
  height: 100rpx;
  border: 2rpx solid transparent;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: $primary;
    background: $white;
  }
}

.input-prefix {
  font-size: 30rpx;
  color: $text;
  font-weight: 500;
  margin-right: 16rpx;
}

.input-line {
  width: 2rpx;
  height: 40rpx;
  background: $border;
  margin-right: 20rpx;
}

.phone-input {
  flex: 1;
  height: 100%;
  font-size: 30rpx;
  color: $text;
}

.code-input {
  flex: 1;
  height: 100%;
  font-size: 30rpx;
  color: $text;
}

.code-btn {
  min-width: 180rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $primary;
  color: $white;
  border-radius: 12rpx;
  font-size: 24rpx;
  transition: all 0.2s;

  &.active {
    background: $border;
    color: $text-light;
  }
}

.password-input {
  flex: 1;
  height: 100%;
  font-size: 30rpx;
  color: $text;
}

.eye-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: $text-light;
}

.ph {
  color: $text-light;
  font-size: 28rpx;
}

.agreement-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin: 40rpx 0 36rpx;

  .check-box {
    width: 36rpx;
    height: 36rpx;
    border: 2rpx solid $border;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;

    &.checked {
      background: $primary;
      border-color: $primary;
    }

    .check-mark {
      font-size: 22rpx;
      color: $white;
      font-weight: bold;
    }
  }

  .agreement-text {
    font-size: 24rpx;
    color: $text-light;
    line-height: 1.5;
  }

  .link {
    color: $primary;
  }
}

.login-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
  color: $white;
  border: none;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 500;
  letter-spacing: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 20rpx rgba(49, 130, 206, 0.3);

  &.loading {
    opacity: 0.8;
  }
}

.btn-loader {
  width: 40rpx;
  height: 40rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: $white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.bottom-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32rpx;
  margin-top: 40rpx;

  .link-text {
    font-size: 26rpx;
    color: $primary;
  }

  .divider {
    color: $border;
  }
}

.third-party {
  padding: 60rpx 40rpx;
  text-align: center;

  .third-title {
    display: block;
    font-size: 24rpx;
    color: $text-light;
    margin-bottom: 40rpx;
    position: relative;

    &::before, &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 100rpx;
      height: 1rpx;
      background: $border;
    }

    &::before {
      left: 60rpx;
    }

    &::after {
      right: 60rpx;
    }
  }

  .third-icons {
    display: flex;
    justify-content: center;
    gap: 80rpx;
  }

  .third-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;

    .third-icon {
      width: 88rpx;
      height: 88rpx;
      background: $white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48rpx;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
    }

    .third-name {
      font-size: 22rpx;
      color: $text-light;
    }
  }
}
</style>