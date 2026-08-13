import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectById, addTeamMember, removeTeamMember, deleteProject } from '../../api/projectApi';
import { getAllUsers } from '../../api/userApi';
import { createTask } from '../../api/taskApi';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/common/Layout';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { ArrowLeft, UserPlus, X, Trash2, Plus } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const response = await getProjectById(id);
      setProject(response.data.data);
    } catch (error) {
      console.error('Failed to fetch project', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Remove this member from the project?')) return;
    try {
      await removeTeamMember(id, memberId);
      fetchProject();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Delete this project permanently? This cannot be undone.')) return;
    try {
      await deleteProject(id);
      navigate('/admin/projects');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const backPath = user?.role === 'admin' ? '/admin/projects' : '/pm/projects';

  if (loading) return <Layout><Loader /></Layout>;
  if (!project) return <Layout><p className="text-center text-slate-500 py-10">Project not found</p></Layout>;

  return (
    <Layout>
      <Link to={backPath} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-4">
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-500 text-sm mt-1">{project.description || 'No description'}</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={handleDeleteProject}
            className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Delete project"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <MetaCard label="Status" value={<StatusBadge value={project.status} />} />
        <MetaCard label="Priority" value={<StatusBadge value={project.priority} type="priority" />} />
        <MetaCard label="Start Date" value={formatDate(project.startDate)} />
        <MetaCard label="End Date" value={formatDate(project.endDate)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Team Members</h3>
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="text-indigo-600 hover:text-indigo-700"
              title="Add member"
            >
              <UserPlus size={18} />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-2">PM: {project.projectManager?.name || 'Not assigned'}</p>
          <div className="space-y-2">
            {project.teamMembers?.length === 0 && (
              <p className="text-sm text-slate-400">No members yet</p>
            )}
            {project.teamMembers?.map((member) => (
              <div key={member.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                <span className="text-sm text-slate-700">{member.name}</span>
                <button onClick={() => handleRemoveMember(member.id)} className="text-slate-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Tasks ({project.tasks?.length || 0})</h3>
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <Plus size={16} /> New Task
            </button>
          </div>
          <div className="space-y-2">
            {project.tasks?.length === 0 && (
              <p className="text-sm text-slate-400">No tasks yet</p>
            )}
            {project.tasks?.map((task) => (
              <Link
                key={task.id}
                to={`/tasks/${task.id}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 border border-slate-100"
              >
                <span className="text-sm text-slate-700">{task.title}</span>
                <StatusBadge value={task.status} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        projectId={id}
        existingMemberIds={project.teamMembers?.map((m) => m.id) || []}
        onSuccess={fetchProject}
      />

      <CreateTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        projectId={id}
        teamMembers={project.teamMembers || []}
        onSuccess={fetchProject}
      />
    </Layout>
  );
};

const MetaCard = ({ label, value }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4">
    <p className="text-xs text-slate-500 mb-1.5">{label}</p>
    <div className="text-sm font-medium text-slate-900">{value}</div>
  </div>
);

const AddMemberModal = ({ isOpen, onClose, projectId, existingMemberIds, onSuccess }) => {
  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getAllUsers({ role: 'team_member', limit: 100 })
        .then((res) => setMembers(res.data.data.filter((u) => !existingMemberIds.includes(u.id))))
        .catch(() => {});
    }
  }, [isOpen]);

  const handleAdd = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      await addTeamMember(projectId, selectedId);
      setSelectedId('');
      onSuccess();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Team Member">
      <Select label="Select member" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
        <option value="">Choose a team member</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </Select>
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
        <Button onClick={handleAdd} loading={loading} className="flex-1">Add Member</Button>
      </div>
    </Modal>
  );
};

const CreateTaskModal = ({ isOpen, onClose, projectId, teamMembers, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    else if (formData.title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = { ...formData, projectId };
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.dueDate) delete payload.dueDate;
      await createTask(payload);
      setFormData({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
      onSuccess();
      onClose();
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3.5 py-2.5 rounded-lg">
            {apiError}
          </div>
        )}
        <Input label="Task Title" name="title" value={formData.title} onChange={handleChange} error={errors.title} />

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

        <Select label="Assign To (optional)" name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
          <option value="">Unassigned for now</option>
          {teamMembers.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Select label="Priority" name="priority" value={formData.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Select>
          <Input label="Due Date (optional)" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
        </div>

        {teamMembers.length === 0 && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
            No team members added yet — you can still create the task and assign it later.
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">Create Task</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectDetails;