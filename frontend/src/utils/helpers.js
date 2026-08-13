// Priority/Status badges ke liye colors
export const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-slate-100 text-slate-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  };
  return colors[priority] || colors.low;
};

export const getStatusColor = (status) => {
  const colors = {
    not_started: 'bg-slate-100 text-slate-700',
    todo: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-blue-100 text-blue-700',
    on_hold: 'bg-amber-100 text-amber-700',
    review: 'bg-purple-100 text-purple-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return colors[status] || colors.todo;
};

// "in_progress" ko "In Progress" mein badalna (display ke liye)
export const formatLabel = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Date ko readable format mein dikhana
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Role ko readable naam dena
export const formatRole = (role) => {
  const roles = {
    admin: 'Administrator',
    project_manager: 'Project Manager',
    team_member: 'Team Member',
  };
  return roles[role] || role;
};