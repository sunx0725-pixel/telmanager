import request from '@/utils/request'
import { OPERATOR_API_CONFIG } from '@/config'
import type { PhoneNumber, BillItem, RechargeRecord, Invoice } from '@/types'

// 运营商类型
type Operator = 'cmcc' | 'cucc' | 'ctcc'

interface VerifyNumberParams {
  phone: string
  operator: Operator
  idCard: string
  realName: string
}

interface QueryBalanceParams {
  phone: string
  operator: Operator
}

interface QueryBillParams {
  phone: string
  operator: Operator
  month: string
}

interface RechargeParams {
  phone: string
  operator: Operator
  amount: number
  method: 'wechat' | 'alipay'
}

interface QueryInvoiceParams {
  phone: string
  operator: Operator
  billMonth: string
}

interface CreateInvoiceParams {
  phone: string
  operator: Operator
  billMonth: string
  type: 'recharge' | 'monthly'
  title: string
  taxNumber?: string
  email: string
}

export class OperatorService {
  /**
   * 验证号码归属人
   * 用于添加号码时验证
   */
  static async verifyNumber(params: VerifyNumberParams) {
    return request.post('/operator/verify', params)
  }

  /**
   * 查询号码余额和套餐信息
   */
  static async queryNumberInfo(phone: string, operator: Operator) {
    return request.post('/operator/info', { phone, operator })
  }

  /**
   * 查询余额
   */
  static async queryBalance(params: QueryBalanceParams) {
    return request.post('/operator/balance', params)
  }

  /**
   * 查询账单
   */
  static async queryBills(params: QueryBillParams) {
    return request.post('/operator/bills', params)
  }

  /**
   * 充值
   */
  static async recharge(params: RechargeParams) {
    return request.post('/operator/recharge', params)
  }

  /**
   * 查询充值结果
   */
  static async queryRechargeResult(orderNo: string, operator: Operator) {
    return request.post('/operator/recharge/query', { orderNo, operator })
  }

  /**
   * 查询可开票账单
   */
  static async queryAvailableInvoices(params: QueryInvoiceParams) {
    return request.post('/operator/invoices/available', params)
  }

  /**
   * 申请开具发票
   */
  static async createInvoice(params: CreateInvoiceParams) {
    return request.post('/operator/invoices/create', params)
  }

  /**
   * 下载发票PDF
   */
  static async downloadInvoice(invoiceId: string, operator: Operator) {
    return request.post('/operator/invoices/download', { invoiceId, operator })
  }

  /**
   * 查询套餐信息
   */
  static async queryPackageInfo(phone: string, operator: Operator) {
    return request.post('/operator/package', { phone, operator })
  }

  /**
   * 同步号码数据（后台定时任务用）
   */
  static async syncNumberData(phone: string, operator: Operator) {
    return request.post('/operator/sync', { phone, operator })
  }
}

export default OperatorService
