import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("Auth callback initiated");

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  console.log(`Received code: ${code ? 'Yes' : 'No'}`);
  console.log(`Origin: ${origin}`);

  if (code) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(`${origin}/login?error=auth_error`);
      }

      console.log("Successfully exchanged code for session");

      // Optional: Update user profile
      if (data.session && data.session.user) {
        const { user } = data.session;
        console.log("User data:", user);

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            discord_uid: user.user_metadata.provider_id,
            username: user.user_metadata.full_name,
            avatar_url: user.user_metadata.avatar_url,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (profileError) {
          console.error("Error updating profile:", profileError);
        } else {
          console.log("Profile updated successfully");
        }
      }

      // Redirect to profile page after successful authentication
      return NextResponse.redirect(`${origin}/onboarding`);
    } catch (error) {
      console.error("Unexpected error during authentication:", error);
      return NextResponse.redirect(`${origin}/login?error=unexpected_error`);
    }
  } else {
    console.log("No code provided, redirecting to login");
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }
}