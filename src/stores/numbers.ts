import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PhoneNumber, BillItem, PackageInfo } from '@/types'
import { mockNumbers, mockBills, packageList, operatorMap } from '@/data/mock'
import NumberService from '@/services/numbers'
import OperatorService from '@/services/operator'
import CryptoUtils from '@/utils/crypto'

const USE_MOCK = true

export const useNumbersStore = defineStore('numbers', () => {
  const numbers = ref<PhoneNumber[]>([])
  const selectedNumber = ref<PhoneNumber | null>(null)
  const bills = ref<BillItem[]>([])
  const packageInfo = ref<PackageInfo | null>(null)
  const loading = ref(false)

  // 获取号码列表
  const fetchNumbers = async () => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500))
        numbers.value = [...mockNumbers]
        return
      }
      const res = await NumberService.getNumberList()
      numbers.value = res.data
    } catch (error) {
      console.error('获取号码列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 添加号码
  const addNumber = async (phone: string, operator: 'cmcc' | 'cucc' | 'ctcc', remark?: string) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const operatorInfo = operatorMap[operator]
        const newNumber: PhoneNumber = {
          id: String(Date.now()),
          phone,
          maskedPhone: CryptoUtils.maskPhone(phone),
          operator,
          operatorName: operatorInfo.name,
          balance: 50,
          dataRemaining: 10,
          callMinutes: 300,
          packageExpireDate: '2026-12-31',
          remark: remark || '',
          isFavorite: false,
          isFrozen: false,
          createdAt: new Date().toISOString().split('T')[0]
        }
        numbers.value.push(newNumber)
        uni.showToast({ title: '添加成功', icon: 'success' })
        return true
      }
      
      await NumberService.addNumber({ phone, operator, remark })
      await fetchNumbers()
      uni.showToast({ title: '添加成功', icon: 'success' })
      return true
    } catch (error) {
      return false
    } finally {
      loading.value = false
    }
  }

  // 删除号码
  const deleteNumber = async (id: string, password: string) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500))
        numbers.value = numbers.value.filter(n => n.id !== id)
        uni.showToast({ title: '删除成功', icon: 'success' })
        return true
      }
      
      await NumberService.deleteNumber(id, password)
      await fetchNumbers()
      uni.showToast({ title: '删除成功', icon: 'success' })
      return true
    } catch (error) {
      return false
    } finally {
      loading.value = false
    }
  }

  // 更新号码信息
  const updateNumber = async (id: string, params: { remark?: string; isFavorite?: boolean }) => {
    try {
      if (USE_MOCK) {
        const number = numbers.value.find(n => n.id === id)
        if (number) {
          if (params.remark !== undefined) number.remark = params.remark
          if (params.isFavorite !== undefined) number.isFavorite = params.isFavorite
        }
        return
      }
      
      await NumberService.updateNumber({ id, ...params })
      await fetchNumbers()
    } catch (error) {
      console.error('更新号码失败:', error)
    }
  }

  // 冻结号码
  const freezeNumber = async (id: string) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const number = numbers.value.find(n => n.id === id)
        if (number) {
          number.isFrozen = true
        }
        uni.showToast({ title: '已冻结', icon: 'success' })
        return true
      }
      
      await NumberService.freezeNumber(id)
      await fetchNumbers()
      uni.showToast({ title: '已冻结', icon: 'success' })
      return true
    } catch (error) {
      return false
    } finally {
      loading.value = false
    }
  }

  // 解冻号码
  const unfreezeNumber = async (id: string, code: string) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const number = numbers.value.find(n => n.id === id)
        if (number) {
          number.isFrozen = false
        }
        uni.showToast({ title: '已解冻', icon: 'success' })
        return true
      }
      
      await NumberService.unfreezeNumber(id, code)
      await fetchNumbers()
      uni.showToast({ title: '已解冻', icon: 'success' })
      return true
    } catch (error) {
      return false
    } finally {
      loading.value = false
    }
  }

  // 获取号码详情
  const getNumberDetail = async (id: string) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300))
        selectedNumber.value = numbers.value.find(n => n.id === id) || null
        return
      }
      const res = await NumberService.getNumberDetail(id)
      selectedNumber.value = res.data
    } catch (error) {
      console.error('获取详情失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 获取账单
  const getBills = async (id: string, month?: string) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 400))
        bills.value = mockBills.filter(b => b.phoneId === id)
        return
      }
      const res = await NumberService.getNumberBills(id, month)
      bills.value = res.data
    } catch (error) {
      console.error('获取账单失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 获取套餐信息
  const getPackageInfo = async (id: string) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300))
        packageInfo.value = packageList[0]
        return
      }
      const res = await NumberService.getPackageInfo(id)
      packageInfo.value = res.data
    } catch (error) {
      console.error('获取套餐失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 切换常用号码
  const toggleFavorite = (id: string) => {
    const number = numbers.value.find(n => n.id === id)
    if (number) {
      number.isFavorite = !number.isFavorite
    }
  }

  // 删除号码（兼容方法）
  const removeNumber = async (id: string) => {
    return await deleteNumber(id, '')
  }

  // 同步单个号码
  const syncNumber = async (id: string) => {
    uni.showLoading({ title: '同步中...' })
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const number = numbers.value.find(n => n.id === id)
        if (number) {
          number.balance = Math.max(0, number.balance + Math.random() * 10 - 5)
        }
        uni.showToast({ title: '同步成功', icon: 'success' })
        return
      }
      await NumberService.syncNumber(id)
      await fetchNumbers()
      uni.showToast({ title: '同步成功', icon: 'success' })
    } catch (error) {
      uni.showToast({ title: '同步失败', icon: 'none' })
    } finally {
      uni.hideLoading()
    }
  }

  // 常用号码
  const favoriteNumbers = computed(() => {
    return numbers.value.filter(n => n.isFavorite)
  })

  // 余额不足的号码
  const lowBalanceNumbers = computed(() => {
    return numbers.value.filter(n => n.balance <= 10)
  })

  // 套餐即将到期的号码
  const expiringNumbers = computed(() => {
    const today = new Date()
    return numbers.value.filter(n => {
      const expireDate = new Date(n.packageExpireDate)
      const diff = expireDate.getTime() - today.getTime()
      const days = diff / (1000 * 60 * 60 * 24)
      return days <= 3 && days > 0
    })
  })

  // 按运营商排序的号码
  const sortedByOperator = computed(() => {
    return [...numbers.value].sort((a, b) => a.operator.localeCompare(b.operator))
  })

  // 按余额排序的号码
  const sortedByBalance = computed(() => {
    return [...numbers.value].sort((a, b) => a.balance - b.balance)
  })

  // 根据ID获取号码
  const getNumberById = (id: string) => {
    return numbers.value.find(n => n.id === id) || null
  }

  // 根据号码ID获取账单
  const getBillsByPhoneId = (id: string) => {
    return bills.value.filter(b => b.phoneId === id)
  }

  return {
    numbers,
    selectedNumber,
    bills,
    packageInfo,
    loading,
    favoriteNumbers,
    lowBalanceNumbers,
    expiringNumbers,
    sortedByOperator,
    sortedByBalance,
    fetchNumbers,
    addNumber,
    deleteNumber,
    removeNumber,
    updateNumber,
    freezeNumber,
    unfreezeNumber,
    getNumberDetail,
    getBills,
    getPackageInfo,
    syncNumber,
    getNumberById,
    getBillsByPhoneId,
    toggleFavorite
  }
})
