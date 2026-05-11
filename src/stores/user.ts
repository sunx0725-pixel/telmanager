import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const token = ref('')

  const login = (phone: string, code: string) => {
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
  }

  const logout = () => {
    token.value = ''
    user.value = null
    isLoggedIn.value = false
    uni.removeStorageSync('token')
    uni.removeStorageSync('user')
  }

  const checkLogin = () => {
    const storedToken = uni.getStorageSync('token')
    const storedUser = uni.getStorageSync('user')
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      isLoggedIn.value = true
    }
  }

  const updateUserInfo = (name: string, avatar: string) => {
    if (user.value) {
      user.value.name = name
      user.value.avatar = avatar
      uni.setStorageSync('user', JSON.stringify(user.value))
    }
  }

  return {
    user,
    isLoggedIn,
    token,
    login,
    logout,
    checkLogin,
    updateUserInfo
  }
})