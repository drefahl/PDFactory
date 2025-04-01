import { listJobs } from "@/lib/api"
import { QueueTable } from "./_components/table"

export default async function Queue() {
  const [err, jobs] = await listJobs()

  if (err) {
    console.error(err)
    return <div>Failed to fetch jobs</div>
  }

  return <QueueTable initialJobs={jobs} />
}
