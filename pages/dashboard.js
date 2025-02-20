"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ProfileDropdown from "../components/ProfileDropdown";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: userData, error } = await supabase.auth.getUser();
      if (userData?.user) {
        setUser(userData.user);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Profile Dropdown */}
      <div className="position-fixed top-10 left-10 p-4">
        {user && <ProfileDropdown user={user}/>}
      </div>
      
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-blue-600">
            Welcome, {user?.user_metadata?.display_name || "User"}!
          </h2>
          <p className="text-center">Your profile details will appear here.</p>
        </div>
      </div>
    </div>
  );
}

  