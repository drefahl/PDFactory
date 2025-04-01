import client from '@/lib/client-fetch.ts'
import type {
  GeneratePdfByHTMLAsyncMutationResponse,
  GeneratePdfByHTMLAsyncQueryParams,
  GeneratePdfByHTMLAsync400,
  GeneratePdfByHTMLAsync500,
} from '../../types/GeneratePdfByHTMLAsync.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getGeneratePdfByHTMLAsyncUrl() {
  return "http://localhost:3000/api/pdf/async/html" as const
}

/**
 * @description Generate PDF from HTML asynchronously
 * {@link /api/pdf/async/html}
 */
export async function generatePdfByHTMLAsync(params?: GeneratePdfByHTMLAsyncQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GeneratePdfByHTMLAsyncMutationResponse, ResponseErrorConfig<GeneratePdfByHTMLAsync400 | GeneratePdfByHTMLAsync500>, unknown>({
    method: 'POST',
    url: getGeneratePdfByHTMLAsyncUrl().toString(),
    params,
    ...requestConfig,
  })
  return res
}