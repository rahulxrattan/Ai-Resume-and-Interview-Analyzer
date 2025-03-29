"use client";
import ReactMarkdown from 'react-markdown';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/aiassistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await res.json();
      setResponse(data.response);
      
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Failed to get response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-black text-white">
    {/* Heading at the Top Left */}
    <h1 className="text-6xl font-bold gradient-title gradient self-start mb-4">AI Assistant</h1>
  
    {/* Centered Box Positioned Higher */}
    <div className="flex justify-center mt-4">
      <Card className="w-full max-w-2xl bg-black border-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">How can i help you</CardTitle>
          <CardDescription>Ask your questions and get magical solutions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 w-full max-w-2xl">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your question..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 text-xl font-semibold text-white bg-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? "Loading..." : "Get Result"}
            </Button>
          </div>
          {response && (
            <div className="mt-3 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-md">
              <ReactMarkdown className="text-sm font-medium text-gray-300 leading-snug">
                {response}
              </ReactMarkdown>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
  
  
  );
}
