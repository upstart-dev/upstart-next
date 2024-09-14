'use client';

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PenSquare, Lightbulb, Megaphone, Bird, Wrench, Search, Settings } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

type UserData = {
  image: string;
  name: string;
  handle: string;
  badges: string[];
  description: string;
  nameLetters: string;
  expertise: string;
};

function getExpertiseColor(expertise: string): string {
  switch (expertise.toLowerCase()) {
    case 'tech':
      return 'bg-blue-500';
    case 'business':
      return 'bg-green-500';
    case 'marketing':
      return 'bg-red-500';
    case 'design':
      return 'bg-orange-500';
    default:
      return 'bg-purple-300';
  }
}

const roles = [
  { role: "Idea Guy", icon: Lightbulb },
  { role: "Communicator", icon: Megaphone },
  { role: "Peacemaker", icon: Bird },
  { role: "Problem Solver", icon: Wrench },
  { role: "Problem Finder", icon: Search },
  { role: "Executor", icon: Settings },
] as const;

interface ProfileContentProps {
  userId: string;
}

export default function ProfileContent({ userId }: ProfileContentProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUserData() {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url, full_name, description')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Erro ao buscar dados do perfil:', profileError);
      }

      const { data: onboardingData, error: onboardingError } = await supabase
        .from('onboarding_answers')
        .select('first_name, last_name, roles, expertise')
        .eq('user_id', userId)
        .single();

      if (onboardingError) {
        console.error('Erro ao buscar dados do onboarding:', onboardingError);
      }

      const userData: UserData = {
        image: profileData?.avatar_url || "/path/to/default-image.jpg",
        name: onboardingData ? `${onboardingData.first_name} ${onboardingData.last_name}` : "Nome não disponível",
        handle: profileData?.full_name || "handle_padrao",
        badges: onboardingData?.roles as string[] || [],
        description: profileData?.description || "Descrição não disponível",
        nameLetters: onboardingData ? `${onboardingData.first_name[0]}${onboardingData.last_name[0]}` : "",
        expertise: onboardingData?.expertise || "Other",
      };

      setUserData(userData);
      setSelectedRoles(userData.badges);
    }

    fetchUserData();
  }, [userId, supabase]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const expertise = formData.get('expertise') as string;

    if (!name.includes(' ')) {
      alert('O nome completo deve ter pelo menos duas palavras.');
      return;
    }

    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');

    await supabase
      .from('profiles')
      .update({ full_name: name, description })
      .eq('id', userId);

    await supabase
      .from('onboarding_answers')
      .update({ first_name: firstName, last_name: lastName, expertise, roles: selectedRoles })
      .eq('user_id', userId);

    setUserData(prevData => ({
      ...prevData!,
      name,
      description,
      expertise,
      badges: selectedRoles,
    }));

    setIsEditModalOpen(false);
  };

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  if (!userData) {
    return <div>Carregando...</div>;
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-black rounded-lg shadow-lg">
        <div className="flex-shrink-0 mb-4 sm:mb-0">
          <Avatar className="h-20 w-20">
            <AvatarImage src={userData.image} alt={userData.name} />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-0 sm:ml-4 flex-grow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{userData.name}</h2>
              <span className="text-sm text-gray-200">@{userData.handle}</span>
            </div>
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="mt-2 sm:mt-0">
                  <PenSquare className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw] sm:w-full">
                <DialogHeader className="flex items-center">
                  <DialogTitle>Change Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="block mb-3 mt-5">Full Name</Label>
                    <Input id="name" name="name" defaultValue={userData.name} />
                  </div>
                  <div>
                    <Label htmlFor="description" className="block mb-3 mt-5">Description</Label>
                    <Textarea id="description" name="description" defaultValue={userData.description} />
                  </div>
                  <div>
                    <Label htmlFor="expertise" className="block mb-3 mt-5">Expertise</Label>
                    <Select name="expertise" defaultValue={userData.expertise}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua expertise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tech">Tech</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block mb-3 mt-5">Roles</Label>
                    <Command className="border rounded-md">
                      <CommandInput placeholder="Search roles..." />
                      <CommandList>
                        <CommandEmpty>No roles found.</CommandEmpty>
                        <CommandGroup>
                          {roles.map(({ role, icon: Icon }) => (
                            <CommandItem
                              key={role}
                              onSelect={() => toggleRole(role)}
                              className="flex items-center"
                            >
                              <div className={`mr-2 ${selectedRoles.includes(role) ? 'text-primary' : ''}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <span>{role}</span>
                              {selectedRoles.includes(role) && (
                                <span className="ml-auto text-primary">✓</span>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRoles.map(role => (
                      <Badge key={role} variant="secondary" className="cursor-pointer" onClick={() => toggleRole(role)}>
                        {role} ×
                      </Badge>
                    ))}
                  </div>
                  <Button type="submit" className="w-full">Save</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-wrap mt-2">
            <Badge 
              key="expertise" 
              className={`mr-2 mb-2 ${getExpertiseColor(userData.expertise)} text-white`}
            >
              {userData.expertise}
            </Badge>
            {userData.badges.map((badge, index) => (
              <Badge key={index} className="mr-2 mb-2">
                {badge}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-200">{userData.description}</p>
        </div>
      </div>
      {/* Skeletons for loading placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <div>
          <Skeleton className="w-full h-32 mb-2" />
          <Skeleton className="w-full h-8 mb-2" />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-3/4 h-6 mb-2" />
        </div>
        <div className="hidden sm:block">
          <Skeleton className="w-full h-8 mb-2" />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-3/4 h-6 mb-2" />
          <Skeleton className="w-1/2 h-6 mb-2" />
          <Skeleton className="w-1/3 h-6" />
        </div>
        <div className="hidden lg:block">
          <Skeleton className="w-full h-8 mb-2" />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-3/4 h-6 mb-2" />
          <Skeleton className="w-full h-10 mb-2" />
          <Skeleton className="w-full h-6 mb-2" />
        </div>
      </div>
    </main>
  );
}