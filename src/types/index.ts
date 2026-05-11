export interface User {
  id: string
  phone: string
  name: string
  avatar: string
  realName: string
  idCard: string
  createdAt: string
}

export interface PhoneNumber {
  id: string
  phone: string
  maskedPhone: string
  operator: 'cmcc' | 'cucc' | 'ctcc'
  operatorName: string
  balance: number
  dataRemaining: number
  callMinutes: number
  packageExpireDate: string
  remark: string
  isFavorite: boolean
  isFrozen: boolean
  createdAt: string
}

export interface BillItem {
  id: string
  phoneId: string
  month: string
  type: 'voice' | 'data' | 'sms' | 'valueAdded'
  typeName: string
  amount: number
  detail: string
}

export interface RechargeRecord {
  id: string
  phoneId: string
  phone: string
  amount: number
  method: 'wechat' | 'alipay'
  methodName: string
  status: 'pending' | 'success' | 'failed'
  statusName: string
  orderNo: string
  createdAt: string
}

export interface Invoice {
  id: string
  phoneId: string
  phone: string
  type: 'recharge' | 'monthly'
  typeName: string
  amount: number
  status: 'unissued' | 'issued'
  statusName: string
  billMonth: string
  invoiceNo: string
  pdfUrl: string
  createdAt: string
}

export interface SecurityLog {
  id: string
  type: 'login' | 'recharge' | 'invoice' | 'addNumber' | 'freeze'
  typeName: string
  device: string
  location: string
  ip: string
  isAbnormal: boolean
  createdAt: string
}

export interface Notification {
  id: string
  type: 'balance' | 'expire' | 'recharge' | 'invoice' | 'login'
  typeName: string
  content: string
  phone?: string
  isRead: boolean
  createdAt: string
}

export interface Province {
  code: string
  name: string
  cities: City[]
}

export interface City {
  code: string
  name: string
}

export interface OperatorInfo {
  operator: 'cmcc' | 'cucc' | 'ctcc'
  name: string
  color: string
  icon: string
}

export interface PackageInfo {
  name: string
  monthlyFee: number
  dataLimit: number
  callMinutes: number
  smsLimit: number
}