import { Link } from 'react-router-dom';
import { CheckCircle2, Users, FolderKanban, MessageSquare } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600">TaskForge</h1>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
          Manage projects and teams,
          <br />
          <span className="text-indigo-600">all in one place</span>
        </h2>
        <p className="text-lg text-slate-500 mt-5 max-w-xl mx-auto">
          TaskForge helps organizations plan projects, assign tasks, and track progress —
          built for teams who want clarity, not chaos.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            Sign In to TaskForge
          </Link>
          <Link
            to="/register"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            Create an Account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FeatureCard
            icon={FolderKanban}
            title="Project Workspaces"
            desc="Each project gets its own space for tasks, discussions, and progress tracking."
          />
          <FeatureCard
            icon={Users}
            title="Role-Based Access"
            desc="Admins, Project Managers, and Team Members each get tools built for their role."
          />
          <FeatureCard
            icon={MessageSquare}
            title="Task Discussions"
            desc="Keep task-related conversations in context, right where the work happens."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6">
        <p className="text-center text-xs text-slate-400">
          © 2026 TaskForge. Built for real project management.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6">
    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
      <Icon size={20} />
    </div>
    <h3 className="font-semibold text-slate-900 mb-1.5">{title}</h3>
    <p className="text-sm text-slate-500">{desc}</p>
  </div>
);

export default Landing;