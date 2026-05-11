import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Invoice } from '@/types'
import { mockInvoices } from '@/data/mock'

export const useInvoiceStore = defineStore('invoice', () => {
  const invoices = ref<Invoice[]>(mockInvoices)

  const sortedByTime = computed(() => 
    [...invoices.value].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  )

  const unissuedInvoices = computed(() => 
    invoices.value.filter(i => i.status === 'unissued')
  )

  const issuedInvoices = computed(() => 
    invoices.value.filter(i => i.status === 'issued')
  )

  const filterByPhone = (phoneId: string) => {
    return invoices.value.filter(i => i.phoneId === phoneId)
  }

  const createInvoice = (invoiceId: string, header: string, taxNo: string, email: string) => {
    const invoice = invoices.value.find(i => i.id === invoiceId)
    if (invoice && invoice.status === 'unissued') {
      invoice.status = 'issued'
      invoice.statusName = '已开具'
      invoice.invoiceNo = 'FP' + Date.now().toString().slice(-10)
      invoice.pdfUrl = '#'
      
      uni.showToast({ title: '发票开具成功', icon: 'success' })
      return true
    }
    return false
  }

  const syncInvoices = () => {
    uni.showLoading({ title: '同步中...' })
    setTimeout(() => {
      uni.hideLoading()
      uni.showToast({ title: '同步成功', icon: 'success' })
    }, 1500)
  }

  const getInvoiceById = (id: string) => {
    return invoices.value.find(i => i.id === id)
  }

  return {
    invoices,
    sortedByTime,
    unissuedInvoices,
    issuedInvoices,
    filterByPhone,
    createInvoice,
    syncInvoices,
    getInvoiceById
  }
})