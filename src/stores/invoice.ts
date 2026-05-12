import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Invoice } from '@/types'
import { mockInvoices } from '@/data/mock'
import InvoiceService from '@/services/invoice'

const USE_MOCK = true

export const useInvoiceStore = defineStore('invoice', () => {
  const invoices = ref<Invoice[]>([])
  const loading = ref(false)
  const selectedInvoice = ref<Invoice | null>(null)
  const availableBills = ref<any[]>([])

  // 按时间排序
  const sortedByTime = computed(() => {
    return [...invoices.value].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  // 未开具发票
  const unissuedInvoices = computed(() => {
    return invoices.value.filter(i => i.status === 'unissued')
  })

  // 已开具发票
  const issuedInvoices = computed(() => {
    return invoices.value.filter(i => i.status === 'issued')
  })

  // 获取发票列表
  const fetchInvoices = async (params: any = {}) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500))
        invoices.value = [...mockInvoices]
        return
      }
      const res = await InvoiceService.getInvoices(params)
      invoices.value = res.data
    } catch (error) {
      console.error('获取发票列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 同步发票
  const syncInvoices = async () => {
    await fetchInvoices()
    uni.showToast({ title: '同步成功', icon: 'success' })
  }

  // 获取发票详情
  const getInvoiceDetail = async (id: string) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300))
        selectedInvoice.value = invoices.value.find(i => i.id === id) || null
        return
      }
      const res = await InvoiceService.getInvoiceDetail(id)
      selectedInvoice.value = res.data
    } catch (error) {
      console.error('获取发票详情失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 获取可开票账单
  const getAvailableBills = async (params: any) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300))
        availableBills.value = [
          { id: '1', type: 'monthly', month: '2026-04', amount: 128 },
          { id: '2', type: 'recharge', month: '2026-05', amount: 100 },
          { id: '3', type: 'recharge', month: '2026-05', amount: 50 }
        ]
        return
      }
      const res = await InvoiceService.getAvailableBills(params)
      availableBills.value = res.data
    } catch (error) {
      console.error('获取可开票账单失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 开具发票
  const createInvoice = async (params: any) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        const newInvoice: Invoice = {
          id: String(Date.now()),
          phoneId: params.phoneId,
          phone: params.phone || '138****5678',
          type: params.type,
          typeName: params.type === 'recharge' ? '充值发票' : '月结发票',
          amount: params.amount,
          status: 'issued',
          statusName: '已开具',
          billMonth: params.billMonth,
          invoiceNo: 'FP' + Date.now(),
          pdfUrl: '#',
          createdAt: new Date().toISOString().split('T')[0]
        }
        invoices.value.unshift(newInvoice)
        uni.showToast({ title: '开票成功', icon: 'success' })
        return { success: true }
      }
      
      await InvoiceService.createInvoice(params)
      await fetchInvoices()
      uni.showToast({ title: '开票成功', icon: 'success' })
      return { success: true }
    } catch (error) {
      uni.showToast({ title: '开票失败', icon: 'none' })
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  // 下载发票
  const downloadInvoice = async (id: string) => {
    try {
      if (USE_MOCK) {
        uni.showToast({ title: '已开始下载', icon: 'success' })
        return
      }
      await InvoiceService.downloadInvoice(id)
    } catch (error) {
      uni.showToast({ title: '下载失败', icon: 'none' })
    }
  }

  // 转发发票
  const forwardInvoice = async (id: string, email: string) => {
    loading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500))
        uni.showToast({ title: '已发送到 ' + email, icon: 'success' })
        return
      }
      await InvoiceService.forwardInvoice(id, email)
      uni.showToast({ title: '已发送', icon: 'success' })
    } catch (error) {
      uni.showToast({ title: '发送失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }

  // 根据ID获取发票
  const getInvoiceById = (id: string) => {
    return invoices.value.find(i => i.id === id) || null
  }

  return {
    invoices,
    loading,
    selectedInvoice,
    availableBills,
    sortedByTime,
    unissuedInvoices,
    issuedInvoices,
    fetchInvoices,
    syncInvoices,
    getInvoiceDetail,
    getInvoiceById,
    getAvailableBills,
    createInvoice,
    downloadInvoice,
    forwardInvoice
  }
})
