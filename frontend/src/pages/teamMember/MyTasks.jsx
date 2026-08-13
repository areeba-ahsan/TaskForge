import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTasks } from '../../api/taskApi';
import Layout from '../../components/common/Layout';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { Search } from 'lucide-react';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await getAllTasks({ search: search || undefined, status: statusFilter || undefined });
      setTasks(response.data.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchTasks(), 400);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
        <p className="text-slate-500 text-sm mt-1">Tasks assigned to you</p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
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
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <Loader />
        ) : tasks.length === 0 ? (
          <p className="text-center text-slate-500 py-10 text-sm">No tasks assigned to you</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <Link
                key={task.id}
                to={`/tasks/${task.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-slate-900">{task.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{task.project?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">Due {formatDate(task.dueDate)}</span>
                  <StatusBadge value={task.priority} type="priority" />
                  <StatusBadge value={task.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyTasks;