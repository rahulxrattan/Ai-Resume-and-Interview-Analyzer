
"use client";
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function JobSearchForm() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    location: "India",
    state: "",
    jobType: "Full-time",
    experience: "Entry-level",
    category: "",
  });

  const indianStates = [
    "Delhi", "Mumbai", "Bangalore", "Hyderabad",
    "Chennai", "Kolkata", "Pune", "Mohali",
    "Gurgaon", "Noida", "Ahmedabad", "Jaipur"
  ];

  const extractValidUrl = (job) => {
    const possibleUrls = [
      job.job_apply_link,
      job.related_links?.[0]?.link,
      job.detected_extensions?.link,
      ...(job.description?.match(/(https?:\/\/[^\s]+)/g) || []),
    ].filter(url => url && url.startsWith('http'));

    return possibleUrls[0] || (job.via ? tryConstructUrl(job.via) : null);
  };

  const tryConstructUrl = (viaText) => {
    const company = viaText.replace(/^via /i, '').trim();
    if (company.toLowerCase().includes('linkedin')) {
      return 'https://www.linkedin.com/jobs/';
    }
    if (company.toLowerCase().includes('indeed')) {
      return 'https://www.indeed.com/';
    }
    if (company.toLowerCase().includes('glassdoor')) {
      return 'https://www.glassdoor.com/Job/';
    }
    return null;
  };

  const handleSearch = async () => {
    if (!formData.category.trim()) {
      setError("Please enter a job title or keyword");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/fetch-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category: formData.category.trim(),
          state: formData.location === "India" ? (formData.state === "All" ? "" : formData.state) : ""

        }),
      });

      const data = await response.json();
      
      const enhancedJobs = (data.jobs || []).map(job => ({
        ...job,
        url: extractValidUrl(job),
        provider: job.via?.replace(/^via /i, '')
      }));

      setJobs(enhancedJobs);
      
      if (!enhancedJobs.length) {
        setError("No jobs found. Try different search terms or filters.");
      }
    } catch (err) {
      console.error("Search failed:", err);
      setError(err.message || "Failed to fetch jobs. Please try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
          <h1 className="text-6xl font-bold gradient-title gradient self-start mb-4">Find a Job</h1>
          <p className='text-muted-foreground'> Enter the details of job</p>


      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Input
          placeholder="Job title, skills, or company"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="md:col-span-2"
        />

        <Select
          value={formData.location}
          onValueChange={(val) => setFormData({...formData, location: val, state: ""})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Location Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
          </SelectContent>
        </Select>

        {formData.location === "India" && (
          <Select
            value={formData.state}
            onValueChange={(val) => setFormData({...formData, state: val})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select State/City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All India</SelectItem>
              {indianStates.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Select
          value={formData.jobType}
          onValueChange={(val) => setFormData({...formData, jobType: val})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Internship">Internship</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={formData.experience}
          onValueChange={(val) => setFormData({...formData, experience: val})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Experience Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Entry-level">Entry Level (0-2 yrs)</SelectItem>
            <SelectItem value="Mid-level">Mid Level (2-5 yrs)</SelectItem>
            <SelectItem value="Senior">Senior (5+ yrs)</SelectItem>
          </SelectContent>
        </Select>

        <div className="md:col-span-2 flex justify-end">
          <Button 
            onClick={handleSearch} 
            disabled={loading}
            className="w-full md:w-auto px-8 py-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
                Searching...
              </span>
            ) : "Find Jobs"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <div 
              key={`${job.company_name}-${index}`}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-black text-white"

            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                    {job.company_name}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{job.location}</span>
                    {job.provider && (
                      <span className="text-gray-500">• via {job.provider}</span>
                    )}
                  </div>
                </div>
                
                {job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 md:mt-0 inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                  >
                    Apply Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : job.provider ? (
                  <div className="mt-3 md:mt-0 flex flex-col items-end">
                    <span className="text-sm text-gray-500 mb-1">Check on:</span>
                    <span className="inline-flex items-center justify-center px-5 py-2 bg-gray-100 text-gray-600 rounded-md text-sm whitespace-nowrap">
                      {job.provider}
                    </span>
                  </div>
                ) : (
                  <span className="mt-3 md:mt-0 inline-flex items-center justify-center px-5 py-2 bg-gray-100 text-gray-600 rounded-md text-sm whitespace-nowrap">
                    Contact Company
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          !loading && !error && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-500">
                No jobs found yet
              </h3>
              <p className="mt-1 text-gray-400">
                Try searching for different positions or adjusting your filters
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}