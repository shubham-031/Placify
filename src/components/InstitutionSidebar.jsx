import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Brain, Users, TrendingUp, Building2, Eye, PieChart, Settings,
  UserCheck, Target, Award, LogOut, UserCircle, ChevronDown, Sun, Moon,
  ChevronLeft, ChevronRight, FileText, BarChart3, User, ChevronUp,
  Search, Bell
} from 'lucide-react';

const InstitutionSidebar = ({ isExpanded, setIsExpanded }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const menuItems = [
    { 
      name: 'Profile', 
      icon: User, 
      path: '/dashboard/institution/profile', 
      id: 'profile' 
    },
    { 
      name: 'Dashboard', 
      icon: Building2, 
      path: '/dashboard/institution', 
      id: 'dashboard' 
    },
    { 
      name: 'View Performance', 
      icon: Eye, 
      path: '/dashboard/institution/performance',
      id: 'performance',
      hasSubmenu: true,
      submenuItems: [
        { 
          name: 'Student Performance', 
          icon: UserCheck, 
          path: '/dashboard/institution/student-performance', 
          id: 'student-performance' 
        },
        { 
          name: 'Department Performance', 
          icon: TrendingUp, 
          path: '/dashboard/institution/department-performance', 
          id: 'department-performance' 
        }
      ]
    },
    { 
      name: 'Generate Reports', 
      icon: FileText, 
      path: '/dashboard/institution/reports', 
      id: 'reports' 
    },
    { 
      name: 'Analytics', 
      icon: BarChart3, 
      path: '/dashboard/institution/analytics', 
      id: 'analytics' 
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      path: '/dashboard/institution/settings', 
      id: 'settings' 
    }
  ];

  const handleItemClick = (item) => {
    if (item.hasSubmenu) {
      setExpandedMenus(prev => ({
        ...prev,
        [item.name]: !prev[item.name]
      }));
      return;
    }
    
    navigate(item.path);
  };

  const handleSubmenuClick = (subItem) => {
    navigate(subItem.path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/auth');
  };

  const isActiveRoute = (path) => {
    if (path === '/dashboard/institution') {
      return location.pathname === '/dashboard/institution';
    }
    return location.pathname === path;
  };

  const hasActiveSubmenu = (submenuItems) => {
    return submenuItems?.some(subItem => isActiveRoute(subItem.path));
  };

  return (
    <div className={`h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
      isExpanded ? "w-64" : "w-20"
    } fixed left-0 top-0 z-50 border-r border-gray-200 dark:border-gray-700`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {isExpanded && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-800 dark:text-white font-semibold text-lg">Placify</span>
            </div>
          )}
          {!isExpanded && (
            <div className="w-8 h-8 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center mx-auto">
              <Brain className="w-5 h-5 text-white" />
            </div>
          )}
          <button 
            onClick={toggleSidebar} 
            className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors ${!isExpanded ? 'absolute right-2' : ''}`}
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Search Bar */}
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'p-4' : 'p-0 h-0'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            const isExpanded_menu = expandedMenus[item.name];
            const hasActiveSubMenu = hasActiveSubmenu(item.submenuItems);
            
            return (
              <div key={item.id} className="relative mb-1">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    (isActive || hasActiveSubMenu)
                      ? "bg-purple-600 dark:bg-purple-500 text-white" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={`text-sm font-medium truncate flex-1 text-left transition-all duration-300 ${
                    isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}>
                    {item.name}
                  </span>
                  {item.hasSubmenu && isExpanded && (
                    <div className="ml-2">
                      {isExpanded_menu ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </button>
                
                {/* Submenu */}
                {item.hasSubmenu && isExpanded && isExpanded_menu && (
                  <div className="mt-1 ml-6 space-y-1">
                    {item.submenuItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = isActiveRoute(subItem.path);
                      
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubmenuClick(subItem)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                            isSubActive
                              ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-l-2 border-purple-500'
                              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                        >
                          <SubIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium truncate">{subItem.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-gray-800 text-white dark:text-gray-100 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-gray-700">
                    {item.name}
                    {item.hasSubmenu && item.submenuItems && (
                      <div className="mt-1 pt-1 border-t border-gray-600 dark:border-gray-600">
                        {item.submenuItems.map(subItem => (
                          <div key={subItem.id} className="text-xs text-gray-300 dark:text-gray-400">
                            • {subItem.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          {/* Dark Mode Toggle */}
          <div className="relative mb-1 mt-4">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white group"
            >
              {isDarkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
              <span className={`text-sm font-medium transition-all duration-300 ${
                isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
            
            {!isExpanded && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-gray-800 text-white dark:text-gray-100 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-gray-700">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 group"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm font-medium transition-all duration-300 ${
                isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}>
                Logout
              </span>
            </button>
            
            {!isExpanded && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-gray-800 text-white dark:text-gray-100 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-gray-700">
                Logout
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionSidebar;