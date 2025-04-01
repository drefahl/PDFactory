import client from '@/lib/client-fetch.ts'
import type {
  GeneratePdfByUrlAsyncMutationRequest,
  GeneratePdfByUrlAsyncMutationResponse,
  GeneratePdfByUrlAsync500,
} from '../../types/GeneratePdfByUrlAsync.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getGeneratePdfByUrlAsyncUrl() {
  return "http://localhost:3000/api/pdf/async/url" as const
}

/**
 * @description Generate PDF from URL asynchronously
 * {@link /api/pdf/async/url}
 */
export async function generatePdfByUrlAsync(
  data: GeneratePdfByUrlAsyncMutationRequest,
  config: Partial<RequestConfig<GeneratePdfByUrlAsyncMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GeneratePdfByUrlAsyncMutationResponse, ResponseErrorConfig<GeneratePdfByUrlAsync500>, GeneratePdfByUrlAsyncMutationRequest>({
    method: 'POST',
    url: getGeneratePdfByUrlAsyncUrl().toString(),
    data,
    ...requestConfig,
  })
  return res
}