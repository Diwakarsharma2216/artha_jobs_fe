// types/index.ts
export interface ImportLog {
  _id: string;
  fileName: string;
  importDateTime: string;
  totalFetched: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: number;
  failedReasons?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Job {
  _id: string;
  title: string;
  description?: string;
  url: string;
  company?: string;
  location?: string;
  jobType?: string;
  category?: string;
  externalId?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
