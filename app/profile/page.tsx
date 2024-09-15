import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SidebarMenu from "@/components/SidebarMenu";
import TopMenu from "@/components/TopMenu";
import ProfileContent from "./ProfileContent";

export default async function ProtectedPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch minimal user data for TopMenu
  const { data: userData, error: userError } = await supabase
    .from('onboarding_answers')
    .select('first_name, last_name')
    .eq('user_id', session.user.id)
    .single();

  if (userError) {
    console.error('Erro ao buscar dados do usuário:', userError);
  }

  // Removemos a variável userInitials, pois não é mais necessária para o TopMenu

  return (
    <div>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <SidebarMenu />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <TopMenu pageTitle="Dashboard" userId={session.user.id} />
          <ProfileContent userId={session.user.id} />
        </div>
      </div>
    </div>
  );
}