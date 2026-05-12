import request from '@/utils/request'
import type { RechargeRecord } from '@/types'

interface RechargeParams {
  phoneId: string
  phone: string
  amount: number
  method: 'wechat' | 'alipay'
}

interface QueryOrderParams {
  page?: number
  pageSize?: number
  phoneId?: string
  status?: string
  startDate?: string
  endDate?: string
}

interface CreatePaymentParams {
  orderNo: string
  method: 'wechat' | 'alipay'
}

export class PaymentService {
  /**
   * 创建充值订单
   */
  static async createOrder(params: RechargeParams) {
    return request.post('/payment/create', params)
  }

  /**
   * 获取支付参数
   */
  static async getPaymentParams(params: CreatePaymentParams) {
    return request.post('/payment/params', params)
  }

  /**
   * 查询订单状态
   */
  static async queryOrder(orderNo: string) {
    return request.get(`/payment/query/${orderNo}`)
  }

  /**
   * 取消订单
   */
  static async cancelOrder(orderNo: string) {
    return request.post('/payment/cancel', { orderNo })
  }

  /**
   * 重试支付
   */
  static async retryOrder(orderNo: string) {
    return request.post('/payment/retry', { orderNo })
  }

  /**
   * 获取充值记录列表
   */
  static async getRecords(params: QueryOrderParams = {}) {
    return request.get<RechargeRecord[]>('/payment/records', params)
  }

  /**
   * 获取充值记录详情
   */
  static async getRecordDetail(id: string) {
    return request.get<RechargeRecord>(`/payment/records/${id}`)
  }

  /**
   * 微信支付回调处理
   */
  static async handleWechatCallback(data: any) {
    return request.post('/payment/wechat/callback', data, false)
  }

  /**
   * 支付宝支付回调处理
   */
  static async handleAlipayCallback(data: any) {
    return request.post('/payment/alipay/callback', data, false)
  }

  /**
   * 获取充值配置（最低金额、固定选项等）
   */
  static async getConfig() {
    return request.get('/payment/config')
  }
}

export default PaymentService
