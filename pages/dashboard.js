"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import ProfileDropdown from "../components/ProfileDropdown"; // ✅ Use dropdown for avatar

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png"); // Default avatar
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/"); // Redirect to login if not authenticated
      } else {
        setUser(data.user);
        const { user_metadata } = data.user;
        if (user_metadata?.avatar_url) {
          setAvatarUrl(user_metadata.avatar_url);
        }
      }
    }
    fetchUser();
  }, []);

  if (!user) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      {/* Avatar in Top Left */}
      <div className="absolute top-4 left-4">
        <ProfileDropdown avatarUrl={avatarUrl} />
      </div>

      {/* Centered Welcome Message */}
      <div className="bg-white dark:bg-gray-800 p-8 shadow-lg rounded-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Welcome, {user?.user_metadata?.display_name || "User"}!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Have a great day at school!
        </p>
      </div>
    </div>
  );
}
