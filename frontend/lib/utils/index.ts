import { type ClassValue, clsx } from 'clsx';

/**
 * 格式化日期为本地字符串
 * @param date 日期对象或字符串
 * @param options 格式化选项
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', options);
}

/**
 * 格式化数字为货币形式
 * @param value 数值
 * @param currency 货币符号，默认为￥
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(value: number, currency = '￥'): string {
  return `${currency}${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}

/**
 * 合并CSS类名
 * @param inputs CSS类名数组
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * 截断文本并添加省略号
 * @param text 原始文本
 * @param maxLength 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * 将秒转换为可读时间格式
 * @param seconds 秒数
 * @returns 格式化的时间字符串
 */
export function formatTime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days}天${hours}小时${minutes}分钟`;
  }
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  
  if (minutes > 0) {
    return `${minutes}分钟${secs}秒`;
  }
  
  return `${secs}秒`;
}

/**
 * 检查值是否为对象
 * @param item 要检查的值
 * @returns 是否为对象
 */
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 深度合并对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target } as T;
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceKey = key as keyof typeof source;
      const targetKey = key as keyof typeof target;
      
      if (isObject(source[sourceKey])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[sourceKey] });
        } else {
          output[targetKey] = deepMerge(
            target[targetKey] as Record<string, any>,
            source[sourceKey] as Record<string, any>
          ) as any;
        }
      } else {
        Object.assign(output, { [key]: source[sourceKey] });
      }
    });
  }
  
  return output;
}

/**
 * 将查询参数对象转换为URL查询字符串
 * @param params 参数对象
 * @returns URL查询字符串
 */
export function objectToQueryString(params: Record<string, any>): string {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
} 