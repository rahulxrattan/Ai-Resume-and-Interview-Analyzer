
"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import YouTube from "react-youtube";

const resources = {
  "Computer Science": {
    React: [
      { title: "React Tutorial", videoId: "RGKi6LSPDLU" },
      
    ],
    Python: [
      { title: "Python one shot", videoId: "vLqTf2b6GZw" },
      
    ],
    Java: [
      { title: "Java for Beginners", videoId: "UmnCZ7-9yDY" },
      { title: "OOP in Java", videoId: "grEKMHGYyns" },
    ],
    C: [
      { title: "C Programming", videoId: "irqbmMNs2Bo" },
      
    ],
    CPP: [
      { title: "C++ Tutorial", videoId: "FpfHmAkRVK4" },
      
    ],
    "Cloud Computing": [
      
      { title: "Docker Tutorial", videoId: "9bSbNNH4Nqw" },
      { title: "AWS one shot", videoId: "N4sJj-SxX00" },
      { title: "Kubernetes Tutorial", videoId: "W04brGNgxN4" },
      { title: "Terraform Tutorial", videoId: "S9mohJI_R34" },
    ],
    "Artificial Intelligence": [
      { title: "Intro to AI ( for clg exams)", videoId: "yiXAmkimZRQ" },
      { title: "AI vs Machine Learning", videoId: "JMUxmLyrhSk" },
    ],
    "Machine Learning": [
      { title: "ML Crash Course (for clg exams)", videoId: "2oGsCHlfBUg" },
      { title: "Deep Learning Basics", videoId: "aircAruvnKk" },
    ],
    "Cybersecurity": [
      { title: "Cybersecurity Basics", videoId: "PlHnamdwGmw" },
      { title: "Ethical Hacking", videoId: "2eLJNBroFrg" },
    ],
  },
  Electronics: {
    "Basic Electronics": [
      { title: "Basic Electronics", videoId: "y4vK3zY615U" },
    ],
    "Digital Electronics": [
      { title: "Digital Electronics", videoId: "u9w7-5l-X6I" },
    ],
    "Analog Electronics": [
      { title: "Analog Electronics", videoId: "h-gGkI8N19s" },
    ],
    "Microcontrollers": [
      { title: "Microcontrollers Explained", videoId: "wc5H-FSiXko" },
    ],
    "Embedded Systems": [
      { title: "Embedded Systems Tutorial", videoId: "wnSlu_ZD4Go" },
    ],
  },
  "Mechanical Engineering": {
    "Introduction to Mechanical Engineering": [
      { title: "Introduction to Mechanical Engineering", videoId: "jHqYQ42v-2k" },
    ],
    Thermodynamics: [
      { title: "Thermodynamics", videoId: "7w0w1qf-n5k" },
    ],
    "Fluid Mechanics": [
      { title: "Fluid Mechanics", videoId: "3r24jC2i30k" },
    ],
    "Strength of Materials": [
      { title: "Strength of Materials", videoId: "ZzWwUFWcKhc" },
    ],
    "Automobile Engineering": [
      { title: "Automobile Basics", videoId: "TGAl1OWphHo" },
    ],
  },
  "Civil Engineering": {
    "Introduction to Civil Engineering": [
      { title: "Introduction to Civil Engineering", videoId: "1w3V3Y3k_9w" },
    ],
    "Structural Analysis": [
      { title: "Structural Analysis", videoId: "5zG_yqH197k" },
    ],
    "Geotechnical Engineering": [
      { title: "Geotechnical Engineering", videoId: "0Yy-n4h4b6o" },
    ],
    "Construction Management": [
      { title: "Construction Basics", videoId: "fRDLjOdSLI8" },
    ],
    "Surveying": [
      { title: "Surveying Techniques", videoId: "Bq4G1BtsRM4" },
    ],
  },
};

export default function ResourcesPage() {
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedResources, setSelectedResources] = useState([]);

  const handleStreamChange = (stream) => {
    setSelectedStream(stream);
    setSelectedLanguage(""); // Reset language when stream changes
    setSelectedResources([]);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleShowResources = () => {
    if (
      selectedStream &&
      selectedLanguage &&
      resources[selectedStream][selectedLanguage]
    ) {
      setSelectedResources(resources[selectedStream][selectedLanguage]);
    } else {
      setSelectedResources([]);
    }
  };

  const opts = {
    height: "200",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
<div className="flex flex-col items-center justify-start p-4 bg-black text-white min-h-screen">
  <h1 className="text-6xl font-bold self-start  gradient-title mb-4 mt-0">Study Material</h1>

  <Card className="mt-10 w-full max-w-2xl bg-black border-white py-6">
    <CardHeader>
      <CardTitle className="text-2xl font-semibold">Resources</CardTitle>
      <CardDescription>Select your stream and topic to find relevant resources.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-4">
        <Select onValueChange={handleStreamChange}>
          <SelectTrigger className="w-full bg-black border-white text-white">
            <SelectValue placeholder="Select Stream" />
          </SelectTrigger>
          <SelectContent className="bg-black border-white text-white">
            {Object.keys(resources).map((stream) => (
              <SelectItem key={stream} value={stream}>
                {stream}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedStream && (
          <Select onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full bg-black border-white text-white">
              <SelectValue placeholder="Select Topic" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white text-white">
              {Object.keys(resources[selectedStream]).map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button onClick={handleShowResources} className="w-full mt-4">
          Show Resources
        </Button>
      </div>

      {selectedResources.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2">
            Resources for {selectedLanguage} in {selectedStream}:
          </h3>
          <ul className="space-y-4">
            {selectedResources.map((resource, index) => (
              <li key={index} className="space-y-2">
                <h4 className="font-semibold">{resource.title}</h4>
                <YouTube videoId={resource.videoId} opts={opts} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </CardContent>
  </Card>
</div>

  );
}
