/** 构造统一的 API 成功响应包装。 */
export function success<T>(data: T, message?: string) {
  return {
    code: 200,
    data,
    message,
  };
}

/** 构造统一的 API 失败响应包装。 */
export function fail(message: string) {
  return {
    code: 500,
    data: null,
    message,
  };
}
