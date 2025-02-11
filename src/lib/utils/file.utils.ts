import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { env } from "@/config/env.config"
import dayjs from "dayjs"

const OUTPUT_DIR = join(process.cwd(), env.NODE_ENV === "test" ? "tmp" : "output")

export async function savePdf(buffer: Uint8Array, id: number, name?: string) {
  const userDir = join(OUTPUT_DIR, id.toString())
  await mkdir(userDir, { recursive: true })

  const fileName = name ? `${name}.pdf` : `pdf_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`
  const filePath = join(userDir, fileName)

  await writeFile(filePath, buffer)

  return { fileName, filePath }
}
