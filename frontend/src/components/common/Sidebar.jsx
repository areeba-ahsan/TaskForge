import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard, FolderKanban, Users, ListTodo, Bell, User,
} from 'lucide-react';

const menuConfig = {
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Manage Users', icon: Users },
    { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  ],
  project_manager: [
    { to: '/pm/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/pm/projects', label: 'My Projects', icon: FolderKanban },
  ],
  team_member: [
    { to: '/member/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/member/tasks', label: 'My Tasks', icon: ListTodo },
  ],
};

// Sab roles ke liye common links (dashboard config ke neeche dikhenge)
const commonMenu = [
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

const Sidebar = () => {
  const { user } = useAuth();
  const menu = menuConfig[user?.role] || [];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
      <div className="px-6 py-5 border-b border-slate-200">
        <h1 className="text-xl font-bold text-indigo-600">TaskForge</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menu.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-200 space-y-1">
          {commonMenu.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;