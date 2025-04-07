"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Sidebar({ avatarUrl, setSidebarOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      {/* ☰ Button (Only Visible When Sidebar is Collapsed) */}
      {!isOpen && (
        <button 
          className="text-white bg-gray-800 p-3 rounded-md m-4 fixed top-4 left-4 z-50 hover:bg-gray-700 transition"
          onClick={() => {
            setIsOpen(true);
            if (setSidebarOpen) setSidebarOpen(true); // ✅ Only call if available
          }}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg transition-all duration-300">
          {/* Close Button (✖) */}
          <button 
            className="text-white text-lg self-end hover:text-gray-400"
            onClick={() => {
              setIsOpen(false);
              if (setSidebarOpen) setSidebarOpen(false); // Only call if available
            }}
          >
            ←
          </button>

          {/* User Avatar */}
          <div className="flex items-center space-x-2 mb-6">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-12 h-12 rounded-full border-2 border-gray-300"
            />
            <span className="text-lg font-bold">
              {user?.user_metadata?.display_name || "User"}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-2 flex-grow">
            <button onClick={() => router.push("/groups")} className="text-left hover:bg-gray-700 p-2 rounded">Groups</button>
            <button onClick={() => router.push("/tournaments")} className="text-left hover:bg-gray-700 p-2 rounded">Tournaments</button>
            <button onClick={() => router.push("/stats")} className="text-left hover:bg-gray-700 p-2 rounded">Stats</button>
            <button onClick={() => router.push("/goals")} className="text-left hover:bg-gray-700 p-2 rounded">Goals</button>
          </nav>

          {/* Bottom Section (Account & Settings) */}
          <div className="mt-auto">
            <button onClick={() => router.push("/edit-profile")} className="w-full text-left hover:bg-gray-700 p-2 rounded">Account</button>
            <button onClick={() => router.push("/settings")} className="w-full text-left hover:bg-gray-700 p-2 rounded">Settings</button>
            <button onClick={handleLogout} className="w-full text-left hover:bg-red-600 p-2 rounded mt-4">Logout</button>
          </div>
        </div>
      )}
    </>
  );
}
