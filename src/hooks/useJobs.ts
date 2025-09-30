"use client";

import { useEffect, useState } from "react";
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

interface HimalayasJobAPI {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  url: string;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const allJobs: Job[] = [];

        // 1️⃣ Remotive
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
          source: "Remotive",
        }));
        allJobs.push(...remotiveJobs);

        // 2️⃣ Remote OK
        const remoteOkRes = await fetch("https://remoteok.com/api");
        const remoteOkData = await remoteOkRes.json();
        const remoteOkJobs: Job[] = (remoteOkData as RemoteOkJobAPI[])
          .filter(job => job.id) // remove metadata at index 0
          .map(job => ({
            id: job.id,
            title: job.position,
            company_name: job.company,
            candidate_required_location: job.location,
            job_type: job.tags?.join(", ") || "",
            category: job.tags?.join(", ") || "",
            url: job.url,
            source: "Remote OK",
          }));
        allJobs.push(...remoteOkJobs);

        // 3️⃣ Himalayas
        const himalayasRes = await fetch("https://himalayas.app/api");
        const himalayasData = await himalayasRes.json();
        const himalayasJobs: Job[] = (himalayasData.jobs as HimalayasJobAPI[]).map(job => ({
          id: job.id,
          title: job.title,
          company_name: job.company,
          candidate_required_location: job.location,
          job_type: job.type,
          category: job.category,
          url: job.url,
          source: "Himalayas",
        }));
        allJobs.push(...himalayasJobs);

        setJobs(allJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  return { jobs, loading };
}
