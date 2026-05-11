import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToolsStore = defineStore('tools', () => {
  const queryResult = ref<{
    phone: string
    operator: string
    operatorName: string
    province: string
    city: string
    type: string
  } | null>(null)

  const operatorMap: Record<string, string> = {
    '134': 'cmcc', '135': 'cmcc', '136': 'cmcc', '137': 'cmcc', '138': 'cmcc', '139': 'cmcc',
    '150': 'cmcc', '151': 'cmcc', '152': 'cmcc', '157': 'cmcc', '158': 'cmcc', '159': 'cmcc',
    '182': 'cmcc', '183': 'cmcc', '184': 'cmcc', '187': 'cmcc', '188': 'cmcc',
    '130': 'cucc', '131': 'cucc', '132': 'cucc',
    '155': 'cucc', '156': 'cucc',
    '185': 'cucc', '186': 'cucc',
    '176': 'cucc',
    '133': 'ctcc', '153': 'ctcc',
    '180': 'ctcc', '181': 'ctcc', '189': 'ctcc',
    '177': 'ctcc'
  }

  const provinceMap: Record<string, { province: string; city: string }> = {
    '1381': { province: '北京市', city: '北京市' },
    '1382': { province: '上海市', city: '上海市' },
    '1383': { province: '广东省', city: '广州市' },
    '1384': { province: '浙江省', city: '杭州市' },
    '1385': { province: '江苏省', city: '南京市' },
    '1391': { province: '北京市', city: '北京市' },
    '1392': { province: '上海市', city: '上海市' },
    '1393': { province: '广东省', city: '深圳市' },
    '1398': { province: '广东省', city: '深圳市' },
    '1589': { province: '北京市', city: '北京市' },
    '1891': { province: '北京市', city: '北京市' },
    '1892': { province: '上海市', city: '上海市' }
  }

  const queryLocation = (phone: string) => {
    if (phone.length !== 11) {
      uni.showToast({ title: '请输入11位手机号', icon: 'none' })
      return
    }

    const prefix = phone.slice(0, 4)
    const operatorCode = phone.slice(0, 3)
    
    let operator = operatorMap[operatorCode] || '未知'
    let operatorName = ''
    switch (operator) {
      case 'cmcc': operatorName = '中国移动'; break
      case 'cucc': operatorName = '中国联通'; break
      case 'ctcc': operatorName = '中国电信'; break
      default: operatorName = '未知运营商'
    }

    const location = provinceMap[prefix] || { province: '未知', city: '未知' }

    queryResult.value = {
      phone,
      operator,
      operatorName,
      province: location.province,
      city: location.city,
      type: phone.startsWith('13') ? '老号段' : phone.startsWith('15') ? '中期号段' : phone.startsWith('18') ? '3G号段' : '4G/5G号段'
    }
  }

  const calculateCost = (monthlyFee: number, dataUsage: number, dataLimit: number, overRate: number, callMinutes: number, callLimit: number, callRate: number) => {
    let total = monthlyFee
    if (dataUsage > dataLimit) {
      total += (dataUsage - dataLimit) * overRate
    }
    if (callMinutes > callLimit) {
      total += (callMinutes - callLimit) * callRate
    }
    return total.toFixed(2)
  }

  return {
    queryResult,
    queryLocation,
    calculateCost
  }
})