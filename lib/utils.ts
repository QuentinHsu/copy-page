import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 递归进行 decodeURIComponent，直到不需要再 decodeURIComponent 时返回内容
 * @param str 需要进行 decodeURIComponent 的字符串
 * @returns decodeURIComponent 后的字符串
 */

export function decodeURIComponentRecursive(str: string): string {
  try {
    // 尝试进行 decodeURIComponent
    const decoded = decodeURIComponent(str)
    // 如果 decodeURIComponent 后的结果和原字符串相同，说明不需要再进行 decodeURIComponent
    if (decoded === str) {
      return str
    }
    else {
      // 否则递归进行 decodeURIComponent
      return decodeURIComponentRecursive(decoded)
    }
  }
  catch (e) {
    // 如果 decodeURIComponent 抛出异常，说明 str 已经不需要再进行 decodeURIComponent
    return str
  }
}
