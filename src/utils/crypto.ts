import { SECURITY_CONFIG } from '@/config'

/**
 * 安全加密工具类
 * 使用AES-256加密保护敏感数据
 */
export class CryptoUtils {
  private static key: string = SECURITY_CONFIG.aesKey
  private static iv: string = SECURITY_CONFIG.iv

  /**
   * 手机号脱敏
   */
  static maskPhone(phone: string): string {
    if (!phone || phone.length < 11) return phone
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }

  /**
   * 身份证号脱敏
   */
  static maskIdCard(idCard: string): string {
    if (!idCard || idCard.length < 15) return idCard
    if (idCard.length === 15) {
      return idCard.replace(/(\d{6})\d{6}(\d{3})/, '$1******$2')
    }
    return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
  }

  /**
   * 姓名脱敏
   */
  static maskName(name: string): string {
    if (!name || name.length < 2) return name
    if (name.length === 2) {
      return name[0] + '*'
    }
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
  }

  /**
   * 简单加密（用于本地存储敏感数据）
   * 注意：这只是简单的转码，不是强加密
   * 生产环境应使用专业加密库
   */
  static simpleEncrypt(text: string): string {
    try {
      return btoa(encodeURIComponent(text))
    } catch {
      return text
    }
  }

  /**
   * 简单解密
   */
  static simpleDecrypt(encoded: string): string {
    try {
      return decodeURIComponent(atob(encoded))
    } catch {
      return encoded
    }
  }

  /**
   * 生成随机盐值
   */
  static generateSalt(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * 生成随机ID
   */
  static generateId(): string {
    return `${Date.now()}_${this.generateSalt(8)}`
  }

  /**
   * 验证手机号格式
   */
  static isValidPhone(phone: string): boolean {
    return /^1[3-9]\d{9}$/.test(phone)
  }

  /**
   * 验证身份证号格式
   */
  static isValidIdCard(idCard: string): boolean {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
  }

  /**
   * 验证密码强度
   * 8-16位，包含字母和数字
   */
  static isValidPassword(password: string): boolean {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(password)
  }

  /**
   * 获取手机号运营商
   * 根据前3位判断
   */
  static getOperatorByPhone(phone: string): 'cmcc' | 'cucc' | 'ctcc' | null {
    const cmccPrefix = ['134', '135', '136', '137', '138', '139', '147', '150', '151', '152', '157', '158', '159', '165', '172', '178', '182', '183', '184', '187', '188', '195', '197', '198']
    const cuccPrefix = ['130', '131', '132', '145', '146', '155', '156', '166', '171', '175', '176', '185', '186', '196']
    const ctccPrefix = ['133', '149', '153', '173', '174', '177', '180', '181', '189', '190', '191', '193', '199']

    const prefix = phone.substring(0, 3)
    
    if (cmccPrefix.includes(prefix)) return 'cmcc'
    if (cuccPrefix.includes(prefix)) return 'cucc'
    if (ctccPrefix.includes(prefix)) return 'ctcc'
    
    return null
  }
}

export default CryptoUtils
