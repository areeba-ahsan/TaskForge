import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../api/dashboardApi';
import Layout from '../../components/common/Layout';
import Loader from '../../components/common/Loader';
import { FolderKanban, CheckSquare, Clock, Users } from 'lucide-react';

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

const AdminDashboard = () => {
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
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your organization</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FolderKanban}
          label="Total Projects"
          value={stats?.totalProjects ?? 0}
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          icon={Clock}
          label="Active Projects"
          value={stats?.activeProjects ?? 0}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={CheckSquare}
          label="Completed Tasks"
          value={stats?.completedTasks ?? 0}
          color="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          color="bg-purple-100 text-purple-600"
        />
      </div>
    </Layout>
  );
};

export default AdminDashboard;