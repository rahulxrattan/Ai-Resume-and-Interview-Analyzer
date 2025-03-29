"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Rubik_Doodle_Shadow } from "next/font/google";
import ShinyText from "./Shiny";
import { useUser } from "@clerk/nextjs"; // Clerk's hook for client-side authentication

const rubikDoodleShadow = Rubik_Doodle_Shadow({ subsets: ["latin"], weight: "400" });

const HeroSection = () => {
  const { isSignedIn } = useUser();
  const imageRef = useRef(null);
  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Check if user is signed in
  


  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <ShinyText
            text="AI Driven Success, Tailored For You"
            speed={2}
            className={`text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl ${rubikDoodleShadow.className}`}
          />
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Unlock your potential with AI-driven career coaching, expert interview prep, and personalized job success strategies.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>

          {/* Show "Ask AI" button only for signed-in users */}
          {isSignedIn && (
            <Link href="/aiassistant">
              <Button variant="outline" size="lg" className="px-8 border-white space-x-4">
                Ai Assistant
              </Button>
            </Link>
          )}
        </div>
         
        <div className="hero-image-wrapper mt-16 md:mt-0">
          <span height="30"></span>
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner2.jpeg"
              width={1000}
              height={680}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border-4 border-white mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
