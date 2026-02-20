import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import BadgeAdmin from "../components/BadgeAdmin";
import CertificatesAdmin from "../components/CertificateAdmin";
import ContributionAdmin from "../components/ContributionAdmin";
import InternshipAdmin from "../components/InternshipAdmin";
import ContributionCertAdmin from "../components/ContributionCertAdmin";
import Dashboard from "../components/Dashboard";
import {
  Menu,
  X,
  LayoutDashboard,
  Award,
  TrendingUp,
  Briefcase,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  User,
  Search,
  BookOpen,
  Zap,
  Moon,
  Sun,
  NotebookIcon,
} from "lucide-react";

// Tab configuration
const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, component: Dashboard },
  { id: "certificates", label: "Certificates", icon: NotebookIcon, component: CertificatesAdmin },
  { id: "badges", label: "Badges", icon: Award, component: BadgeAdmin },
  { id: "contributions", label: "Contributions", icon: TrendingUp, component: ContributionAdmin },
  { id: "internships", label: "Internships", icon: Briefcase, component: InternshipAdmin },
  { id: "contribution-certs", label: "Contribution Certs", icon: BookOpen, component: ContributionCertAdmin },
];

// Notification component
const NotificationBadge = ({ count }: { count: number }) => (
  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
    {count}
  </span>
);

// User menu component
const UserMenu = ({ onClose }: { onClose: () => void }) => (
  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl py-2 z-50">
    <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
      <User className="w-4 h-4" />
      Profile
    </button>
    <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
      <Settings className="w-4 h-4" />
      Settings
    </button>
    <hr className="border-gray-700 my-2" />
    <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2">
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  </div>
);

// Mobile menu component
const MobileMenu = ({ isOpen, onClose, activeTab, onTabChange }: { 
  isOpen: boolean; 
  onClose: () => void; 
  activeTab: string;
  onTabChange: (id: string) => void;
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
              Dev Archive
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        <nav className="p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-white border-l-4 border-yellow-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? "text-blue-400" : ""}`} />
                <span className="font-medium">{tab.label}</span>
                {tab.id === "contributions" && (
                  <span className="ml-auto bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                    3
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

// Sidebar component
const Sidebar = ({ 
  isCollapsed, 
  onToggle, 
  activeTab, 
  onTabChange 
}: { 
  isCollapsed: boolean; 
  onToggle: () => void; 
  activeTab: string;
  onTabChange: (id: string) => void;
}) => {
  return (
    <aside
      className={`hidden lg:block fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 transition-all duration-300 z-30 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`p-4 border-b border-gray-800 ${isCollapsed ? "text-center" : ""}`}>
          {isCollapsed ? (
            <div className="w-10 h-10 mx-auto bg-gradient-to-br from-blue-500 to-yellow-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
          ) : (
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
              Dev Archive
            </h2>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all group relative ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? "text-blue-400" : ""}`} />
                {!isCollapsed && (
                  <>
                    <span className="font-medium">{tab.label}</span>
                    {tab.id === "contributions" && (
                      <span className="ml-auto bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                        3
                      </span>
                    )}
                  </>
                )}
                {isCollapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Toggle button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onToggle}
            className="w-full p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors flex items-center justify-center"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </aside>
  );
};

// Header component
const Header = ({ 
  onMenuClick, 
  activeTab,
  onSearch 
}: { 
  onMenuClick: () => void; 
  activeTab: string;
  onSearch: (term: string) => void;
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { logout } = useAuth();

  const activeTabLabel = tabs.find(t => t.id === activeTab)?.label || "Dashboard";

  return (
    <header className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-white lg:hidden">{activeTabLabel}</h1>
          
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:block relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search in certificates, badges, contributions..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white relative"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white relative">
            <Bell className="w-5 h-5" />
            <NotificationBadge count={3} />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 hover:bg-gray-800 rounded-lg"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden md:block text-white">Admin</span>
            </button>
            {showUserMenu && <UserMenu onClose={() => setShowUserMenu(false)} />}
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors ml-2"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="lg:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </header>
  );
};

// Quick Stats Component
const QuickStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
        <p className="text-gray-400 text-xs">Certificates</p>
        <p className="text-lg font-bold text-white">24</p>
      </div>
      <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
        <p className="text-gray-400 text-xs">Badges</p>
        <p className="text-lg font-bold text-white">18</p>
      </div>
      <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
        <p className="text-gray-400 text-xs">Contributions</p>
        <p className="text-lg font-bold text-white">32</p>
      </div>
      <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
        <p className="text-gray-400 text-xs">Internships</p>
        <p className="text-lg font-bold text-white">6</p>
      </div>
    </div>
  );
};

export default function MyDevArchive() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Render active component
  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // You can implement search logic here or pass to child components
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Sidebar for desktop */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} activeTab={activeTab} onSearch={handleSearch} />

        <div className="p-4 md:p-6">
          {/* Quick Stats - Show only on mobile, hide on dashboard */}
          {activeTab !== "dashboard" && (
            <div className="lg:hidden">
              <QuickStats />
            </div>
          )}

          {/* Tab navigation pills for mobile */}
          <div className="lg:hidden overflow-x-auto pb-2 mb-4">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-500 to-yellow-500 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active component */}
          <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-4 md:p-6">
            <ActiveComponent searchTerm={searchTerm} />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Dev Archive Admin Panel © 2026</p>
          </div>
        </div>
      </main>
    </div>
  );
}