import { getCookieToken } from "./utils/token.util"

export type RequestConfig<TData = unknown> = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD" | "CONNECT" | "TRACE"
  url?: string
  baseURL?: string
  params?: Record<string, string | number>
  data?: TData | FormData
  responseType?: "json" | "text" | "blob" | "arraybuffer" | "document" | "stream"
  headers?: HeadersInit
} & RequestInit

export type ResponseErrorConfig<TError = unknown> = {
  status: number
} & TError

export type ResponseConfig<TData = unknown, TError = unknown> = [ResponseErrorConfig<TError>, null] | [null, TData]

export async function httpClientFetch<TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData, TError>> {
  const baseURL = config.baseURL || ""
  let url = `${baseURL}${config.url}`

  if (config.params) {
    const queryString = new URLSearchParams(
      Object.entries(config.params).map(([key, value]) => [key, String(value)]),
    ).toString()
    url += `?${queryString}`
  }

  const fetchOptions = config

  const token = await getCookieToken()

  if (token) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  if (["POST", "PUT", "PATCH"].includes(config.method) && config.data) {
    if (config.data instanceof FormData) {
      fetchOptions.body = config.data
    } else {
      fetchOptions.body = typeof config.data === "string" ? config.data : JSON.stringify(config.data)
      fetchOptions.headers = {
        ...fetchOptions.headers,
        "Content-Type": "application/json",
      }
    }
  }

  const response = await fetch(url, fetchOptions)

  let data: any
  switch (config.responseType) {
    case "text":
      data = await response.text()
      break
    case "blob":
      data = await response.blob()
      break
    case "arraybuffer":
      data = await response.arrayBuffer()
      break
    default:
      data = await response.json()
      break
  }

  if (response.ok) {
    return [null, data]
  }

  return [
    {
      status: response.status,
      ...data,
    },
    null,
  ]
}
export default httpClientFetch
