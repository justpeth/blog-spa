/**
 * deepClone 深度拷贝对象 或者数组 或者字符串
 * @param obj 数组 对象 或者 字符串
 */
export function deepClone (obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  let objArray = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 如果obj的属性是对象，递归操作
        if (obj[key] && typeof obj[key] === 'object') {
          objArray[key] = deepClone(obj[key])
        } else {
          objArray[key] = obj[key]
        }
      }
    }
  }
  return objArray
}
/**
 * isEmpty 判断字符串是否为空
 * @param obj {string} 字符串
 */
export function isEmpty(obj: string): boolean {
  if (typeof obj === 'undefined' || obj === null || obj === '') {
    return true
  }
  return false
}

export function isRepeat(arr: any): boolean {
  var hash = {}
  for (var i in arr) {
    if (hash[arr[i]]) {
      return true
    }
    hash[arr[i]] = true
  }
  return false
}

export function throttle(func, deltaX) {
  let lastCalledAt = new Date().getTime()
  return function() {
    if (new Date().getTime() - lastCalledAt >= deltaX) {
      func.apply(this, arguments)
      lastCalledAt = new Date().getTime()
    }
  }
}