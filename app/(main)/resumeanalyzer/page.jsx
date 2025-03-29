"use client";

import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Info, CheckCircle2, AlertCircle } from 'lucide-react';

// Constants
const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

export default function ResumeATSScanner() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState({ strengths: '', improvements: '', keywordMatch: '' });
  const [error, setError] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showTipDialog, setShowTipDialog] = useState(false);

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('Please enter your resume text');
      setShowErrorDialog(true);
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter the job description');
      setShowErrorDialog(true);
      return;
    }

    setIsLoading(true);
    setError('');
    setScore(null);
    setFeedback({ strengths: '', improvements: '', keywordMatch: '' });

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this resume for Applicant Tracking System (ATS) compatibility with the given job description and provide:
1. A numerical score from 0-100 (just the number)
2. Feedback divided into "Strengths", "Areas for Improvement", and "Keyword Matching" sections

Job Description:
${jobDescription}

Resume:
${resumeText}

Respond in this exact format:
SCORE: [number]
STRENGTHS: [text]
AREAS FOR IMPROVEMENT: [text]
KEYWORD MATCHING: [text]`
            }]
          }]
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to analyze resume');

      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const scoreMatch = responseText.match(/SCORE:\s*(\d+)/);
      const strengthsMatch = responseText.match(/STRENGTHS:\s*([\s\S]*?)(?=AREAS FOR IMPROVEMENT:|$)/);
      const improvementsMatch = responseText.match(/AREAS FOR IMPROVEMENT:\s*([\s\S]*?)(?=KEYWORD MATCHING:|$)/);
      const keywordMatch = responseText.match(/KEYWORD MATCHING:\s*([\s\S]*)/);

      if (scoreMatch && strengthsMatch && improvementsMatch && keywordMatch) {
        setScore(parseInt(scoreMatch[1]));
        setFeedback({
          strengths: strengthsMatch[1].trim(),
          improvements: improvementsMatch[1].trim(),
          keywordMatch: keywordMatch[1].trim()
        });
      } else {
        throw new Error('Unexpected response format from API');
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze resume');
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = () => {
    if (!score) return '';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
  <><h1 className="text-6xl  ml-6 font-bold gradient-title mb-6">Resume Analyzer</h1>
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      
      
      <Card>
        <CardHeader>
         <CardTitle> Checker ATS Score of Your Resume</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Textarea
                id="resume"
                rows={10}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                disabled={isLoading}
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Textarea
                id="jobDescription"
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                disabled={isLoading}
                className="min-h-[200px]"
              />
            </div>
          </div>

          <Button 
            onClick={analyzeResume}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : 'Check ATS Score'}
          </Button>

          {score !== null && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">ATS Compatibility Score</Label>
                  <Badge variant="outline" className="text-lg font-semibold px-3 py-1">
                    {score}/100
                  </Badge>
                </div>
                <Progress value={score} className={`h-3 ${getProgressColor()}`} />
                <div className="text-sm text-muted-foreground">
                  {score >= 80 ? 'Excellent! Your resume is highly ATS-friendly for this job.' :
                   score >= 60 ? 'Good match, but could use some improvements.' :
                   score >= 40 ? 'Needs significant improvements to better match this job.' :
                   'Poor match. Major revisions recommended for this job.'}
                </div>
              </div>
              
              {feedback && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <CardTitle className="text-lg">Strengths</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line text-green-800 dark:text-green-200">
                          {feedback.strengths}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                          <CardTitle className="text-lg">Improvements</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line text-orange-800 dark:text-orange-200">
                          {feedback.improvements}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Info className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg">Keyword Match</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line text-blue-800 dark:text-blue-200">
                          {feedback.keywordMatch}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => setShowTipDialog(true)}
                  >
                    <Info className="h-4 w-4" />
                    Show Pro Tip for ATS Optimization
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="text-xs text-muted-foreground">
          Note: This analysis compares your resume against the provided job description. Results may vary across different ATS systems.
          Also provide only valid data. Invalid data will give API error.
        </CardFooter>
      </Card>

      {/* Error Alert Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Error Analyzing Resume
            </AlertDialogTitle>
            <AlertDialogDescription>
              {error || 'An unknown error occurred while analyzing your resume.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Try Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pro Tip Alert Dialog */}
      <AlertDialog open={showTipDialog} onOpenChange={setShowTipDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Pro Tip for ATS Optimization
            </AlertDialogTitle>
            <div className="text-sm text-muted-foreground space-y-2">
              <div>1. <strong>Extract keywords</strong> from the job description and incorporate them naturally</div>
              <div>2. <strong>Match job title</strong> by using similar wording in your resume headline</div>
              <div>3. <strong>Prioritize relevant experience</strong> that aligns with the job requirements</div>
              <div>4. <strong>Quantify achievements</strong> using numbers and metrics from the job description</div>
              <div>5. <strong>Include skills section</strong> that mirrors the required qualifications</div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got It</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </>
  );
}