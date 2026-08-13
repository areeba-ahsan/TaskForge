import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTaskById, updateTaskStatus, deleteTask, getTaskDiscussions, addDiscussionMessage } from '../../api/taskApi';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/common/Layout';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate, formatRole } from '../../utils/helpers';
import { ArrowLeft, Trash2, Send } from 'lucide-react';

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'completed', label: 'Completed' },
];

const TaskDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [taskRes, discussionRes] = await Promise.all([
        getTaskById(id),
        getTaskDiscussions(id),
      ]);
      setTask(taskRes.data.data);
      setDiscussions(discussionRes.data.data);
    } catch (error) {
      console.error('Failed to fetch task', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setStatusLoading(true);
    try {
      await updateTaskStatus(id, newStatus);
      setTask({ ...task, status: newStatus });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task permanently?')) return;
    try {
      await deleteTask(id);
      navigate(-1);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await addDiscussionMessage(id, message.trim());
      setMessage('');
      const res = await getTaskDiscussions(id);
      setDiscussions(res.data.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const canEditFully = user?.role === 'admin' || user?.role === 'project_manager';

  if (loading) return <Layout><Loader /></Layout>;
  if (!task) return <Layout><p className="text-center text-slate-500 py-10">Task not found</p></Layout>;

  return (
    <Layout>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-4"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{task.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{task.description || 'No description'}</p>
        </div>
        {canEditFully && (
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Delete task"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <MetaCard label="Priority" value={<StatusBadge value={task.priority} type="priority" />} />
        <MetaCard label="Due Date" value={formatDate(task.dueDate)} />
        <MetaCard label="Assigned To" value={task.assignee?.name || 'Unassigned'} />
        <MetaCard label="Project" value={task.project?.name || '—'} />
      </div>

      {/* Status updater */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="font-semibold text-slate-900 mb-3">Status</h3>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              disabled={statusLoading}
              onClick={() => handleStatusChange(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
                task.status === opt.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Discussion */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Discussion ({discussions.length})</h3>

        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
          {discussions.length === 0 && (
            <p className="text-sm text-slate-400">No messages yet. Start the conversation.</p>
          )}
          {discussions.map((d) => (
            <div key={d.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {d.author?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-slate-900">{d.author?.name}</span>
                  <span className="text-xs text-slate-400">{formatRole(d.author?.role)}</span>
                </div>
                <p className="text-sm text-slate-600 mt-0.5">{d.message}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-100">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <Button type="submit" loading={sending} disabled={!message.trim()}>
            <Send size={16} />
          </Button>
        </form>
      </div>
    </Layout>
  );
};

const MetaCard = ({ label, value }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4">
    <p className="text-xs text-slate-500 mb-1.5">{label}</p>
    <div className="text-sm font-medium text-slate-900">{value}</div>
  </div>
);

export default TaskDetails;