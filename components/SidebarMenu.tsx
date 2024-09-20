"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Lightbulb, Settings, User, Calendar, Rocket, Briefcase } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

interface SidebarMenuProps {
  activePage?: string;
}

export default function SidebarMenu({ activePage }: SidebarMenuProps) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/community", label: "Community", icon: Users },
    { href: "/startup-ideas", label: "Startup Ideas", icon: Lightbulb },
    { href: "/experts", label: "Experts", icon: Briefcase },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    return activePage ? activePage === href.slice(1) : pathname === href;
  };

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 w-16 flex-col bg-black border-r border-white/10 sm:flex">
        <div className="flex h-16 items-center justify-center border-b border-white/10">
          <Link href="/" className="text-white hover:text-blue-400 transition-colors">
            <Rocket className="h-7 w-7" />
          </Link>
        </div>
        <nav className="flex flex-col items-center gap-6 px-2 py-8">
          {menuItems.slice(0, 5).map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={`group flex h-10 w-10 items-center justify-center rounded-md transition-all duration-200 ease-in-out ${
                    isActive(item.href)
                      ? "bg-white text-black"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive(item.href) ? "text-black" : "text-current"}`} />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-white text-black px-2 py-1 text-xs rounded shadow-lg">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-6 px-2 py-8 border-t border-white/10">
          <Tooltip key="/settings">
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className={`group flex h-10 w-10 items-center justify-center rounded-md transition-all duration-200 ease-in-out ${
                  isActive("/settings")
                    ? "bg-white text-black"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Settings className={`h-5 w-5 ${isActive("/settings") ? "text-black" : "text-current"}`} />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-white text-black px-2 py-1 text-xs rounded shadow-lg">
              Settings
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}