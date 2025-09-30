"use client";

import { useEffect, useState } from "react";
import { Job } from "@/types/job"; 

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const allJobs: Job[] = [];

        // 1️⃣ Remotive API
        const remotiveRes = await fetch("https://remotive.com/api/remote-jobs");
        const remotiveData = await remotiveRes.json();
        const remotiveJobs: Job[] = (remotiveData.jobs || []).map((job: any) => ({
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

        //  Remote OK API
        const remoteOkRes = await fetch("https://remoteok.com/api");
        const remoteOkData = await remoteOkRes.json();
        const remoteOkJobs: Job[] = (remoteOkData || [])
          .filter((job: any) => job.id) 
          .map((job: any) => ({
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
