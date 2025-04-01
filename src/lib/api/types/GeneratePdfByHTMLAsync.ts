export const optionsFormatEnum3 = {
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

export type OptionsFormatEnum3 = (typeof optionsFormatEnum3)[keyof typeof optionsFormatEnum3]

export type GeneratePdfByHTMLAsyncQueryParams = {
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
    format?: OptionsFormatEnum3
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

/**
 * @description Default Response
 */
export type GeneratePdfByHTMLAsync202 = {
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
export type GeneratePdfByHTMLAsync400 = {
  /**
   * @type string
   */
  message: string
}

/**
 * @description Default Response
 */
export type GeneratePdfByHTMLAsync500 = {
  /**
   * @type string
   */
  message: string
}

export type GeneratePdfByHTMLAsyncMutationResponse = GeneratePdfByHTMLAsync202

export type GeneratePdfByHTMLAsyncMutation = {
  Response: GeneratePdfByHTMLAsync202
  QueryParams: GeneratePdfByHTMLAsyncQueryParams
  Errors: GeneratePdfByHTMLAsync400 | GeneratePdfByHTMLAsync500
}