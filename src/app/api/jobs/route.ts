import { NextResponse } from "next/server";
import { Job } from "@/types/job";

interface RemotiveJobAPI {
  id: number;
  title: string;
  company_name: string;
  candidate_required_location: string;
  job_type: string;
  category: string;
  url: string;
}

interface RemoteOkJobAPI {
  id: number;
  position: string;
  company: string;
  location: string;
  tags?: string[];
  url: string;
}

export async function GET() {
  const allJobs: Job[] = [];

  try {
    // Remotive
    const remotiveRes = await fetch("https://remotive.com/api/remote-jobs");
    const remotiveData = await remotiveRes.json();
    const remotiveJobs: Job[] = (remotiveData.jobs as RemotiveJobAPI[]).map(job => ({
      id: job.id,
      title: job.title,
      company_name: job.company_name,
      candidate_required_location: job.candidate_required_location,
      job_type: job.job_type,
      category: job.category,
      url: job.url,
      source: "Remotive"
    }));
    allJobs.push(...remotiveJobs);

    // Remote OK
    const remoteOkRes = await fetch("https://remoteok.com/api");
    const remoteOkData = await remoteOkRes.json();
    const remoteOkJobs: Job[] = (remoteOkData as RemoteOkJobAPI[])
      .slice(1) // skip metadata row
      .map(job => ({
        id: job.id,
        title: job.position,
        company_name: job.company,
        candidate_required_location: job.location,
        job_type: job.tags?.join(", ") || "",
        category: job.tags?.join(", ") || "",
        url: job.url,
        source: "Remote OK"
      }));
    allJobs.push(...remoteOkJobs);

    return NextResponse.json({ jobs: allJobs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ jobs: [], error: "Failed to fetch jobs" });
  }
}
