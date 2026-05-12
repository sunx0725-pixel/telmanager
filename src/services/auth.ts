import request from '@/utils/request'

interface SendCodeParams {
  phone: string
  type: 'login' | 'register' | 'reset' | 'verify'
}

interface LoginParams {
  phone: string
  code: string
  password: string
}

interface VerifyRealNameParams {
  realName: string
  idCard: string
  phone: string
}

interface ChangePasswordParams {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export class AuthService {
  /**
   * 发送验证码
   */
  static async sendCode(params: SendCodeParams) {
    return request.post('/auth/send-code', params, false)
  }

  /**
   * 登录
   */
  static async login(params: LoginParams) {
    return request.post('/auth/login', params, false)
  }

  /**
   * 刷新令牌
   */
  static async refreshToken(refreshToken: string) {
    return request.post('/auth/refresh', { refreshToken }, false)
  }

  /**
   * 实名认证
   */
  static async verifyRealName(params: VerifyRealNameParams) {
    return request.post('/auth/verify-realname', params)
  }

  /**
   * 修改密码
   */
  static async changePassword(params: ChangePasswordParams) {
    return request.post('/auth/change-password', params)
  }

  /**
   * 重置密码（忘记密码）
   */
  static async resetPassword(phone: string, code: string, newPassword: string) {
    return request.post('/auth/reset-password', { phone, code, newPassword }, false)
  }

  /**
   * 注销账号
   */
  static async deleteAccount(password: string) {
    return request.post('/auth/delete-account', { password })
  }

  /**
   * 退出登录
   */
  static async logout() {
    return request.post('/auth/logout')
  }

  /**
   * 开启/关闭生物识别
   */
  static async toggleBiometric(enabled: boolean) {
    return request.post('/auth/biometric', { enabled })
  }

  /**
   * 生物识别登录
   */
  static async biometricLogin() {
    return request.post('/auth/biometric-login')
  }
}

export default AuthService
