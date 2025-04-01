import { deleteJob } from './deleteJob.ts'
import { getJobById } from './getJobById.ts'
import { listJobs } from './listJobs.ts'

export function jobController() {
  return { getJobById, deleteJob, listJobs }
}