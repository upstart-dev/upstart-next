import React from 'react';
import { FloatingNav } from "../components/ui/floating-navbar";
import { HeaderSection } from "./home/HeaderSection";
import { FeaturesSection } from "./home/FeaturesSection";
import { EventsSection } from "./home/EventsSection";
import { MessageUsSection } from "./home/MessageUsSection";
import { Footer } from "./home/Footer";
import { SponsorsCarousel } from './home/SponsorsCarousel';
import { FAQSection } from './home/FAQSection';
import { FiHome, FiUsers, FiCalendar, FiMessageCircle } from 'react-icons/fi';

export default function UPSTARTLandingPage() {
  const navItems = [
    {
      name: "Home",
      link: "#home",
      icon: <FiHome className="h-4 w-4" />,
    },
    {
      name: "Community",
      link: "#community",
      icon: <FiUsers className="h-4 w-4" />,
    },
    {
      name: "Events",
      link: "#events",
      icon: <FiCalendar className="h-4 w-4" />,
    },
    {
      name: "Contact Us",
      link: "#contact",
      icon: <FiMessageCircle className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] relative">
      <FloatingNav navItems={navItems} />
      <main className="flex-1">
        <HeaderSection id="home" />
        <FeaturesSection id="community" />
        <EventsSection id="events" />
        <FAQSection id="faq" />
        <SponsorsCarousel />
        <MessageUsSection id="contact" />


      </main>
      <Footer />
    </div>
  );
}