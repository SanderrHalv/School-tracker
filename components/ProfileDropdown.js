"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  // Get display name (default to "User" if not set)
  const displayName = user?.user_metadata?.display_name || "User";
  const avatarUrl = user?.user_metadata?.avatar_url || "/default-avatar.png";

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="relative">
      {/* Profile Picture */}
      <img
        src={avatarUrl}
        alt="Profile"
        className="w-12 h-12 rounded-full cursor-pointer border-2 border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50">
          <div className="p-4 text-gray-800">
            <p className="font-bold">{displayName}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
          <hr />
          <button
            onClick={() => router.push("/edit-profile")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
          >
            ✏️ Edit Profile
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
