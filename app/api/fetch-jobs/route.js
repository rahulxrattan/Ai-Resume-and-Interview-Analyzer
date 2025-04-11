


import { NextResponse } from "next/server";

export async function POST(req) {
  const { location, jobType, experience, category, state } = await req.json();

  // Construct query - include state only if provided
  let queryParts = [category, jobType, experience];
  if (location === "India" && state) {
    queryParts.push(`in ${state}`);
  } else {
    queryParts.push(`in ${location}`);
  }
  const query = queryParts.filter(Boolean).join(' ');

  const serpApiKey = process.env.NEXT_PUBLIC_SERP_API_KEY;
  const params = new URLSearchParams({
    engine: "google_jobs",
    q: query,
    hl: "en",
    gl: "in",
    api_key: serpApiKey,
  });

  try {
    const response = await fetch(`https://serpapi.com/search.json?${params}`);
    const data = await response.json();

    const jobs = (data.jobs_results || []).map(job => ({
      title: job.title,
      company_name: job.company_name,
      location: job.location,
      url: job.job_apply_link || 
           job.related_links?.[0]?.link || 
           job.detected_extensions?.link || 
           null,
      via: job.via
    }));

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("SerpAPI Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}