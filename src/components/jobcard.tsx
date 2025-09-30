import { Job } from "@/types/job";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Job Info */}
      <div>
        <h2 className="text-xl font-bold text-indigo-600 mb-1 line-clamp-2">
          {job.title}
        </h2>
        <p className="text-gray-700 font-medium">{job.company_name}</p>
        {job.candidate_required_location && (
          <p className="text-gray-500 text-sm mt-1">{job.candidate_required_location}</p>
        )}
      </div>

      {/* Job Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {job.job_type && (
          <span className="px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">
            {job.job_type}
          </span>
        )}
        {job.category && (
          <span className="px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
            {job.category}
          </span>
        )}
        {job.source && (
          <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
            {job.source}
          </span>
        )}
      </div>

      {/* View Job Button */}
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block text-center px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
      >
        View Job
      </a>
    </div>
  );
}
