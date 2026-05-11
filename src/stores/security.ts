import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SecurityLog, Notification } from '@/types'
import { mockSecurityLogs, mockNotifications } from '@/data/mock'

export const useSecurityStore = defineStore('security', () => {
  const logs = ref<SecurityLog[]>(mockSecurityLogs)
  const notifications = ref<Notification[]>(mockNotifications)

  const sortedLogs = computed(() => 
    [...logs.value].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  )

  const sortedNotifications = computed(() => 
    [...notifications.value].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  )

  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.isRead).length
  )

  const abnormalLogs = computed(() => 
    logs.value.filter(l => l.isAbnormal)
  )

  const addLog = (type: SecurityLog['type'], device: string, location: string, ip: string, isAbnormal: boolean = false) => {
    const typeNames: Record<string, string> = {
      login: '登录',
      recharge: '充值',
      invoice: '开具发票',
      addNumber: '添加号码',
      freeze: '号码冻结'
    }
    const newLog: SecurityLog = {
      id: Date.now().toString(),
      type,
      typeName: typeNames[type],
      device,
      location,
      ip,
      isAbnormal,
      createdAt: new Date().toLocaleString('zh-CN')
    }
    logs.value.unshift(newLog)
  }

  const addNotification = (type: Notification['type'], content: string, phone?: string) => {
    const typeNames: Record<string, string> = {
      balance: '余额提醒',
      expire: '套餐到期',
      recharge: '充值成功',
      invoice: '发票开具',
      login: '异地登录'
    }
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      typeName: typeNames[type],
      content,
      phone,
      isRead: false,
      createdAt: new Date().toLocaleString('zh-CN')
    }
    notifications.value.unshift(newNotification)
  }

  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.isRead = true)
  }

  return {
    logs,
    notifications,
    sortedLogs,
    sortedNotifications,
    unreadCount,
    abnormalLogs,
    addLog,
    addNotification,
    markAsRead,
    markAllAsRead
  }
})