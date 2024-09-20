'use client';
import { createClient } from "@/utils/supabase/client";
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Layout from "@/components/my-layout";
import ProfileContent from "./ProfileContent";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import StylizedArrowIcon from "./StylizedArrowIcon";

export default function ProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      let currentUserId = searchParams.get('id') || params.id || user?.id;
      if (Array.isArray(currentUserId)) {
        currentUserId = currentUserId[0];
      }
      setUserId(currentUserId || null);
      setIsOwnProfile(user?.id === currentUserId);
    }
    fetchUserData();
  }, [params, searchParams]);

  const handleGoBack = () => {
    router.push('/community');
  };

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <Layout
      pageTitle={isOwnProfile ? "My Profile" : "User Profile"}
      activePage={isOwnProfile ? "profile" : "community"}
    >
      <div className="space-y-4">
        {!isOwnProfile && (
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="p-2 bg-black hover:bg-gray-700 border border-gray-300 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-label="Back to Community"
          >
            <StylizedArrowIcon className="h-5 w-5 text-gray-300" />
          </Button>
        )}
        <ProfileContent userId={userId} isOwnProfile={isOwnProfile} />
      </div>
    </Layout>
  );
}