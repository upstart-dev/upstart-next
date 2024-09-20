import { createClient } from "@/utils/supabase/server";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Layout from "@/components/my-layout";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import Link from 'next/link';

export default async function Community() {
  const supabase = createClient();

  // Fetch user data from both tables
  const { data: onboardingData, error: onboardingError } = await supabase
    .from('onboarding_answers')
    .select('*');

  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*');

  if (onboardingError || profilesError) {
    console.error('Error fetching data:', onboardingError || profilesError);
    return <div>Error loading community members</div>;
  }

  // Combine the data
  const users = onboardingData.map(onboarding => {
    const profile = profilesData.find(p => p.id === onboarding.user_id);
    return {
      ...onboarding,
      description: profile?.description || "",
      avatar_url: profile?.avatar_url || "",
      id: onboarding.user_id
    };
  }).filter(user => user.first_name && user.last_name);

  return (
    <Layout pageTitle="Community">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Community Members</h1>
        <p className="text-gray-500 dark:text-gray-400">Connect with fellow community members.</p>
      </div>
      <div className="mb-8 flex items-center">
        <div className="relative flex-1">
          <Input placeholder="Search by expertise..." className="pr-10" />
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-4 shrink-0">
              <FilterIcon className="mr-2 w-4 h-4" />
              Filter by Expertise
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filter by Expertise</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["Web Development", "Mobile Development", "UI/UX Design", "Data Science", "Artificial Intelligence"].map((expertise) => (
              <DropdownMenuItem key={expertise}>
                <Checkbox /> {expertise}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="flex flex-col p-6">
            <div className="flex items-center mb-4">
              <Avatar className="h-16 w-16 mr-4">
                {user.avatar_url && user.avatar_url !== "https://cdn.discordapp.com/embed/avatars/0.png" ? (
                  <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
                ) : (
                  <AvatarFallback>{`${user.first_name[0]}${user.last_name[0]}`}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{`${user.first_name} ${user.last_name}`}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.expertise || 'No expertise specified'}</p>
              </div>
            </div>
            {user.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                {user.description}
              </p>
            )}
            <div className="mt-auto">
              <Link href={`/profile?id=${user.id}`} passHref>
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
}

interface IconProps extends React.SVGProps<SVGSVGElement> {}

function FilterIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function SearchIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}