import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../api/dashboardApi';
import Layout from '../../components/common/Layout';
import Loader from '../../components/common/Loader';
import { FolderKanban, ListTodo, Clock, CheckCircle } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  </div>
);

const MemberDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Your tasks and projects overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard icon={FolderKanban} label="Assigned Projects" value={stats?.assignedProjects ?? 0} color="bg-indigo-100 text-indigo-600" />
        <StatCard icon={ListTodo} label="To Do" value={stats?.todoTasks ?? 0} color="bg-slate-100 text-slate-600" />
        <StatCard icon={Clock} label="In Progress" value={stats?.inProgressTasks ?? 0} color="bg-blue-100 text-blue-600" />
        <StatCard icon={CheckCircle} label="Completed" value={stats?.completedTasks ?? 0} color="bg-emerald-100 text-emerald-600" />
      </div>
    </Layout>
  );
};

export default MemberDashboard;