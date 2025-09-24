import { useState } from 'react';
import type { UserEntity } from '@/types/type';

interface DashBoardProps {
  user?: UserEntity;
}

// Define types
interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const DashboardComponent = ({ user }: DashBoardProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode and apply to document
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Menu items with icons
  const menuItems: MenuItem[] = [
    {
      name: 'Profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      path: '/profile',
    },
    {
      name: 'Logout',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.5 7.5a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm-2.5 0a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm-2.5 0a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm-2.5 0a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm-2.5 0a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3z" clipRule="evenodd" />
        </svg>
      ),
      path: '/logout',
    },
  ];

  return (
    <>
      <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Sidebar */}
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm dark:bg-primary px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Welcome back</h2>

            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM10.5 2.5L3 10h14l-7.5-7.5z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-sm">
                A
              </div>
            </div>
          </header>

          {/* Main Area */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard Overview</h1>

              {/* Stats Cards */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Users"
                  value="2,450"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  }
                  color="primary"
                />

                <StatCard
                  title="Revenue"
                  value="$45,890"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm12-4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  }
                  color="success"
                />

                <StatCard
                  title="Orders"
                  value="1,245"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2.586l-.707.707A1 1 0 0115 7.414V15a2 2 0 01-2 2h-6a2 2 0 01-2-2v-7.586l.707-.707A1 1 0 017 8.586V4z" />
                    </svg>
                  }
                  color="warning"
                />

                <StatCard
                  title="Pending"
                  value="23"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  }
                  color="danger"
                />
              </div> */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};



export default DashboardComponent;