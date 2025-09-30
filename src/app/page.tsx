"use client";

import JobCard from "@/components/jobcard";
import { useJobs } from "@/hooks/useJobs";
import { useForm } from "react-hook-form";
import { useState, useMemo } from "react";

type FilterForm = {
  search: string;
  location: string;
  type: string;
  category: string;
};

export default function Home() {
  const { jobs, loading } = useJobs();
  const { register, watch } = useForm<FilterForm>({
    defaultValues: { search: "", location: "", type: "", category: "" },
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const jobsPerPage = 6;

  // Watch form values
  const search = watch("search");
  const location = watch("location");
  const type = watch("type");
  const category = watch("category");

  // Filtering logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        (job.company_name?.toLowerCase().includes(search.toLowerCase()) ?? false);

      const matchesLocation = location
        ? job.candidate_required_location
            ?.toLowerCase()
            .includes(location.toLowerCase())
        : true;

      const matchesType = type ? job.job_type === type : true;

      const matchesCategory = category
        ? job.category?.toLowerCase().includes(category.toLowerCase())
        : true;

      return matchesSearch && matchesLocation && matchesType && matchesCategory;
    });
  }, [jobs, search, location, type, category]);

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const start = (page - 1) * jobsPerPage;
  const paginatedJobs = filteredJobs.slice(start, start + jobsPerPage);

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
       JobOrbit
      </h1>

      {/*  Filters */}
      <form className="mb-8 grid gap-4 sm:grid-cols-4">
        <input
          type="text"
          placeholder="Search jobs or companies..."
          {...register("search")}
          className="p-2 rounded border border-gray-300 w-full"
        />
        <input
          type="text"
          placeholder="Filter by location..."
          {...register("location")}
          className="p-2 rounded border border-gray-300 w-full"
        />
        <select {...register("type")} className="p-2 rounded border border-gray-300 w-full">
          <option value="">All Types</option>
          <option value="full_time">Full-time</option>
          <option value="part_time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="contract">Remote</option>
        </select>
        <select {...register("category")} className="p-2 rounded border border-gray-300 w-full">
          <option value="">All Categories</option>
          <option value="Software Development">Software Development</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="Customer Support">Customer Support</option>
          <option value="Other">Other</option>
        </select>
      </form>

      {loading ? (
        <p className="text-center text-gray-600">Loading jobs...</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <p className="text-center col-span-full text-gray-500">
                No jobs found 
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-gray-700">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
