import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RechargeRecord } from '@/types'
import { mockRechargeRecords } from '@/data/mock'

export const usePaymentStore = defineStore('payment', () => {
  const records = ref<RechargeRecord[]>(mockRechargeRecords)

  const sortedByTime = computed(() => 
    [...records.value].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  )

  const filterByPhone = (phoneId: string) => {
    return records.value.filter(r => r.phoneId === phoneId)
  }

  const filterByStatus = (status: string) => {
    return records.value.filter(r => r.status === status)
  }

  const createRecharge = (phoneId: string, phone: string, amount: number, method: 'wechat' | 'alipay') => {
    const newRecord: RechargeRecord = {
      id: Date.now().toString(),
      phoneId,
      phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      amount,
      method,
      methodName: method === 'wechat' ? '微信支付' : '支付宝',
      status: 'pending',
      statusName: '待支付',
      orderNo: '2026' + Date.now().toString().slice(-8),
      createdAt: new Date().toLocaleString('zh-CN')
    }
    records.value.unshift(newRecord)

    setTimeout(() => {
      const record = records.value.find(r => r.id === newRecord.id)
      if (record) {
        const success = Math.random() > 0.1
        record.status = success ? 'success' : 'failed'
        record.statusName = success ? '充值成功' : '充值失败'
      }
    }, 3000)

    return newRecord
  }

  const retryRecharge = (id: string) => {
    const record = records.value.find(r => r.id === id)
    if (record && record.status === 'failed') {
      record.status = 'pending'
      record.statusName = '待支付'
      
      setTimeout(() => {
        const success = Math.random() > 0.1
        record.status = success ? 'success' : 'failed'
        record.statusName = success ? '充值成功' : '充值失败'
      }, 3000)
    }
  }

  const getRecordById = (id: string) => {
    return records.value.find(r => r.id === id)
  }

  return {
    records,
    sortedByTime,
    filterByPhone,
    filterByStatus,
    createRecharge,
    retryRecharge,
    getRecordById
  }
})