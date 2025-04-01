import client from '@/lib/client-fetch.ts'
import type { GetPdfQueryResponse, GetPdfPathParams } from '../../types/GetPdf.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getGetPdfUrl(fileName: GetPdfPathParams['fileName']) {
  return `http://localhost:3000/api/pdf/${fileName}` as const
}

/**
 * @description Get PDF by file name
 * {@link /api/pdf/:fileName}
 */
export async function getPdf(fileName: GetPdfPathParams['fileName'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetPdfQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetPdfUrl(fileName).toString(),
    ...requestConfig,
  })
  return res
}