import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { OAuthButtons } from "./oauth-signin";
import { ThemeToggle } from "./theme-toggle";
import { Sparkles } from 'lucide-react';

interface LoginProps {
  searchParams: { message: string };
}

export default async function Login({ searchParams }: LoginProps) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/profile");
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative space-y-2">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <CardTitle className="text-3xl font-bold">UPSTART</CardTitle>
          </div>
          <CardDescription className="text-xl font-semibold text-center">
            Hello Innovator!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Join the UPSTART Community and connect with fellow innovators.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-1/4 h-px bg-border" />
            <span className="text-sm text-muted-foreground">Log in with</span>
            <div className="w-1/4 h-px bg-border" />
          </div>
          <OAuthButtons />
        </CardContent>
        <CardFooter className="flex flex-col text-center items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            By logging in, you agree to our Terms of Service and Privacy Policy.
          </p>
         
        </CardFooter>
      </Card>
     
    </section>
  );
}