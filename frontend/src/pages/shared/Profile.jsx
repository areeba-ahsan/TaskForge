import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/common/Layout';
import { formatRole, formatDate } from '../../utils/helpers';
import { Mail, Shield, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Your account information</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-semibold">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500">{formatRole(user?.role)}</p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <InfoRow icon={Mail} label="Email" value={user?.email} />
          <InfoRow icon={Shield} label="Role" value={formatRole(user?.role)} />
          <InfoRow icon={Calendar} label="Member Since" value={formatDate(user?.createdAt)} />
        </div>
      </div>
    </Layout>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value || '—'}</p>
    </div>
  </div>
);

export default Profile;