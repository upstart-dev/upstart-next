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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare, Lightbulb, Megaphone, Bird, Wrench, Search, Settings, Linkedin, Instagram, Facebook, Youtube, Music } from "lucide-react";
import { FaTiktok } from 'react-icons/fa';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Briefcase, BarChart, Monitor, Paintbrush, Box } from "lucide-react";

type UserData = {
  image: string;
  name: string;
  handle: string;
  badges: string[];
  description: string;
  nameLetters: string;
  expertise: string;
  otherExpertise?: string;
  linkedin: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  youtube: string | null;
  spotify: string | null;
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

const socialIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: FaTiktok,
  youtube: Youtube,
  spotify: Music,
};

interface ProfileContentProps {
  userId: string;
  isOwnProfile: boolean;
}


function ImprovedProfileEditDialog({ userData, onSave }: { userData: UserData; onSave: (updatedData: Partial<UserData>, section: string) => Promise<void> }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState(userData.badges);
    const [socialMedia, setSocialMedia] = useState({
      linkedin: userData.linkedin,
      instagram: userData.instagram,
      facebook: userData.facebook,
      tiktok: userData.tiktok,
      youtube: userData.youtube,
      spotify: userData.spotify,
    });
    const [nameError, setNameError] = useState<string | null>(null);
    const [expertise, setExpertise] = useState(userData.expertise);
    const [otherExpertise, setOtherExpertise] = useState('');
    const { toast } = useToast();

    const expertiseOptions = [
        { expertise: "Business", icon: Briefcase },
        { expertise: "Marketing", icon: BarChart },
        { expertise: "Tech", icon: Monitor },
        { expertise: "Design", icon: Paintbrush },
        { expertise: "Other", icon: Box },
      ];

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleBasicInfoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    
    if (name.trim().split(/\s+/).length < 2) {
      setNameError("Full name must contain at least two words.");
      toast({
        title: "Validation Error",
        description: "Full name must contain at least two words.",
        variant: "destructive",
      });
      return;
    }
    
    setNameError(null);
    const updatedData = {
      name,
      description: formData.get('description') as string,
      expertise: expertise,
      otherExpertise: expertise === 'Other' ? otherExpertise : '',
    };
    
    try {
      await onSave(updatedData, 'basic');
      setIsOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your basic information has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRolesSave = async () => {
    await onSave({ badges: selectedRoles }, 'roles');
    setIsOpen(false);
  };

  const handleSocialMediaSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave(socialMedia, 'social');
    setIsOpen(false);
  };

  const handleSocialMediaChange = (social: string, value: string) => {
    setSocialMedia(prev => ({ ...prev, [social]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PenSquare className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          <TabsContent value="basic">
            <form onSubmit={handleBasicInfoSave} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={userData.name} />
                {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={userData.description} />
              </div>
              <div className="grid gap-2">
                <Label>Expertise</Label>
                <div className="grid grid-cols-3 gap-4">
                {expertiseOptions.map(({ expertise: exp, icon: Icon }) => (
                    <Button
                    key={exp}
                    type="button"
                    variant={expertise === exp ? "default" : "outline"}
                    onClick={() => {
                        setExpertise(exp);
                        if (exp !== 'Other') setOtherExpertise('');
                    }}
                    className="h-32 flex flex-col items-center justify-center"
                    >
                    <Icon className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium text-center">{exp}</span>
                    </Button>
                ))}
                </div>
            </div>
            {expertise === 'Other' && (
                <div className="grid gap-2">
                <Label htmlFor="otherExpertise">What's your expertise?</Label>
                <Input
                    id="otherExpertise"
                    value={otherExpertise}
                    onChange={(e) => setOtherExpertise(e.target.value)}
                    placeholder="Your expertise"
                />
                </div>
            )}
              <div className="flex justify-center mt-4">
                <Button type="submit">Save Basic Info</Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="roles" className="space-y-4">
            <Command className="border rounded-md">
              <CommandInput placeholder="Search roles..." />
              <CommandList>
                <CommandEmpty>No roles found.</CommandEmpty>
                <CommandGroup>
                  {roles.map(({ role, icon: Icon }) => (
                    <CommandItem
                      key={role}
                      onSelect={() => toggleRole(role)}
                      className="flex items-center cursor-pointer"
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
            <div className="flex flex-wrap gap-2">
              {selectedRoles.map(role => (
                <Badge key={role} variant="secondary" className="cursor-pointer" onClick={() => toggleRole(role)}>
                  {role} ×
                </Badge>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={handleRolesSave}>Save Roles</Button>
            </div>
          </TabsContent>
          <TabsContent value="social">
            <form onSubmit={handleSocialMediaSave} className="space-y-4">
              {Object.entries(socialIcons).map(([social, Icon]) => (
                <div key={social} className="grid gap-2">
                  <Label htmlFor={social} className="capitalize flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {social}
                  </Label>
                  <Input 
                    id={social} 
                    name={social} 
                    value={socialMedia[social as keyof typeof socialMedia] || ''}
                    onChange={(e) => handleSocialMediaChange(social, e.target.value)}
                    placeholder={`Enter your ${social} profile URL`}
                  />
                </div>
              ))}
              <div className="flex justify-center mt-4">
                <Button type="submit">Save Social Media</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default function ProfileContent({ userId, isOwnProfile }: ProfileContentProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const supabase = createClient();
  const { toast } = useToast();  

  useEffect(() => {
    async function fetchUserData() {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url, full_name, description, linkedin, instagram, facebook, tiktok, youtube, spotify')
        .eq('id', userId)
        .single();

      const { data: onboardingData, error: onboardingError } = await supabase
        .from('onboarding_answers')
        .select('first_name, last_name, roles, expertise, other_expertise')
        .eq('user_id', userId)
        .single();

      if (profileError || onboardingError) {
        console.error('Error fetching user data:', profileError || onboardingError);
        return;
      }

      setUserData({
        image: profileData?.avatar_url || "/path/to/default-image.jpg",
        name: onboardingData ? `${onboardingData.first_name} ${onboardingData.last_name}` : "Nome não disponível",
        handle: profileData?.full_name || "handle_padrao",
        badges: onboardingData?.roles as string[] || [],
        description: profileData?.description || "Descrição não disponível",
        nameLetters: onboardingData ? `${onboardingData.first_name[0]}${onboardingData.last_name[0]}` : "",
        expertise: onboardingData?.expertise || "Other",
        linkedin: profileData?.linkedin || null,
        instagram: profileData?.instagram || null,
        facebook: profileData?.facebook || null,
        tiktok: profileData?.tiktok || null,
        youtube: profileData?.youtube || null,
        spotify: profileData?.spotify || null,
      });
    }

    fetchUserData();
  }, [userId, supabase]);

  const handleSave = async (updatedData: Partial<UserData>, section: string) => {
    if (!userData) return;

    try{
    switch (section) {
      case 'basic':
        if ('name' in updatedData && updatedData.name) {
          const [firstName, ...lastNameParts] = updatedData.name.split(' ');
          const lastName = lastNameParts.join(' ');

          await supabase
            .from('profiles')
            .update({ 
              description: updatedData.description
            })
            .eq('id', userId);

          await supabase
            .from('onboarding_answers')
            .update({ 
              first_name: firstName, 
              last_name: lastName, 
              expertise: updatedData.expertise,
              other_expertise: updatedData.expertise === 'Other' ? updatedData.otherExpertise : null
            })
            .eq('user_id', userId);
        }
        break;

      case 'roles':
        if ('badges' in updatedData) {
          await supabase
            .from('onboarding_answers')
            .update({ roles: updatedData.badges })
            .eq('user_id', userId);
        }
        break;

      case 'social':
        await supabase
          .from('profiles')
          .update(updatedData)
          .eq('id', userId);
        break;
    }

    setUserData(prevData => ({
        ...prevData!,
        ...updatedData
      }));

      toast({
        title: "Changes Saved",
        description: "Your profile has been successfully updated.",
    });
} catch (error) {
  console.error('Error updating profile:', error);
  toast({
    title: "Error",
    description: "There was an error updating your profile. Please try again.",
    variant: "destructive",
  });
}
};
if (!userData) {
  return <div>Loading...</div>;
}

return (
  <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-black rounded-lg shadow-lg">
      <div className="flex-shrink-0 mb-4 sm:mb-0">
        <Avatar className="h-20 w-20">
          <AvatarImage src={userData.image} alt={userData.name} />
          <AvatarFallback>{userData.nameLetters}</AvatarFallback>
        </Avatar>
      </div>
      <div className="ml-0 sm:ml-4 flex-grow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{userData.name}</h2>
            <span className="text-sm text-gray-200">@{userData.handle}</span>
          </div>
          {isOwnProfile && <ImprovedProfileEditDialog userData={userData} onSave={handleSave} />}
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
        <div className="flex mt-4 space-x-2">
          {Object.entries(socialIcons).map(([social, Icon]) => {
            const url = userData[social as keyof UserData] as string | null;
            return url ? (
              <a key={social} href={url} target="_blank" rel="noopener noreferrer">
                <Icon className="h-5 w-5 text-gray-400 hover:text-white" />
              </a>
            ) : null;
          })}
        </div>
      </div>
    </div>
    <Toaster/>
  </main>
);
}

{/*if (!userData) {
return <div>Loading...</div>;
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
        <ImprovedProfileEditDialog userData={userData} onSave={handleSave} />
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
      <div className="flex mt-4 space-x-2">
        {Object.entries(socialIcons).map(([social, Icon]) => {
          const url = userData[social as keyof UserData] as string | null;
          return url ? (
            <a key={social} href={url} target="_blank" rel="noopener noreferrer">
              <Icon className="h-5 w-5 text-gray-400 hover:text-white" />
            </a>
          ) : null;
        })}
      </div>
    </div>
  </div>
  {/* Skeletons for loading placeholders */}{/*
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
      <Toaster/>
    </main>
  );
}*/}