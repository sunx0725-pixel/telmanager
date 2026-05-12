import API_CONFIG from '@/config'

interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  needAuth?: boolean
  timeout?: number
}

interface Response<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
  requestId: string
}

class Request {
  private requestId: number = 0

  // 生成请求ID
  private generateRequestId(): string {
    this.requestId++
    return `req_${Date.now()}_${this.requestId}`
  }

  // 获取认证头
  private getAuthHeaders(): Record<string, string> {
    const token = uni.getStorageSync('token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-App-Id': API_CONFIG.appId,
      'X-Timestamp': Date.now().toString(),
      'X-Request-Id': this.generateRequestId()
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  // 基础请求方法
  async request<T = any>(config: RequestConfig): Promise<Response<T>> {
    const {
      url,
      method = 'GET',
      data,
      header,
      needAuth = true,
      timeout = API_CONFIG.timeout
    } = config

    const headers = needAuth ? this.getAuthHeaders() : {
      'Content-Type': 'application/json',
      'X-App-Id': API_CONFIG.appId,
      'X-Timestamp': Date.now().toString()
    }
    
    if (header) {
      Object.assign(headers, header)
    }

    const requestId = headers['X-Request-Id']

    try {
      const res = await uni.request({
        url: `${API_CONFIG.baseURL}/${API_CONFIG.version}${url}`,
        method,
        data,
        header: headers,
        timeout
      }) as any

      const response = res.data as Response<T>
      
      // 统一错误处理
      if (response.code !== 200) {
        // 令牌过期或无效
        if (response.code === 401) {
          uni.removeStorageSync('token')
          uni.removeStorageSync('user')
          uni.redirectTo({ url: '/pages/login/index' })
          throw new Error('登录已过期，请重新登录')
        }
        
        // 其他业务错误
        uni.showToast({
          title: response.message || '请求失败',
          icon: 'none',
          duration: 2000
        })
        throw new Error(response.message)
      }

      return {
        ...response,
        requestId
      }
    } catch (error) {
      // 网络错误等非业务错误
      const errorMessage = this.handleNetworkError(error)
      uni.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 2000
      })
      throw new Error(errorMessage)
    }
  }

  // 网络错误处理
  private handleNetworkError(error: any): string {
    if (error.errMsg) {
      if (error.errMsg.includes('timeout')) {
        return '请求超时，请检查网络'
      }
      if (error.errMsg.includes('fail')) {
        return '网络连接失败，请检查网络'
      }
    }
    return '请求失败，请稍后重试'
  }

  // GET请求
  get<T = any>(url: string, data?: any, needAuth = true): Promise<Response<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      data,
      needAuth
    })
  }

  // POST请求
  post<T = any>(url: string, data?: any, needAuth = true): Promise<Response<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      needAuth
    })
  }

  // PUT请求
  put<T = any>(url: string, data?: any, needAuth = true): Promise<Response<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      needAuth
    })
  }

  // DELETE请求
  delete<T = any>(url: string, data?: any, needAuth = true): Promise<Response<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      data,
      needAuth
    })
  }

  // 上传文件
  async uploadFile(url: string, filePath: string, name: string = 'file', formData?: Record<string, any>): Promise<any> {
    const headers = this.getAuthHeaders()
    
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: `${API_CONFIG.baseURL}/${API_CONFIG.version}${url}`,
        filePath,
        name,
        header: headers,
        formData,
        success: (res) => {
          const data = JSON.parse(res.data)
          if (data.code === 200) {
            resolve(data)
          } else {
            reject(new Error(data.message))
          }
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }
}

export default new Request()
