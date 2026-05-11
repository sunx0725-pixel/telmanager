import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PhoneNumber, BillItem } from '@/types'
import { mockNumbers, mockBills } from '@/data/mock'

export const useNumbersStore = defineStore('numbers', () => {
  const numbers = ref<PhoneNumber[]>(mockNumbers)
  const bills = ref<BillItem[]>(mockBills)

  const favoriteNumbers = computed(() => 
    numbers.value.filter(n => n.isFavorite).slice(0, 3)
  )

  const sortedByOperator = computed(() => {
    const cmcc = numbers.value.filter(n => n.operator === 'cmcc')
    const cucc = numbers.value.filter(n => n.operator === 'cucc')
    const ctcc = numbers.value.filter(n => n.operator === 'ctcc')
    return [...cmcc, ...cucc, ...ctcc]
  })

  const sortedByBalance = computed(() => 
    [...numbers.value].sort((a, b) => a.balance - b.balance)
  )

  const lowBalanceNumbers = computed(() => 
    numbers.value.filter(n => n.balance <= 10)
  )

  const expiringNumbers = computed(() => {
    const now = new Date()
    return numbers.value.filter(n => {
      const expireDate = new Date(n.packageExpireDate)
      const diffDays = Math.ceil((expireDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 3 && diffDays > 0
    })
  })

  const addNumber = (phone: string, operator: string, operatorName: string) => {
    if (numbers.value.length >= 5) {
      uni.showToast({ title: '最多添加5个号码', icon: 'none' })
      return false
    }
    
    const maskedPhone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    const newNumber: PhoneNumber = {
      id: Date.now().toString(),
      phone,
      maskedPhone,
      operator: operator as PhoneNumber['operator'],
      operatorName,
      balance: 0,
      dataRemaining: 0,
      callMinutes: 0,
      packageExpireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      remark: '',
      isFavorite: false,
      isFrozen: false,
      createdAt: new Date().toISOString().split('T')[0]
    }
    numbers.value.push(newNumber)
    return true
  }

  const removeNumber = (id: string) => {
    const index = numbers.value.findIndex(n => n.id === id)
    if (index > -1) {
      numbers.value.splice(index, 1)
    }
  }

  const updateNumber = (id: string, updates: Partial<PhoneNumber>) => {
    const index = numbers.value.findIndex(n => n.id === id)
    if (index > -1) {
      numbers.value[index] = { ...numbers.value[index], ...updates }
    }
  }

  const toggleFavorite = (id: string) => {
    const number = numbers.value.find(n => n.id === id)
    if (number) {
      if (number.isFavorite) {
        number.isFavorite = false
      } else {
        const favoriteCount = numbers.value.filter(n => n.isFavorite).length
        if (favoriteCount >= 3) {
          uni.showToast({ title: '最多设置3个常用号码', icon: 'none' })
          return
        }
        number.isFavorite = true
      }
    }
  }

  const freezeNumber = (id: string) => {
    const number = numbers.value.find(n => n.id === id)
    if (number) {
      number.isFrozen = true
    }
  }

  const unfreezeNumber = (id: string) => {
    const number = numbers.value.find(n => n.id === id)
    if (number) {
      number.isFrozen = false
    }
  }

  const getBillsByPhoneId = (phoneId: string, months: number = 3) => {
    const now = new Date()
    const validMonths: string[] = []
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      validMonths.push(date.toISOString().slice(0, 7))
    }
    return bills.value.filter(b => b.phoneId === phoneId && validMonths.includes(b.month))
  }

  const getNumberById = (id: string) => {
    return numbers.value.find(n => n.id === id)
  }

  return {
    numbers,
    bills,
    favoriteNumbers,
    sortedByOperator,
    sortedByBalance,
    lowBalanceNumbers,
    expiringNumbers,
    addNumber,
    removeNumber,
    updateNumber,
    toggleFavorite,
    freezeNumber,
    unfreezeNumber,
    getBillsByPhoneId,
    getNumberById
  }
})