"use client";

import { useEffect, useState } from "react";
import { Job } from "@/types/job";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return { jobs, loading };
}
