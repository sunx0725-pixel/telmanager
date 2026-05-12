import request from '@/utils/request'
import type { PhoneNumber, BillItem, PackageInfo } from '@/types'

interface AddNumberParams {
  phone: string
  operator: 'cmcc' | 'cucc' | 'ctcc'
  remark?: string
}

interface UpdateNumberParams {
  id: string
  remark?: string
  isFavorite?: boolean
}

export class NumberService {
  /**
   * 获取号码列表
   */
  static async getNumberList() {
    return request.get<PhoneNumber[]>('/numbers/list')
  }

  /**
   * 添加号码
   */
  static async addNumber(params: AddNumberParams) {
    return request.post('/numbers/add', params)
  }

  /**
   * 获取号码详情
   */
  static async getNumberDetail(id: string) {
    return request.get<PhoneNumber>(`/numbers/detail/${id}`)
  }

  /**
   * 更新号码信息
   */
  static async updateNumber(params: UpdateNumberParams) {
    return request.put('/numbers/update', params)
  }

  /**
   * 删除号码
   */
  static async deleteNumber(id: string, password: string) {
    return request.post('/numbers/delete', { id, password })
  }

  /**
   * 冻结号码
   */
  static async freezeNumber(id: string) {
    return request.post('/numbers/freeze', { id })
  }

  /**
   * 解冻号码
   */
  static async unfreezeNumber(id: string, code: string) {
    return request.post('/numbers/unfreeze', { id, code })
  }

  /**
   * 设置常用号码
   */
  static async setFavorite(id: string, isFavorite: boolean) {
    return request.post('/numbers/favorite', { id, isFavorite })
  }

  /**
   * 获取号码账单
   */
  static async getNumberBills(id: string, month?: string) {
    return request.get<BillItem[]>(`/numbers/${id}/bills`, { month })
  }

  /**
   * 获取套餐信息
   */
  static async getPackageInfo(id: string) {
    return request.get<PackageInfo>(`/numbers/${id}/package`)
  }

  /**
   * 同步号码数据
   */
  static async syncNumber(id: string) {
    return request.post(`/numbers/${id}/sync`)
  }

  /**
   * 批量同步所有号码
   */
  static async syncAllNumbers() {
    return request.post('/numbers/sync-all')
  }
}

export default NumberService
