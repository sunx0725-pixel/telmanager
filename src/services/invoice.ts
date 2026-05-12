import request from '@/utils/request'
import type { Invoice } from '@/types'

interface QueryInvoiceParams {
  page?: number
  pageSize?: number
  phoneId?: string
  status?: 'unissued' | 'issued'
  startDate?: string
  endDate?: string
}

interface CreateInvoiceParams {
  phoneId: string
  type: 'recharge' | 'monthly'
  billMonth: string
  title: string
  titleType: 'personal' | 'company'
  taxNumber?: string
  email: string
  phone?: string
}

interface QueryAvailableParams {
  phoneId: string
  type?: 'recharge' | 'monthly'
}

export class InvoiceService {
  /**
   * 获取发票列表
   */
  static async getInvoices(params: QueryInvoiceParams = {}) {
    return request.get<Invoice[]>('/invoice/list', params)
  }

  /**
   * 获取发票详情
   */
  static async getInvoiceDetail(id: string) {
    return request.get<Invoice>(`/invoice/detail/${id}`)
  }

  /**
   * 查询可开票账单
   */
  static async getAvailableBills(params: QueryAvailableParams) {
    return request.get('/invoice/available', params)
  }

  /**
   * 申请开具发票
   */
  static async createInvoice(params: CreateInvoiceParams) {
    return request.post('/invoice/create', params)
  }

  /**
   * 下载发票PDF
   */
  static async downloadInvoice(id: string) {
    return request.get(`/invoice/download/${id}`)
  }

  /**
   * 重新发送发票邮件
   */
  static async resendInvoice(id: string) {
    return request.post(`/invoice/resend/${id}`)
  }

  /**
   * 转发发票
   */
  static async forwardInvoice(id: string, email: string) {
    return request.post(`/invoice/forward/${id}`, { email })
  }

  /**
   * 批量开具发票
   */
  static async batchCreateInvoice(ids: string[], commonParams: Partial<CreateInvoiceParams>) {
    return request.post('/invoice/batch-create', { ids, ...commonParams })
  }

  /**
   * 获取发票设置
   */
  static async getInvoiceSettings() {
    return request.get('/invoice/settings')
  }

  /**
   * 保存发票抬头
   */
  static async saveInvoiceTitle(titleInfo: any) {
    return request.post('/invoice/save-title', titleInfo)
  }

  /**
   * 获取已保存的发票抬头
   */
  static async getSavedTitles() {
    return request.get('/invoice/titles')
  }
}

export default InvoiceService
