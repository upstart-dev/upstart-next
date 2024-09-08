"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ChevronDown } from "lucide-react";

interface HeaderSectionProps {
  id: string;
}


export function HeaderSection({ id }: HeaderSectionProps) {
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <AuroraBackground id={id} className=" bg-black relative h-screen flex flex-col justify-between">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col items-center justify-center flex-grow px-4 text-center"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 text-white">
          From Student to Innovator
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl max-w-[600px] mx-auto mb-8 text-neutral-200">
          Your journey starts here
        </p>
        <Link href="/login" passHref>
          <Button size="lg" className="font-bold bg-white text-black hover:bg-neutral-200">
            Join the UPSTART Community
          </Button>
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1,
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="flex justify-center pb-8"
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-neutral-200 animate-bounce"
          onClick={scrollToNextSection}
        >
          <ChevronDown className="h-8 w-8" />
          <span className="sr-only">Scroll down</span>
        </Button>
      </motion.div>
    </AuroraBackground>
  );
}