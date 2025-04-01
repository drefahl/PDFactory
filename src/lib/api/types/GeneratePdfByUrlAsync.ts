/**
 * @description Default Response
 */
export type GeneratePdfByUrlAsync202 = {
  /**
   * @type string
   */
  message: string
  /**
   * @type array
   */
  jobIds: string[]
  /**
   * @type array
   */
  errors: string[]
}

/**
 * @description Default Response
 */
export type GeneratePdfByUrlAsync500 = {
  /**
   * @type string
   */
  message: string
}

export const optionsFormatEnum4 = {
  Letter: 'Letter',
  Legal: 'Legal',
  Tabloid: 'Tabloid',
  Ledger: 'Ledger',
  A0: 'A0',
  A1: 'A1',
  A2: 'A2',
  A3: 'A3',
  A4: 'A4',
  A5: 'A5',
  A6: 'A6',
} as const

export type OptionsFormatEnum4 = (typeof optionsFormatEnum4)[keyof typeof optionsFormatEnum4]

export type GeneratePdfByUrlAsyncMutationRequest = {
  /**
   * @type array
   */
  urls: {
    /**
     * @type string, uri
     */
    url: string
  }[]
  /**
   * @type object | undefined
   */
  options?: {
    /**
     * @type string | undefined
     */
    path?: string
    /**
     * @minLength 0.1
     * @maxLength 2
     * @type number | undefined
     */
    scale?: number
    /**
     * @type boolean | undefined
     */
    displayHeaderFooter?: boolean
    /**
     * @type string | undefined
     */
    headerTemplate?: string
    /**
     * @type string | undefined
     */
    footerTemplate?: string
    /**
     * @type boolean | undefined
     */
    printBackground?: boolean
    /**
     * @type boolean | undefined
     */
    landscape?: boolean
    /**
     * @type string | undefined
     */
    pageRanges?: string
    /**
     * @type string | undefined
     */
    format?: OptionsFormatEnum4
    /**
     * @pattern ^\d+(\.\d+)?(mm|cm|in|px)$
     * @type string | undefined
     */
    width?: string
    /**
     * @pattern ^\d+(\.\d+)?(mm|cm|in|px)$
     * @type string | undefined
     */
    height?: string
    /**
     * @type object | undefined
     */
    margin?: {
      /**
       * @type string | undefined
       */
      top?: string
      /**
       * @type string | undefined
       */
      right?: string
      /**
       * @type string | undefined
       */
      bottom?: string
      /**
       * @type string | undefined
       */
      left?: string
    }
    /**
     * @type boolean | undefined
     */
    preferCSSPageSize?: boolean
    /**
     * @type boolean | undefined
     */
    omitBackground?: boolean
  }
}

export type GeneratePdfByUrlAsyncMutationResponse = GeneratePdfByUrlAsync202

export type GeneratePdfByUrlAsyncMutation = {
  Response: GeneratePdfByUrlAsync202
  Request: GeneratePdfByUrlAsyncMutationRequest
  Errors: GeneratePdfByUrlAsync500
}