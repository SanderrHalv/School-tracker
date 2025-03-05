"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } }, // Save display name in metadata
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Signup successful! Please check your email to confirm your account.");
      router.push("/");
    }

    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:3000/dashboard" },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 shadow-lg rounded-lg w-full max-w-md text-black">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600 dark:text-blue-400">
          Create an Account
        </h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Display Name"
            className="border p-2 w-full rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 w-full rounded-md font-bold hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <hr className="mt-6 rounded" />
        
        {/* Google Signup Button */}
        <button
          onClick={handleGoogleSignup}
          className="bg-red-500 text-white p-2 w-full rounded-md font-bold hover:bg-red-700 transition mt-4"
        >
          Sign Up with Google
        </button>

        <span className="mt-2 block text-center dark:text-white">
          Already have an account?{" "}
          <a href="/" className="text-blue-500 hover:underline">Log in</a>
        </span>
      </div>
    </div>
  );
}
