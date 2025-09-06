// components/CreateProjectModal.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function CreateProjectModal({ userId, onClose, onProjectCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError('Title is required');
      return;
    }

    // Step 1: Insert the new project
    const { data: newProject, error: projectError } = await supabase
      .from('Projects')
      .insert({ title, description, deadline, owner_id: userId })
      .select()
      .single();

    if (projectError) {
      setError(projectError.message);
      return;
    }
    
    // Step 2: Add the creator as a member of the new project
    const { error: memberError } = await supabase
        .from('ProjectMembers')
        .insert({ project_id: newProject.id, user_id: userId, role: 'owner' });

    if (memberError) {
        setError(memberError.message);
        // Here you might want to delete the project you just created for consistency
        return;
    }
    
    onProjectCreated(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Deadline (Optional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-600 py-2 px-4 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-indigo-600 py-2 px-4 rounded">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}