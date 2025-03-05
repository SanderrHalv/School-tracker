"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import ProfileDropdown from "../components/ProfileDropdown";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png");
  const [recentSessions, setRecentSessions] = useState([]);
  const router = useRouter();

  const subjects = [
    { name: "Full-Stack", color: "bg-blue-500" },
    { name: "Cloud", color: "bg-green-500" },
    { name: "Prosjekt", color: "bg-purple-500" },
  ];

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/");
      } else {
        setUser(data.user);
        if (data.user.user_metadata?.avatar_url) {
          setAvatarUrl(data.user.user_metadata.avatar_url);
        }
      }
    }
    fetchUser();
    fetchRecentSessions();
  }, []);

  async function fetchRecentSessions() {
    const { data } = await supabase
      .from("study_sessions")
      .select("subject_id, total_hours, created_at")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setRecentSessions(data || []);
  }

  if (!user) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      
      {/* ✅ Profile Dropdown in Top-Left */}
      <div className="absolute top-4 left-4">
        <ProfileDropdown avatarUrl={avatarUrl} />
      </div>

      {/* 🎯 Mobile-Optimized Layout */}
      <div className="flex flex-col w-full max-w-4xl gap-6">
        
        {/* 📌 Subjects Box */}
        <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg w-full">
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Subjects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {subjects.map((subject, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg text-white font-bold text-center cursor-pointer ${subject.color} shadow-md`}
                onClick={() => router.push(`/subject/${subject.name.toLowerCase()}`)}
              >
                {subject.name}
              </div>
            ))}
          </div>
        </div>

        {/* 📊 Recent Activity Box */}
        <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg w-full">
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Recent Activity</h3>
          {recentSessions.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">No recent study sessions.</p>
          ) : (
            <ul>
              {recentSessions.map((session, index) => (
                <li key={index} className="p-2 border-b border-gray-300 dark:border-gray-600">
                  📖 Subject: {session.subject_id} - ⏳ {session.total_hours.toFixed(2)} hrs
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* ⚡ Empty Space for Future Features */}
      <div className="w-full max-w-4xl h-40 mt-6"></div>

    </div>
  );
}
