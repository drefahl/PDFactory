import { generatePdfByHTML } from './generatePdfByHTML.ts'
import { generatePdfByHTMLAsync } from './generatePdfByHTMLAsync.ts'
import { generatePdfByUrl } from './generatePdfByUrl.ts'
import { generatePdfByUrlAsync } from './generatePdfByUrlAsync.ts'
import { getPdf } from './getPdf.ts'
import { getQueueStatus } from './getQueueStatus.ts'

export function PDFController() {
  return { generatePdfByHTML, generatePdfByUrl, getPdf, generatePdfByHTMLAsync, generatePdfByUrlAsync, getQueueStatus }
}