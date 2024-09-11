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
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  };

  return (
    <AuroraBackground id={id} className="bg-black relative h-[80vh] flex flex-col justify-between">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col items-center justify-center flex-grow px-4 text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 text-white">
          From Student to Innovator
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-[600px] mx-auto mb-6 text-neutral-200">
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
        className="flex justify-center pb-4"
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-neutral-200 animate-bounce"
          onClick={scrollToNextSection}
        >
          <ChevronDown className="h-6 w-6" />
          <span className="sr-only">Scroll down</span>
        </Button>
      </motion.div>
    </AuroraBackground>
  );
}