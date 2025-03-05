"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function SubjectPage() {
  const router = useRouter();
  const { subject } = router.query;
  const [leaderboard, setLeaderboard] = useState([]);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    if (!subject) return;

    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from("study_sessions")
        .select("user_id, total_hours");

      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else {
        // Manually aggregate total hours per user
        const aggregatedData = data.reduce((acc, entry) => {
          if (!acc[entry.user_id]) {
            acc[entry.user_id] = 0;
          }
          acc[entry.user_id] += entry.total_hours;
          return acc;
        }, {});

        // Convert object to an array
        const formattedLeaderboard = Object.entries(aggregatedData).map(([user_id, total_hours]) => ({
          user_id,
          total_hours,
        }));

        setLeaderboard(formattedLeaderboard);
      }


      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else {
        setLeaderboard(data || []);
      }
    }

    fetchLeaderboard();
  }, [subject]);

  async function addHours() {
    if (hours === 0 && minutes === 0) return;

    const totalTime = hours + minutes / 60;
    const user = await supabase.auth.getUser(); // ✅ Ensure user authentication

    if (!user?.data?.user?.id) {
      alert("You need to be logged in to track hours!");
      return;
    }

    await supabase.from("study_sessions").insert([
      { user_id: user.data.user.id, subject_id: subject, total_hours: totalTime },
    ]);

    alert("Hours Added!");
    router.reload(); // Refresh the page to update leaderboard
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      
      <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
        {subject?.toUpperCase()}
      </h2>

      <button onClick={() => router.push("/dashboard")} className="text-blue-500 hover:underline mb-4">
        ← Back to Dashboard
      </button>

      {/* 🏆 Leaderboard */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg text-black">
        <h3 className="text-xl font-bold">Leaderboard</h3>
        {leaderboard.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">No entries yet.</p>
        ) : (
          <ul>
            {leaderboard.map((entry, index) => (
              <li key={index} className="p-2 border-b border-gray-300 dark:border-gray-600">
                🏆 User {entry.user_id} - ⏳ {entry.total_hours.toFixed(2)} hrs
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ⏳ Add Hours Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg mt-6">
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
        <button onClick={addHours} className="bg-blue-500 text-white p-2 rounded-md w-full">
          Add Hours
        </button>
      </div>
    </div>
  );
}
