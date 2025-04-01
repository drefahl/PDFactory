import client from '@/lib/client-fetch.ts'
import type { GeneratePdfByHTMLMutationResponse, GeneratePdfByHTMLQueryParams } from '../../types/GeneratePdfByHTML.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getGeneratePdfByHTMLUrl() {
  return "http://localhost:3000/api/pdf/sync/html" as const
}

/**
 * @description Generate PDF from HTML
 * {@link /api/pdf/sync/html}
 */
export async function generatePdfByHTML(params?: GeneratePdfByHTMLQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GeneratePdfByHTMLMutationResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'POST',
    url: getGeneratePdfByHTMLUrl().toString(),
    params,
    ...requestConfig,
  })
  return res
}