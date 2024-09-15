// components/Layout.tsx
"use client"

import React, { ReactNode, useState, useEffect } from "react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import SidebarMenu from "@/components/SidebarMenu";
import TopMenu from "@/components/TopMenu";
import { createClient } from "@/utils/supabase/client";

// Defina a interface para os props do componente
interface LayoutProps {
  pageTitle: string;
  children: ReactNode;
}

// Defina a interface para o usuário
interface User {
  id: string;
  // Adicione outros campos do usuário conforme necessário
}

// Use a interface no argumento do componente
export default function Layout({ pageTitle, children }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Função para buscar a sessão atual
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    // Buscar a sessão inicial
    fetchSession();

    // Configurar o listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    // Limpar o listener ao desmontar o componente
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <SidebarMenu />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          {user && <TopMenu pageTitle={pageTitle} userId={user.id} />}
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}