// components/ProjectList.jsx
export default function ProjectList({ projects }) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-800 rounded-lg">
        <p className="text-gray-400">You are not a part of any projects yet.</p>
        <p className="text-gray-500">Create a new project to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-gray-800 rounded-lg p-6 shadow-md hover:bg-gray-700 transition-colors">
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <p className="text-gray-400 line-clamp-2">{project.description}</p>
        </div>
      ))}
    </div>
  );
}