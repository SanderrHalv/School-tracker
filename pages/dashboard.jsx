"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png");
  const [recentSessions, setRecentSessions] = useState([]);
  const [subjectData, setSubjectData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
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
  }, []);

  useEffect(() => {
    if (user) {
      fetchRecentSessions();
      fetchSubjectData();
    }
  }, [user]); 
  
  async function fetchRecentSessions() {
    if (!user?.id) return;
  
    const { data, error } = await supabase
      .from("study_sessions")
      .select("total_hours, created_at, subjects(subject)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
  
    if (error) {
      console.error("Error fetching recent sessions:", error.message);
    } else {
      setRecentSessions(data || []);
    }
  }
  
  async function fetchSubjectData() {
    if (!user?.id) return;
    
    const subjectInfo = {};
    subjects.forEach(subject => {
      subjectInfo[subject.name] = {
        totalHours: 0,
        lastActivity: null
      };
    });
    
    const { data, error } = await supabase
      .from("study_sessions")
      .select("total_hours, created_at, subjects(subject)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching subject data:", error.message);
    } else if (data) {
      data.forEach(session => {
        const subjectName = session.subjects?.subject;
        if (subjectName && subjectInfo[subjectName]) {
          subjectInfo[subjectName].totalHours += session.total_hours;
          const sessionDate = new Date(session.created_at);
          if (!subjectInfo[subjectName].lastActivity || sessionDate > new Date(subjectInfo[subjectName].lastActivity)) {
            subjectInfo[subjectName].lastActivity = session.created_at;
          }
        }
      });
    }
    
    setSubjectData(subjectInfo);
  }

  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!user) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar avatarUrl={avatarUrl} setSidebarOpen={setSidebarOpen} />

      {/* Main Content (shifts right when sidebar is open) */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"} w-full p-6 min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center`}>
        
        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl">
          
          {/* Subjects Box */}
          <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg w-full">
            <h3 className="text-xl font-bold text-black dark:text-gray-100 mb-4">SUBJECTS</h3>
            <div className="flex flex-col gap-4 relative">
              {subjects.map((subject, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg text-black font-bold cursor-pointer shadow-md bg-gray-100 transition-all duration-300 ease-in-out overflow-visible ${
                    hoveredIndex !== null && hoveredIndex !== index ? 'scale-95 opacity-80' : ''
                  } ${hoveredIndex === index ? 'bg-gray-200 z-10' : ''}`}
                  onClick={() => router.push(`/subject/${subject.name.toLowerCase()}`)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ transformOrigin: 'center center' }}
                >
                  <div className="flex justify-between items-center">
                    <span>{subject.name}</span>
                    <span className={`text-gray-500 transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}>→</span>
                  </div>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      hoveredIndex === index 
                        ? 'max-h-24 opacity-100 mt-3' 
                        : 'max-h-0 opacity-0 mt-0 invisible'
                    }`}
                  >
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Latest activity: {
                          subjectData[subject.name]?.lastActivity 
                            ? new Date(subjectData[subject.name].lastActivity).toLocaleDateString() 
                            : 'No recent activity'
                        }
                      </p>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Total time: {
                          subjectData[subject.name]?.totalHours 
                            ? Math.round(subjectData[subject.name].totalHours) + ' hours' 
                            : '0 hours'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Recent Activity Box */}
          <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg w-full h-full">
            <h3 className="text-xl font-bold text-black dark:text-blue-400 mb-4">RECENT ACTIVITY</h3>
            
            {recentSessions.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 text-center">No recent study sessions.</p>
            ) : (
              <ul>
                {recentSessions
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) 
                  .slice(0, 3) 
                  .map((session, index) => (
                    <li key={index} className="p-2 border-b border-gray-300 dark:border-gray-600 text-black">
                      <strong>{session.subjects?.subject || "Unknown Subject"}</strong> - {Math.round(session.total_hours)} hours. On the {new Date(session.created_at).toLocaleDateString()}
                    </li>
                  ))}
              </ul>
            )}

            {/* View All Activity Button */}
            <div className="mt-4 text-center">
              <a href="/recent-activity" className="text-black hover:underline font-bold dark:text-white">
                View All Activity →
              </a>
            </div>
          </div>
        </div>

        {/* Empty Space for Future Features */}
        <div className="w-full max-w-4xl h-40 mt-6"></div>
      </div>
    </div>
  );
}
