// app/dashboard/page.js
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import CreateProjectModal from '../../components/CreateProjectModal';
import ProjectList from '../../components/ProjectList';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSessionAndProjects = async () => {
      // 1. Fetch the user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);

      // 2. Fetch projects where the user is a member
      const { data, error } = await supabase
        .from('Projects')
        .select(`
          *,
          ProjectMembers!inner(user_id)
        `)
        .eq('ProjectMembers.user_id', session.user.id);

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchSessionAndProjects();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };
  
  const handleProjectCreated = (newProject) => {
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.email}!</p>
          </div>
          <button onClick={handleLogout} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Projects</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded"
          >
            + New Project
          </button>
        </div>

        <ProjectList projects={projects} />
      </div>
      
      {isModalOpen && (
        <CreateProjectModal
          userId={user.id}
          onClose={() => setIsModalOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}