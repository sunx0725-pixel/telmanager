import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import AuthService from '@/services/auth'
import { mockNumbers, mockNotifications } from '@/data/mock'

// 配置是否使用Mock数据
const USE_MOCK = true

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const token = ref('')
  const loading = ref(false)
  const notifications = ref<any[]>([])

  // 发送验证码
  const sendCode = async (phone: string, type: string) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        // Mock逻辑
        await new Promise(resolve => setTimeout(resolve, 1000))
        uni.showToast({ title: '验证码已发送', icon: 'success' })
        return true
      }
      await AuthService.sendCode({ phone, type: type as any })
      uni.showToast({ title: '验证码已发送', icon: 'success' })
      return true
    } catch (error) {
      return false
    } finally {
      loading.value = false
    }
  }

  // 登录
  const login = async (phone: string, code: string, password: string) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        // Mock逻辑
        await new Promise(resolve => setTimeout(resolve, 1500))
        token.value = 'mock_token_' + Date.now()
        user.value = {
          id: '1',
          phone: phone,
          name: '用户昵称',
          avatar: '',
          realName: '张三',
          idCard: '110101199001011234',
          createdAt: '2026-01-01'
        }
        isLoggedIn.value = true
        uni.setStorageSync('token', token.value)
        uni.setStorageSync('user', JSON.stringify(user.value))
        return true
      }
      
      const res = await AuthService.login({ phone, code, password })
      token.value = res.data.token
      user.value = res.data.user
      isLoggedIn.value = true
      uni.setStorageSync('token', token.value)
      uni.setStorageSync('user', JSON.stringify(user.value))
      return true
    } catch (error) {
      return false
    } finally {
      loading.value = false
    }
  }

  // 退出登录
  const logout = async () => {
    try {
      if (!USE_MOCK) {
        await AuthService.logout()
      }
    } catch (e) {
      console.error(e)
    }
    
    token.value = ''
    user.value = null
    isLoggedIn.value = false
    uni.removeStorageSync('token')
    uni.removeStorageSync('user')
  }

  // 检查登录状态
  const checkLogin = () => {
    const storedToken = uni.getStorageSync('token')
    const storedUser = uni.getStorageSync('user')
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      isLoggedIn.value = true
    }
  }

  // 更新用户信息
  const updateUserInfo = (name: string, avatar: string) => {
    if (user.value) {
      user.value.name = name
      user.value.avatar = avatar
      uni.setStorageSync('user', JSON.stringify(user.value))
    }
  }

  // 获取通知列表
  const getNotifications = async () => {
    if (USE_MOCK) {
      notifications.value = mockNotifications
      return
    }
    // TODO: API调用
  }

  // 标记通知已读
  const markNotificationRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
    }
  }

  // 全部已读
  const markAllNotificationsRead = () => {
    notifications.value.forEach(n => n.isRead = true)
  }

  // 未读数量
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
  })

  return {
    user,
    isLoggedIn,
    token,
    loading,
    notifications,
    unreadCount,
    login,
    logout,
    checkLogin,
    updateUserInfo,
    sendCode,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
  }
})
