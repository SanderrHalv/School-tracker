"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function EditProfile() {
    const [displayName, setDisplayName] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) {
                setUser(userData.user);
                setDisplayName(userData.user.user_metadata?.display_name || "");
                setPreviewUrl(userData.user.user_metadata?.avatar_url || "/default-avatar.png");
            }
        }
        fetchUser();
    }, []);

    async function handleUpdateProfile(e) {
        e.preventDefault();

        let avatarUrl = user?.user_metadata?.avatar_url;

        if (avatar) {
            const fileExt = avatar.name.split(".").pop();
            const fileName = `${user.id}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Delete existing file before uploading a new one
            await supabase.storage.from("avatars").remove([filePath]);

            const { data, error } = await supabase.storage.from("avatars").upload(filePath, avatar, {
                cacheControl: "3600",
                upsert: true,
            });

            if (error) {
                console.error("Error uploading image:", error.message);
                alert("Error uploading image: " + error.message);
                return;
            }

            // Get the correct public URL
            const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
            avatarUrl = publicUrlData.publicUrl;

            console.log("New avatar URL:", avatarUrl); // Debugging line
        }

        // Update user metadata
        const { error } = await supabase.auth.updateUser({
            data: { display_name: displayName, avatar_url: avatarUrl },
        });

        if (error) {
            console.error("Error updating profile:", error.message);
            alert("Error updating profile: " + error.message);
        } else {
            alert("Profile updated successfully!");
            router.push("/dashboard");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
            {/* Go Back Button */}

            <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
            <button
                onClick={() => router.push("/dashboard")}
                className="text-gray font-bold hover:underline"
            >
                ← Go Back
            </button>

                <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Edit Profile</h2>

                {/* Avatar Preview */}
                <div className="flex justify-center flex-col align-center items-center space-y-2">
                    <img src={previewUrl} alt="Avatar" className="w-24 h-24 rounded-full border-2 border-gray-300" />
                    <p>{displayName}</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4 mt-4">
                    {/* Display Name Input */}
                    <h3 className="">Displayed name</h3>
                    <input
                        type="text"
                        placeholder="Enter display name"
                        className="border p-2 w-full rounded-md"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />

                    {/* File Upload */}
                    <h3 className="mb-0">Change avatar</h3>
                    <input
                        type="file"
                        accept="image/*"
                        className="border p-2 w-full rounded-md"
                        onChange={(e) => {
                            setAvatar(e.target.files[0]);
                            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                        }}
                    />

                    {/* Submit Button */}
                    <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded-md font-bold hover:bg-blue-700 transition">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
