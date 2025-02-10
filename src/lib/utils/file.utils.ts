import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { env } from "@/config/env.config"
import dayjs from "dayjs"

const OUTPUT_DIR = join(process.cwd(), env.NODE_ENV === "test" ? "tmp" : "output")

export async function savePdf(buffer: Uint8Array, name?: string): Promise<{ fileName: string; filePath: string }> {
  await mkdir(OUTPUT_DIR, { recursive: true })

  const fileName = name ? `${name}.pdf` : `pdf_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`
  const filePath = join(OUTPUT_DIR, fileName)

  await writeFile(filePath, buffer)

  return { fileName, filePath }
}
