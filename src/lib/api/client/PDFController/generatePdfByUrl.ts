import client from '@/lib/client-fetch.ts'
import type { GeneratePdfByUrlMutationRequest, GeneratePdfByUrlMutationResponse } from '../../types/GeneratePdfByUrl.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getGeneratePdfByUrlUrl() {
  return "http://localhost:3000/api/pdf/sync/url" as const
}

/**
 * @description Generate PDF from URL
 * {@link /api/pdf/sync/url}
 */
export async function generatePdfByUrl(
  data: GeneratePdfByUrlMutationRequest,
  config: Partial<RequestConfig<GeneratePdfByUrlMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GeneratePdfByUrlMutationResponse, ResponseErrorConfig<Error>, GeneratePdfByUrlMutationRequest>({
    method: 'POST',
    url: getGeneratePdfByUrlUrl().toString(),
    data,
    ...requestConfig,
  })
  return res
}