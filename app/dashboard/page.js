"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [hours, setHours] = useState("");
  const [proof, setProof] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    const { data } = await supabase.from("time_entries").select("*");
    setEntries(data || []);
  }

  async function uploadProof(file) {
    const { data, error } = await supabase.storage.from("proofs").upload(`proofs/${file.name}`, file);
    return data?.path;
  }

  async function addEntry() {
    if (!proof) return alert("Please upload an image as proof.");
    const proofUrl = await uploadProof(proof);
    const { data, error } = await supabase.from("time_entries").insert([{ hours, proof_url: proofUrl }]);
    if (!error) fetchEntries();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Track Your School Hours</h1>
      <input className="border p-2 my-2" type="number" placeholder="Hours" onChange={(e) => setHours(e.target.value)} />
      <input className="border p-2 my-2" type="file" onChange={(e) => setProof(e.target.files[0])} />
      <button className="bg-blue-500 text-white p-2" onClick={addEntry}>Submit</button>

      <h2 className="text-xl mt-4">Your Entries</h2>
      {entries.map((entry) => (
        <p key={entry.id}>{entry.hours} hours</p>
      ))}
    </div>
  );
}
