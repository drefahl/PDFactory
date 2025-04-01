"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type ListJobs200, getPdf, listJobs } from "@/lib/api"
import { handleError } from "@/lib/utils/error.util"
import { openBlob } from "@/lib/utils/file.util"
import { Download, RefreshCw } from "lucide-react"
import { useState } from "react"

interface QueueTableProps {
  initialJobs: ListJobs200
}

export function QueueTable({ initialJobs = [] }: QueueTableProps) {
  const [jobs, setJobs] = useState<ListJobs200>(initialJobs)

  const handleRefresh = async () => {
    const [err, newJobs] = await listJobs()
    if (err) {
      console.error(err)
      return
    }
    setJobs(newJobs)
  }

  const handleDownload = async (pdfPath: string) => {
    const [err, blob] = await getPdf(pdfPath, { responseType: "blob" })
    if (err) return handleError(err.message, err)

    openBlob(blob)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Conversion Queue</CardTitle>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Finished At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => {
                const jobType = job.htmlContent ? "HTML" : job.url ? "URL" : "-"

                return (
                  <TableRow key={job.id}>
                    <TableCell>{job.id}</TableCell>
                    <TableCell>{job.userId}</TableCell>
                    <TableCell>{jobType}</TableCell>
                    <TableCell>{job.mode}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === "COMPLETED"
                            ? "success"
                            : job.status === "PROCESSING"
                              ? "warning"
                              : job.status === "PENDING"
                                ? "secondary"
                                : "destructive"
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(job.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{job.finishedAt ? new Date(job.finishedAt).toLocaleString() : "-"}</TableCell>
                    <TableCell>
                      {job.status === "COMPLETED" && job.pdfPath && (
                        <Button size="sm" onClick={() => job.pdfPath && handleDownload(job.pdfPath)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
