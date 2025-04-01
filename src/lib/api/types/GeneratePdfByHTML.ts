export const optionsFormatEnum = {
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

export type OptionsFormatEnum = (typeof optionsFormatEnum)[keyof typeof optionsFormatEnum]

export type GeneratePdfByHTMLQueryParams = {
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
    format?: OptionsFormatEnum
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
export type GeneratePdfByHTML200 = any

export type GeneratePdfByHTMLMutationResponse = GeneratePdfByHTML200

export type GeneratePdfByHTMLMutation = {
  Response: GeneratePdfByHTML200
  QueryParams: GeneratePdfByHTMLQueryParams
  Errors: any
}