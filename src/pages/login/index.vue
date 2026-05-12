<template>
  <view class="login-page">
    <view class="header">
      <view class="logo-area">
        <view class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <rect width="48" height="48" fill="#3182CE" rx="12"/>
            <path d="M14 34h20c1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2H14c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2z" fill="#fff"/>
            <path d="M20 26l-5 3V19l5 3 5-3v10l-5-3z" fill="#3182CE"/>
          </svg>
        </view>
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
          <view class="third-icon wechat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#09BB07" d="M24 4C13.4 4 4.9 11.6 4.9 21c0 5.3 2.8 10 7.1 13.4l-1.4 5.2 5.7-2.8c2.2.7 4.6 1.1 7.1 1.1 10.6 0 19.1-7.6 19.1-17 0-9.4-8.5-17-19.1-17z"/>
              <circle cx="17.5" cy="20" r="3" fill="#fff"/>
              <circle cx="30.5" cy="20" r="3" fill="#fff"/>
              <path d="M36 30c-2 0-3.6-1.7-3.6-3.8s1.6-3.8 3.6-3.8 3.6 1.7 3.6 3.8-1.6 3.8-3.6 3.8z" fill="#fff"/>
            </svg>
          </view>
          <text class="third-name">微信</text>
        </view>
        <view class="third-item">
          <view class="third-icon alipay-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#1677FF" d="M24 4C12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20S35.1 4 24 4z"/>
              <path d="M36 30c-4.4 2-8.5 3.2-12 3.2-1.5 0-3-.2-4.4-.7l1.8-4.5c1 .2 2.1.4 3.4.4 2.1 0 4-.4 5.6-1.3 1.6-.9 2.4-2.2 2.4-4 0-1.4-.8-2.4-2.3-3.1-1.5-.7-3.4-1.1-5.8-1.3l-2.5-.2c-.6-.1-1-.4-1-.9v-1.6c0-.6.3-1 .8-1.1l3.2-.5c1.3-.2 2.4-.4 3.3-.8.9-.4 1.3-1 1.3-1.8 0-1.2-1-2.1-2.9-2.1-1.5 0-3 .3-4.5.9l-1.7.8-1.7-4.3h5.7c.4 0 .7-.3.7-.7v-1.6c0-.4-.3-.7-.7-.7H16c-.4 0-.7.3-.7.7v1.6c0 .4.3.7.7.7h2.2l-3.1 7.7c-.1.3-.1.5 0 .8l3.5 8.7c.1.2.3.4.5.4h1.9c.2 0 .4-.1.5-.3l1.9-4.7c1.4.4 2.9.7 4.4.7 2.7 0 5.3-.9 7.6-2.5.2-.2.2-.6-.1-.8z" fill="#fff"/>
            </svg>
          </view>
          <text class="third-name">支付宝</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const phone = ref('')
const code = ref('')
const password = ref('')
const agreed = ref(false)
const codeTimer = ref(0)
const showPwd = ref(false)

// 从store获取loading状态
const isLoggingIn = computed(() => userStore.loading)
const codeBtnDisabled = computed(() => codeTimer.value > 0 || phone.value.length !== 11)
const codeBtnText = computed(() => codeTimer.value > 0 ? `${codeTimer.value}s后重发` : '获取验证码')

// 检查是否已登录
onMounted(() => {
  userStore.checkLogin()
  if (userStore.isLoggedIn) {
    uni.switchTab({ url: '/pages/index/index' })
  }
})

const sendCode = async () => {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  const success = await userStore.sendCode(phone.value, 'login')
  if (success) {
    codeTimer.value = 60
    const timer = setInterval(() => {
      codeTimer.value--
      if (codeTimer.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
}

const handleLogin = async () => {
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

  const success = await userStore.login(phone.value, code.value, password.value)
  if (success) {
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 500)
  }
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
$text: #1A202C;
$text-light: #718096;
$border: #E2E8F0;

.login-page {
  min-height: 100vh;
  background: $bg;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.header {
  padding: 140rpx 60rpx 80rpx;
  text-align: center;
  background: linear-gradient(180deg, $primary 0%, $primary-dark 100%);

  .logo-area {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24rpx;
    margin-bottom: 20rpx;

    .logo-icon {
      width: 96rpx;
      height: 96rpx;
      border-radius: 24rpx;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .app-name {
      font-size: 52rpx;
      font-weight: 700;
      color: $white;
      letter-spacing: 6rpx;
    }
  }

  .app-slogan {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 400;
  }
}

.form-area {
  flex: 1;
  padding: 0 44rpx;
  margin-top: -44rpx;
}

.form-card {
  background: $white;
  border-radius: 32rpx;
  padding: 60rpx 48rpx;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.06);
}

.input-group {
  margin-bottom: 40rpx;
}

.input-row {
  display: flex;
  align-items: center;
  background: $bg;
  border-radius: 20rpx;
  padding: 0 28rpx;
  height: 112rpx;
  border: 2rpx solid transparent;
  transition: border-color 0.25s ease;

  &:focus-within {
    border-color: $primary;
    background: $white;
    box-shadow: 0 0 0 4rpx rgba(49, 130, 206, 0.08);
  }
}

.input-prefix {
  font-size: 32rpx;
  color: $text;
  font-weight: 600;
  margin-right: 20rpx;
  letter-spacing: 1rpx;
}

.input-line {
  width: 2rpx;
  height: 44rpx;
  background: $border;
  margin-right: 24rpx;
}

.phone-input {
  flex: 1;
  height: 100%;
  font-size: 32rpx;
  color: $text;
  font-weight: 500;
  letter-spacing: 2rpx;
}

.code-input {
  flex: 1;
  height: 100%;
  font-size: 32rpx;
  color: $text;
  font-weight: 500;
  letter-spacing: 4rpx;
}

.code-btn {
  min-width: 200rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
  color: $white;
  border-radius: 16rpx;
  font-size: 26rpx;
  font-weight: 500;
  transition: all 0.25s ease;
  box-shadow: 0 4rpx 12rpx rgba(49, 130, 206, 0.25);

  &.active {
    background: linear-gradient(135deg, $border 0%, #CBD5E0 100%);
    color: $text-light;
    box-shadow: none;
  }
}

.password-input {
  flex: 1;
  height: 100%;
  font-size: 32rpx;
  color: $text;
  font-weight: 500;
}

.eye-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: $text-light;
}

.ph {
  color: $text-light;
  font-size: 30rpx;
  font-weight: 400;
}

.agreement-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin: 48rpx 0 44rpx;

  .check-box {
    width: 40rpx;
    height: 40rpx;
    border: 2rpx solid $border;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.25s ease;

    &.checked {
      background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
      border-color: $primary;
      box-shadow: 0 4rpx 12rpx rgba(49, 130, 206, 0.25);
    }

    .check-mark {
      font-size: 24rpx;
      color: $white;
      font-weight: 700;
    }
  }

  .agreement-text {
    font-size: 26rpx;
    color: $text-light;
    line-height: 1.6;
    font-weight: 400;
  }

  .link {
    color: $primary;
    font-weight: 500;
  }
}

.login-btn {
  width: 100%;
  height: 104rpx;
  background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
  color: $white;
  border: none;
  border-radius: 52rpx;
  font-size: 34rpx;
  font-weight: 600;
  letter-spacing: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 28rpx rgba(49, 130, 206, 0.35);
  transition: all 0.25s ease;

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 6rpx 16rpx rgba(49, 130, 206, 0.25);
  }

  &.loading {
    opacity: 0.8;
  }
}

.btn-loader {
  width: 44rpx;
  height: 44rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: $white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.bottom-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 36rpx;
  margin-top: 48rpx;

  .link-text {
    font-size: 28rpx;
    color: $primary;
    font-weight: 500;
    transition: opacity 0.25s ease;

    &:active {
      opacity: 0.7;
    }
  }

  .divider {
    color: $border;
    font-size: 24rpx;
  }
}

.third-party {
  padding: 72rpx 44rpx 60rpx;
  text-align: center;

  .third-title {
    display: block;
    font-size: 26rpx;
    color: $text-light;
    margin-bottom: 48rpx;
    font-weight: 500;
    position: relative;

    &::before, &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 120rpx;
      height: 1rpx;
      background: $border;
    }

    &::before {
      left: 50rpx;
    }

    &::after {
      right: 50rpx;
    }
  }

  .third-icons {
    display: flex;
    justify-content: center;
    gap: 96rpx;
  }

  .third-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;

    .third-icon {
      width: 104rpx;
      height: 104rpx;
      background: $white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
      transition: all 0.25s ease;

      &:active {
        transform: scale(0.95);
      }

      svg {
        width: 64rpx;
        height: 64rpx;
      }
    }

    .third-name {
      font-size: 24rpx;
      color: $text-light;
      font-weight: 500;
    }
  }
}
</style>