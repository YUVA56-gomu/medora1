import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Menu, 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Sun, 
  Moon,
  Home,
  Users,
  Calendar,
  FileText,
  Activity,
  Shield,
  Stethoscope,
  Heart,
  ClipboardList
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { notifications } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationPanel, setNotificationPanel] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark');
  };

  const getNavigationItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
    ];

    switch (user?.role) {
      case 'super_admin':
        return [
          ...baseItems,
          { icon: Users, label: 'User Management', path: '/users' },
          { icon: Activity, label: 'System Reports', path: '/reports' },
          { icon: Settings, label: 'System Settings', path: '/settings' },
        ];
      case 'doctor':
        return [
          ...baseItems,
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
          { icon: FileText, label: 'Medical Records', path: '/records' },
          { icon: Stethoscope, label: 'Consultations', path: '/consultations' },
        ];
      case 'nurse':
        return [
          ...baseItems,
          { icon: ClipboardList, label: 'Daily Tasks', path: '/tasks' },
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: Heart, label: 'Vitals', path: '/vitals' },
          { icon: Activity, label: 'Patient Care', path: '/care' },
        ];
      case 'patient':
        return [
          ...baseItems,
          { icon: Calendar, label: 'My Appointments', path: '/my-appointments' },
          { icon: FileText, label: 'Medical History', path: '/medical-history' },
          { icon: Activity, label: 'Health Records', path: '/health-records' },
        ];
      default:
        return baseItems;
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'super_admin':
        return Shield;
      case 'doctor':
        return Stethoscope;
      case 'nurse':
        return Heart;
      case 'patient':
        return User;
      default:
        return User;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-teal-800 to-emerald-700 text-white transition-all duration-300 flex flex-col shadow-xl`}>
        {/* Header */}
        <div className="p-4 border-b border-teal-700">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="bg-white/20 p-2 rounded-lg">
                <RoleIcon className="w-6 h-6" />
              </div>
              {sidebarOpen && (
                <span className="text-xl font-bold font-display">MEDORA</span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-teal-700">
          <div className={`flex items-center ${!sidebarOpen ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-teal-200 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {getNavigationItems().map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} p-3 rounded-lg hover:bg-white/20 transition-colors group`}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  {!sidebarOpen && (
                    <span className="absolute left-16 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-teal-700">
          <div className="space-y-2">
            <button
              onClick={toggleDarkMode}
              className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} p-3 rounded-lg hover:bg-white/20 transition-colors`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {sidebarOpen && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
            <button
              onClick={logout}
              className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} p-3 rounded-lg hover:bg-white/20 transition-colors text-red-200 hover:text-white`}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
                {user?.role === 'super_admin' ? 'Admin Dashboard' :
                 user?.role === 'doctor' ? 'Doctor Dashboard' :
                 user?.role === 'nurse' ? 'Nurse Dashboard' :
                 'Patient Dashboard'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationPanel(!notificationPanel)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notification Panel */}
                {notificationPanel && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {new Date(notification.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Click outside to close notification panel */}
      {notificationPanel && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setNotificationPanel(false)}
        />
      )}
    </div>
  );
};

export default Layout;