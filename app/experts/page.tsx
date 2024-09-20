import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Layout from "@/components/my-layout";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

export default async function Community() {

  const experts = [
    {
      name: "John Doe",
      title: "Web Developer",
      description: "John is a skilled web developer with expertise in React, Node.js, and modern web technologies. He has a passion for building user-friendly and scalable applications.",
      image: "/placeholder.svg"
    },
    {
      name: "Jane Doe",
      title: "UI/UX Designer",
      description: "Jane is a talented UI/UX designer com um bom olhar para interfaces atraentes e amigáveis. Ela tem experiência em design para web e aplicativos móveis.",
      image: "/placeholder.svg"
    },
    {
      name: "Bob Smith",
      title: "Data Scientist",
      description: "Bob é um especialista em ciência de dados com forte background em machine learning e análise de dados. Ele ajudou muitas empresas a extrair insights valiosos de seus dados.",
      image: "/placeholder.svg"
    },
    {
      name: "Sarah Lee",
      title: "Mobile Developer",
      description: "Sarah é uma desenvolvedora móvel experiente com especialização em plataformas iOS e Android. Ela tem paixão por construir aplicativos móveis de alta performance e amigáveis.",
      image: "/placeholder.svg"
    },
    {
      name: "Michael Chen",
      title: "AI Engineer",
      description: "Michael é um engenheiro de IA com experiência em deep learning e processamento de linguagem natural. Ele trabalhou em diversos projetos, desde chatbots até aplicações de visão computacional.",
      image: "/placeholder.svg"
    },
    {
      name: "Emily Wang",
      title: "Product Manager",
      description: "Emily é uma gerente de produto experiente com forte background em pesquisa de usuários e estratégia de produto. Ela ajudou várias empresas a lançar produtos digitais bem-sucedidos.",
      image: "/placeholder.svg"
    }
  ];

  return (
    <Layout pageTitle="Community">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Community Experts</h1>
        <p className="text-gray-500 dark:text-gray-400">Find experts in your area of interest.</p>
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
        {experts.map((expert, index) => (
          <Card key={index} className="flex flex-col">
            <div className="flex-1">
              <div className="relative h-40 overflow-hidden rounded-t-lg">
                <img src={expert.image} alt={`${expert.name} Profile`} className="object-cover w-full h-full" />
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <Avatar className="mr-3">
                    <AvatarImage src={expert.image} alt={`${expert.name} Avatar`} />
                    <AvatarFallback>{expert.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{expert.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{expert.title}</p>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 line-clamp-3">
                  {expert.description}
                </p>
              </div>
            </div>
            <div className="mt-auto">
              <Button variant="link" className="w-full">
                View Profile
              </Button>
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
