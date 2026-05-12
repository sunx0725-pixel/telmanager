import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SecurityLog } from '@/types'
import { mockSecurityLogs } from '@/data/mock'
import SecurityService from '@/services/security'

const USE_MOCK = true

export const useSecurityStore = defineStore('security', () => {
  const logs = ref<SecurityLog[]>([])
  const loading = ref(false)

  // 按时间排序的日志
  const sortedLogs = computed(() => {
    return [...logs.value].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  // 获取安全日志
  const fetchLogs = async (params: any = {}) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500))
        logs.value = [...mockSecurityLogs]
        return
      }
      const res = await SecurityService.getSecurityLogs(params)
      logs.value = res.data
    } catch (error) {
      console.error('获取安全日志失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 二次验证
  const verify = async (code: string, type: string) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return { success: true }
      }
      await SecurityService.verifySecondFactor(code, type)
      return { success: true }
    } catch (error) {
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  return {
    logs,
    loading,
    sortedLogs,
    fetchLogs,
    verify
  }
})
