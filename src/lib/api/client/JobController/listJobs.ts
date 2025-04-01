import client from '@/lib/client-fetch.ts'
import type { ListJobsQueryResponse } from '../../types/ListJobs.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getListJobsUrl() {
  return "http://localhost:3000/api/jobs/" as const
}

/**
 * @description List all jobs
 * {@link /api/jobs/}
 */
export async function listJobs(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<ListJobsQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: getListJobsUrl().toString(), ...requestConfig })
  return res
}