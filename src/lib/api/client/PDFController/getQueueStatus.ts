import client from '@/lib/client-fetch.ts'
import type { GetQueueStatusQueryResponse } from '../../types/GetQueueStatus.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getGetQueueStatusUrl() {
  return "http://localhost:3000/api/pdf/queue-status" as const
}

/**
 * @description Get queue status
 * {@link /api/pdf/queue-status}
 */
export async function getQueueStatus(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetQueueStatusQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetQueueStatusUrl().toString(),
    ...requestConfig,
  })
  return res
}