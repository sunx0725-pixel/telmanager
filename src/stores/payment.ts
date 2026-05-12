import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RechargeRecord } from '@/types'
import { mockRechargeRecords } from '@/data/mock'
import PaymentService from '@/services/payment'
import { useNumbersStore } from './numbers'

const USE_MOCK = true

export const usePaymentStore = defineStore('payment', () => {
  const records = ref<RechargeRecord[]>([])
  const loading = ref(false)
  const orderInfo = ref<any>(null)

  // 获取充值记录
  const fetchRecords = async (params: any = {}) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500))
        records.value = [...mockRechargeRecords]
        return
      }
      const res = await PaymentService.getRecords(params)
      records.value = res.data
    } catch (error) {
      console.error('获取充值记录失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 创建充值订单
  const createOrder = async (params: any) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 800))
        const newRecord: RechargeRecord = {
          id: String(Date.now()),
          phoneId: params.phoneId,
          phone: params.phone,
          amount: params.amount,
          method: params.method,
          methodName: params.method === 'wechat' ? '微信支付' : '支付宝',
          status: 'success',
          statusName: '充值成功',
          orderNo: 'ORDER' + Date.now(),
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
        records.value.unshift(newRecord)
        orderInfo.value = newRecord
        uni.showToast({ title: '充值成功', icon: 'success' })
        return { success: true, orderNo: newRecord.orderNo }
      }
      
      const res = await PaymentService.createOrder(params)
      orderInfo.value = res.data
      return { success: true, ...res.data }
    } catch (error) {
      uni.showToast({ title: '充值失败', icon: 'none' })
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  // 创建充值（兼容旧方法名）
  const createRecharge = async (phoneId: string, phone: string, amount: number, method: 'wechat' | 'alipay') => {
    const numbersStore = useNumbersStore()
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        const newRecord: RechargeRecord = {
          id: String(Date.now()),
          phoneId,
          phone,
          amount,
          method,
          methodName: method === 'wechat' ? '微信支付' : '支付宝',
          status: 'success',
          statusName: '充值成功',
          orderNo: 'ORDER' + Date.now(),
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
        records.value.unshift(newRecord)
        orderInfo.value = newRecord

        // 更新号码余额
        const number = numbersStore.getNumberById(phoneId)
        if (number) {
          number.balance += amount
        }

        return { success: true, orderNo: newRecord.orderNo }
      }
      
      const res = await PaymentService.createOrder({ phoneId, phone, amount, method })
      orderInfo.value = res.data
      return { success: true, ...res.data }
    } catch (error) {
      uni.showToast({ title: '充值失败', icon: 'none' })
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  // 重试支付
  const retryPayment = async (orderNo: string) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const record = records.value.find(r => r.orderNo === orderNo)
        if (record) {
          record.status = 'success'
          record.statusName = '充值成功'
        }
        uni.showToast({ title: '充值成功', icon: 'success' })
        return true
      }
      
      await PaymentService.retryOrder(orderNo)
      await fetchRecords()
      return true
    } catch (error) {
      uni.showToast({ title: '重试失败', icon: 'none' })
      return false
    } finally {
      loading.value = false
    }
  }

  // 查询订单状态
  const queryOrder = async (orderNo: string) => {
    try {
      if (USE_MOCK) {
        return records.value.find(r => r.orderNo === orderNo)
      }
      const res = await PaymentService.queryOrder(orderNo)
      return res.data
    } catch (error) {
      console.error('查询订单失败:', error)
      return null
    }
  }

  // 按时间排序的记录
  const sortedByTime = computed(() => {
    return [...records.value].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  // 根据号码ID筛选记录
  const filterByPhone = (phoneId: string) => {
    return records.value.filter(r => r.phoneId === phoneId)
  }

  return {
    records,
    loading,
    orderInfo,
    sortedByTime,
    fetchRecords,
    createOrder,
    createRecharge,
    retryPayment,
    queryOrder,
    filterByPhone
  }
})
