import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import ProtectedRoute from '../components/common/ProtectedRoute';

import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageProjects from '../pages/admin/ManageProjects';
import ProjectDetails from '../pages/shared/ProjectDetails';
import TaskDetails from '../pages/shared/TaskDetails';
import PMDashboard from '../pages/projectManager/PMDashboard';
import ProjectWorkspace from '../pages/projectManager/ProjectWorkspace';
import MemberDashboard from '../pages/teamMember/MemberDashboard';
import MyTasks from '../pages/teamMember/MyTasks';
import Notifications from '../pages/shared/Notifications';
import Profile from '../pages/shared/Profile';

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageProjects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/projects/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProjectDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pm/dashboard"
        element={
          <ProtectedRoute allowedRoles={['project_manager']}>
            <PMDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pm/projects"
        element={
          <ProtectedRoute allowedRoles={['project_manager']}>
            <ProjectWorkspace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pm/projects/:id"
        element={
          <ProtectedRoute allowedRoles={['project_manager']}>
            <ProjectDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/member/dashboard"
        element={
          <ProtectedRoute allowedRoles={['team_member']}>
            <MemberDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/member/tasks"
        element={
          <ProtectedRoute allowedRoles={['team_member']}>
            <MyTasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'project_manager', 'team_member']}>
            <TaskDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;