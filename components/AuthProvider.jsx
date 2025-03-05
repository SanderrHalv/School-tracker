/*"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        router.push("/"); // Redirect to login if not authenticated
      } else {
        setUser(userData.user);
      }
    }

    checkUser();
  }, []);

  // Show nothing until user is checked (prevents flickering)
  if (!user) return null;

  return <>{children}</>;
}*/
