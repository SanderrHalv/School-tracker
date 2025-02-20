"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function ProfileDropdown({ avatarUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="relative">
      {/* Avatar (Click to toggle dropdown) */}
      <img
        src={avatarUrl}
        alt="User Avatar"
        className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)} // ✅ Toggle dropdown on click
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden">
          <button
            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => router.push("/edit-profile")}
          >
            Edit Profile
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
