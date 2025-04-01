export type GetPdfPathParams = {
  /**
   * @type string
   */
  fileName: string
}

/**
 * @description Default Response
 */
export type GetPdf200 = any

export type GetPdfQueryResponse = GetPdf200

export type GetPdfQuery = {
  Response: GetPdf200
  PathParams: GetPdfPathParams
  Errors: any
}