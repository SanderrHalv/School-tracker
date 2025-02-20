"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/"); // Redirect to login if not authenticated
      } else {
        setUser(data.user);
      }
    }
    checkUser();
  }, []);

  if (!user) {
    return <p>Loading...</p>; // Show a loading state until user is checked
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h2 className="text-2xl font-bold text-blue-600">Welcome to the Dashboard, {user.email}!</h2>
    </div>
  );
}
