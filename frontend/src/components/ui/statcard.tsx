// Reusable Stat Card Component
interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: 'primary' | 'success' | 'warning' | 'danger';
  }
  
export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    const bgColorMap: Record<string, string> = {
      primary: 'bg-primary-100 text-primary', // Uses our custom light tint
      success: 'bg-green-100 text-green-500',
      warning: 'bg-yellow-100 text-yellow-500',
      danger: 'bg-red-100 text-red-500',
    };
  
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${bgColorMap[color]} bg-opacity-10`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };