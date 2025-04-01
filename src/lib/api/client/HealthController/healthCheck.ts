import client from '@/lib/client-fetch.ts'
import type { HealthCheckQueryResponse } from '../../types/HealthCheck.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getHealthCheckUrl() {
  return "http://localhost:3000/api/health" as const
}

/**
 * @description Health check endpoint
 * {@link /api/health}
 */
export async function healthCheck(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<HealthCheckQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getHealthCheckUrl().toString(),
    ...requestConfig,
  })
  return res
}