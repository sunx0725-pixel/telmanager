// API 环境配置
const ENV = {
  DEV: {
    baseURL: 'https://dev-api.telmanager.com',
    timeout: 30000
  },
  TEST: {
    baseURL: 'https://test-api.telmanager.com',
    timeout: 30000
  },
  PROD: {
    baseURL: 'https://api.telmanager.com',
    timeout: 30000
  }
}

// 当前环境
const currentEnv = 'DEV'

export const API_CONFIG = {
  baseURL: ENV[currentEnv].baseURL,
  timeout: ENV[currentEnv].timeout,
  version: 'v1',
  appId: 'tel_manager_2026',
  appSecret: 'your-app-secret-here'
}

// 运营商API配置
export const OPERATOR_API_CONFIG = {
  cmcc: {
    name: '中国移动',
    baseURL: 'https://open.10086.cn',
    appKey: 'your-cmcc-app-key',
    appSecret: 'your-cmcc-app-secret',
    publicKey: `-----BEGIN PUBLIC KEY-----
your-cmcc-public-key
-----END PUBLIC KEY-----`
  },
  cucc: {
    name: '中国联通',
    baseURL: 'https://open.10010.com',
    appKey: 'your-cucc-app-key',
    appSecret: 'your-cucc-app-secret',
    publicKey: `-----BEGIN PUBLIC KEY-----
your-cucc-public-key
-----END PUBLIC KEY-----`
  },
  ctcc: {
    name: '中国电信',
    baseURL: 'https://open.189.cn',
    appKey: 'your-ctcc-app-key',
    appSecret: 'your-ctcc-app-secret',
    publicKey: `-----BEGIN PUBLIC KEY-----
your-ctcc-public-key
-----END PUBLIC KEY-----`
  }
}

// 支付配置
export const PAYMENT_CONFIG = {
  wechat: {
    appId: 'wx1234567890abcdef',
    mchId: '1234567890',
    notifyUrl: `${API_CONFIG.baseURL}/payment/wechat/notify`
  },
  alipay: {
    appId: '2021001234567890',
    gateway: 'https://openapi.alipay.com/gateway.do',
    notifyUrl: `${API_CONFIG.baseURL}/payment/alipay/notify`
  }
}

// 安全配置
export const SECURITY_CONFIG = {
  aesKey: 'your-aes-256-key-here',
  iv: 'your-iv-vector',
  tokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7天
  refreshTokenExpiry: 30 * 24 * 60 * 60 * 1000 // 30天
}

export default API_CONFIG
