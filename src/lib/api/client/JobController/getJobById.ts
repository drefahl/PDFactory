import client from '@/lib/client-fetch.ts'
import type { GetJobByIdQueryResponse, GetJobByIdPathParams } from '../../types/GetJobById.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getGetJobByIdUrl(id: GetJobByIdPathParams['id']) {
  return `http://localhost:3000/api/jobs/${id}` as const
}

/**
 * @description Get a job by id
 * {@link /api/jobs/:id}
 */
export async function getJobById(id: GetJobByIdPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetJobByIdQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetJobByIdUrl(id).toString(),
    ...requestConfig,
  })
  return res
}