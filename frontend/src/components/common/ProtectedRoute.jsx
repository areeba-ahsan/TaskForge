import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // App abhi check kar rahi hai ke login hai ya nahi (page refresh ke baad)
  if (loading) {
    return <Loader fullScreen />;
  }

  // Login nahi hai — login page pe bhejo
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Login hai lekin role allowed nahi — apne sahi dashboard pe bhejo
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectMap = {
      admin: '/admin/dashboard',
      project_manager: '/pm/dashboard',
      team_member: '/member/dashboard',
    };
    return <Navigate to={redirectMap[user.role]} replace />;
  }

  return children;
};

export default ProtectedRoute;