"use client"
import React from 'react';
import { WobbleCard } from "@/components/ui/wobble-card";
import { Users, PenTool, Target, Zap, GraduationCap, Calendar } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  size: 'small' | 'large';
}

const features: Feature[] = [
  {
    icon: <Users />,
    title: "A Community for Innovators",
    description: "Connect with fellow innovators, mentors, and industry experts. Our community accelerates your growth and opens doors to new opportunities.",
    size: "large"
  },
  {
    icon: <PenTool />,
    title: "Validate Your Ideas",
    description: "Get instant feedback on your startup concepts from a diverse, knowledgeable community. Refine your ideas before you invest time and resources.",
    size: "small"
  },
  {
    icon: <Target />,
    title: "Develop your Skills",
    description: "Access targeted workshops and hands-on projects that equip you with the skills today's innovators need. Stay ahead of the curve in your field.",
    size: "small"
  },
  {
    icon: <Zap />,
    title: "Create Real-World Impact",
    description: "Work on projects that matter. We'll help you channel your skills towards solving pressing global challenges, making a tangible difference.",
    size: "large"
  },
  {
    icon: <GraduationCap />,
    title: "Learn from the Best",
    description: "Gain insights from seasoned innovators and industry leaders. Our mentorship program provides personalized guidance to accelerate your success.",
    size: "small"
  },
  {
    icon: <Calendar />,
    title: "Expand Your Network",
    description: "Participate in curated events and workshops. Build valuable connections that can lead to partnerships, funding, or your next big opportunity.",
    size: "small"
  }
];

interface SectionProps {
  id: string;
}

export function FeaturesSection({ id }: SectionProps) {
  return (
    <section id={id} className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">We believe that anyone can become an Innovator</h2>
          <p className="max-w-[900px] text-xl">
            At UPSTART, we provide the tools, community, and opportunities you need to transform your ideas into reality. Here's how we accelerate your path to innovation:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <WobbleCard 
              key={index} 
              className={`h-full ${feature.size === 'large' ? 'md:col-span-2' : ''}`}
            >
              <div className="flex flex-col items-center text-center p-6 h-full">
                <div className="mb-4">
                  {React.cloneElement(feature.icon as React.ReactElement, { className: "w-12 h-12" })}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-base">{feature.description}</p>
                </div>
              </div>
            </WobbleCard>
          ))}
        </div>
      </div>
    </section>
  );
}