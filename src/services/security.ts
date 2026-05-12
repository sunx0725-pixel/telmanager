import request from '@/utils/request'
import type { SecurityLog } from '@/types'

interface QueryLogsParams {
  page?: number
  pageSize?: number
  type?: string
  startDate?: string
  endDate?: string
}

export class SecurityService {
  /**
   * 获取安全日志列表
   */
  static async getSecurityLogs(params: QueryLogsParams = {}) {
    return request.get<SecurityLog[]>('/security/logs', params)
  }

  /**
   * 获取设备信息
   */
  static async getDeviceList() {
    return request.get('/security/devices')
  }

  /**
   * 删除设备登录记录
   */
  static async removeDevice(deviceId: string) {
    return request.post('/security/devices/remove', { deviceId })
  }

  /**
   * 获取登录位置
   */
  static async getLoginLocations() {
    return request.get('/security/locations')
  }

  /**
   * 设置常用登录地
   */
  static async setTrustedLocation(locationId: string) {
    return request.post('/security/locations/trusted', { locationId })
  }

  /**
   * 获取安全设置
   */
  static async getSecuritySettings() {
    return request.get('/security/settings')
  }

  /**
   * 修改安全设置
   */
  static async updateSecuritySettings(settings: any) {
    return request.post('/security/settings/update', settings)
  }

  /**
   * 二次验证
   */
  static async verifySecondFactor(code: string, type: string) {
    return request.post('/security/verify', { code, type })
  }

  /**
   * 获取异常告警
   */
  static async getAlerts() {
    return request.get('/security/alerts')
  }

  /**
   * 标记告警已读
   */
  static async markAlertRead(alertId: string) {
    return request.post(`/security/alerts/${alertId}/read`)
  }
}

export default SecurityService
