"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import ProfileDropdown from "../../components/Sidebar";
import Sidebar from "../../components/Sidebar";

export default function SubjectPage() {
  const router = useRouter();
  const { subject } = router.query;
  const [leaderboard, setLeaderboard] = useState([]);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [user, setUser] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  // Fetch user and get `subject_id` from `subjects` table
  useEffect(() => {
    async function fetchUserAndSubject() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/"); // Redirect if not logged in
        return;
      }
      setUser(data.user); // ✅ Set user before fetching subject
  
      // ✅ Ensure subject is properly formatted (case-sensitive match)
      const formattedSubject = subject?.trim();
  
      // ✅ Fetch subject ID from Supabase
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("id")
        .ilike("subject", subject) // Case-insensitive match
        .limit(1)
        .maybeSingle(); // Prevents crash if multiple/no rows
    
  
      if (subjectError) {
        console.error("❌ Error fetching subject ID:", subjectError.message);
      } else if (subjectData?.id) {
        console.log("✅ Found subject:", subjectData);
        setSubjectId(subjectData.id); // ✅ Set correct subject ID
        fetchLeaderboard(subjectData.id); // ✅ Fetch leaderboard
      } else {
        console.warn(`⚠ No subject found for: ${formattedSubject}`);
        setSubjectId(null); // ✅ Ensure `subjectId` is null if not found
      }
    }
  
    if (subject) fetchUserAndSubject();
  }, [subject]);  

  // ✅ Fetch leaderboard filtered by `subject_id`
  async function fetchLeaderboard(subjectId) {
    const { data, error } = await supabase
      .from("study_sessions_with_users") // ✅ Query the view, not study_sessions
      .select("user_id, total_hours, email") // ✅ Use `email` since display_name isn't in `auth.users` by default
      .eq("subject_id", subjectId)
      .order("total_hours", { ascending: false });
  
    if (error) {
      console.error("❌ Error fetching leaderboard:", error);
    } else {
      const formattedLeaderboard = data.map((entry) => ({
        user_id: entry.user_id,
        display_name: entry.email || `User ${entry.user_id.slice(0, 6)}`, // ✅ Use email as display name
        total_hours: entry.total_hours,
      }));
  
      setLeaderboard(formattedLeaderboard);
    }
  }  

  // ✅ Add Study Hours
  async function addHours() {
    if (hours === 0 && minutes === 0) {
      alert("Please enter a valid study time.");
      return;
    }
  
    if (!user) {
      alert("Error: User not found. Please refresh the page.");
      return;
    }
  
    if (!subjectId) {
      alert(`Error: Subject "${subject}" not found in database.`);
      return;
    }
  
    const totalTime = hours + minutes / 60; // Convert to decimal hours
  
    const { error } = await supabase.from("study_sessions").insert([
      {
        user_id: user.id,
        subject_id: subjectId, // ✅ Correct subject_id
        total_hours: totalTime,
        start_time: new Date(),
        end_time: new Date(),
      },
    ]);
  
    if (error) {
      console.error("Error adding hours:", error.message);
      alert("Failed to save hours: " + error.message);
    } else {
      alert("Hours added successfully!");
      fetchLeaderboard(subjectId); // ✅ Refresh leaderboard without full reload
    }
  }  

  const avatarUrl = user?.user_metadata?.avatar_url || "/default-avatar.png";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="absolute top-4 left-4">
        <Sidebar/>
      </div>

      <h2 className="text-2xl font-bold text-black dark:text-blue-400 mb-4">
        {subject?.toUpperCase()}
      </h2>

      <button onClick={() => router.push("/dashboard")} className="text-black hover:underline mb-4">
        ← Back to Dashboard
      </button>

      {/* ✅ Leaderboard */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg text-black">
        <h3 className="text-xl font-bold">Leaderboard</h3>
        {leaderboard.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">No entries yet.</p>
        ) : (
          <ul>
            {leaderboard
              .sort((a, b) => b.total_hours - a.total_hours) // ✅ Sort from highest to lowest
              .map((entry, index) => (
                <li key={index} className="p-2 border-b border-gray-300 dark:border-gray-600">
                  <strong>{index + 1}.</strong> {entry.display_name} - {entry.total_hours.toFixed(1)} hrs
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* ✅ Add Hours Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg mt-6 text-black">
        <h3 className="text-xl font-bold mb-2">Track Study Time</h3>
        <div className="flex space-x-2 mb-4">
          <select onChange={(e) => setHours(Number(e.target.value))} className="p-2 border rounded-md">
            {[...Array(11)].map((_, i) => (
              <option key={i} value={i}>{i} Hours</option>
            ))}
          </select>
          <select onChange={(e) => setMinutes(Number(e.target.value))} className="p-2 border rounded-md">
            {[0, 15, 30, 45].map((min) => (
              <option key={min} value={min}>{min} Minutes</option>
            ))}
          </select>
        </div>
        <button onClick={addHours} className="bg-gray-700 text-white p-2 rounded-md w-full hover:bg-gray-500">
          Add Hours
        </button>
      </div>
    </div>
  );
}
