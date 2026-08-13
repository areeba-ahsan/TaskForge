import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyNotifications, markAsRead, markAllAsRead } from '../../api/notificationApi';
import Layout from '../../components/common/Layout';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';
import { Bell, CheckCheck } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getMyNotifications();
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error('Failed to mark as read', error);
      }
    }
    // Related task/project pe navigate karo
    if (notification.relatedType === 'task' && notification.relatedId) {
      navigate(`/tasks/${notification.relatedId}`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" onClick={handleMarkAllRead}>
            <CheckCheck size={16} /> Mark all as read
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <Loader />
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`w-full text-left flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors ${
                  !n.isRead ? 'bg-indigo-50/50' : ''
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.isRead ? 'bg-indigo-600' : 'bg-transparent'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${!n.isRead ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(n.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;