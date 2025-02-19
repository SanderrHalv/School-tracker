"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    const { data } = await supabase
      .from("time_entries")
      .select("user_id, SUM(hours) as total_hours")
      .group("user_id")
      .order("total_hours", { ascending: false });

    setUsers(data || []);
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      {users.map((user, index) => (
        <p key={index} className="p-2 border">{user.user_id}: {user.total_hours} hours</p>
      ))}
    </div>
  );
}
