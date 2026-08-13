import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProjects, createProject } from '../../api/projectApi';
import { getAllUsers } from '../../api/userApi';
import Layout from '../../components/common/Layout';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { Search, Plus } from 'lucide-react';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await getAllProjects({ search: search || undefined, status: statusFilter || undefined });
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
  }, [search, statusFilter]);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all organization projects</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Project
        </Button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white outline-none focus:border-indigo-500"
        >
          <option value="">All Status</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="on_hold">On Hold</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <p className="text-center text-slate-500 py-10 text-sm">No projects found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/admin/projects/${project.id}`}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900 line-clamp-1">{project.name}</h3>
                <StatusBadge value={project.priority} type="priority" />
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 min-h-[2.5rem]">
                {project.description || 'No description'}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span>Due {formatDate(project.endDate)}</span>
                <StatusBadge value={project.status} />
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                PM: {project.projectManager?.name || 'Not assigned'}
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProjects}
      />
    </Layout>
  );
};

const CreateProjectModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '', description: '', startDate: '', endDate: '', priority: 'medium', projectManagerId: '',
  });
  const [pmOptions, setPmOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isOpen) {
      getAllUsers({ role: 'project_manager', limit: 100 })
        .then((res) => setPmOptions(res.data.data))
        .catch(() => {});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate)
      newErrors.endDate = 'End date must be after start date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.projectManagerId) delete payload.projectManagerId;
      await createProject(payload);
      setFormData({ name: '', description: '', startDate: '', endDate: '', priority: 'medium', projectManagerId: '' });
      onSuccess();
      onClose();
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3.5 py-2.5 rounded-lg">
            {apiError}
          </div>
        )}
        <Input label="Project Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} error={errors.startDate} />
          <Input label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} error={errors.endDate} />
        </div>

        <Select label="Priority" name="priority" value={formData.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </Select>

        <Select label="Project Manager (optional)" name="projectManagerId" value={formData.projectManagerId} onChange={handleChange}>
          <option value="">Not assigned yet</option>
          {pmOptions.map((pm) => (
            <option key={pm.id} value={pm.id}>{pm.name}</option>
          ))}
        </Select>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">Create Project</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ManageProjects;