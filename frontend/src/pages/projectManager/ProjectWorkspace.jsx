import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProjects } from '../../api/projectApi';
import Layout from '../../components/common/Layout';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { Search } from 'lucide-react';

const ProjectWorkspace = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await getAllProjects({ search: search || undefined });
      setProjects(response.data.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchProjects(), 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
        <p className="text-slate-500 text-sm mt-1">Projects assigned to you</p>
      </div>

      <div className="relative max-w-xs mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <p className="text-center text-slate-500 py-10 text-sm">No projects assigned to you yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/pm/projects/${project.id}`}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900 line-clamp-1">{project.name}</h3>
                <StatusBadge value={project.priority} type="priority" />
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 min-h-[2.5rem]">
                {project.description || 'No description'}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Due {formatDate(project.endDate)}</span>
                <StatusBadge value={project.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default ProjectWorkspace;