import client from '@/lib/client-fetch.ts'
import type { DeleteJobMutationResponse, DeleteJobPathParams } from '../../types/DeleteJob.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getDeleteJobUrl(id: DeleteJobPathParams['id']) {
  return `http://localhost:3000/api/jobs/${id}` as const
}

/**
 * @description Delete a job by id
 * {@link /api/jobs/:id}
 */
export async function deleteJob(id: DeleteJobPathParams['id'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<DeleteJobMutationResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'DELETE',
    url: getDeleteJobUrl(id).toString(),
    ...requestConfig,
  })
  return res
}