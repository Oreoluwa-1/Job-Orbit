export interface Job {
  id: string | number;
  title: string;
  company_name: string;
  candidate_required_location?: string;
  job_type?: string;
  category?: string;
  url?: string;
  source?: string;
}
