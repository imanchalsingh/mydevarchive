import { useState } from "react";
import BadgeAdmin from "../components/Admin/BadgeAdmin";
import CertificatesAdmin from "../components/Admin/CertificateAdmin";
import ContributionAdmin from "../components/Admin/ContributionAdmin";
import InternshipAdmin from "../components/Admin/InternshipAdmin";
import ContributionCertAdmin from "../components/Admin/ContributionCertAdmin";
import Dashboard from "../components/Admin/Dashboard";
import { useNavigate } from "react-router-dom";
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
  BookOpen,
  NotebookIcon,
} from "lucide-react";

// Tab configuration
const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    component: Dashboard,
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: NotebookIcon,
    component: CertificatesAdmin,
  },
  { id: "badges", label: "Badges", icon: Award, component: BadgeAdmin },
  {
    id: "contributions",
    label: "Contributions",
    icon: TrendingUp,
    component: ContributionAdmin,
  },
  {
    id: "internships",
    label: "Internships",
    icon: Briefcase,
    component: InternshipAdmin,
  },
  {
    id: "contribution-certs",
    label: "Contribution Certs",
    icon: BookOpen,
    component: ContributionCertAdmin,
  },
];

// Mobile menu component
const MobileMenu = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (id: string) => void;
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 lg:hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Dev Archive
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <nav className="p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded mb-1 text-sm ${activeTab === tab.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
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
  onTabChange,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (id: string) => void;
}) => {
  return (
    <aside
      className={`hidden lg:block fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30 ${isCollapsed ? "w-20" : "w-64"
        }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`p-4 border-b border-gray-200 ${isCollapsed ? "text-center" : ""}`}>
          {isCollapsed ? (
            <div className="w-10 h-10 mx-auto bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
          ) : (
            <h2 className="text-lg font-semibold text-gray-900">
              Dev Archive
            </h2>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded mb-1 text-sm group relative ${activeTab === tab.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {!isCollapsed && (
                  <>
                    <span>{tab.label}</span>
                    {tab.id === "contributions" && (
                      <span className="ml-auto bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
                        3
                      </span>
                    )}
                  </>
                )}
                {isCollapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Toggle button */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={onToggle}
            className="w-full p-2 bg-gray-50 hover:bg-gray-100 rounded text-gray-600 flex items-center justify-center"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
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
}: {
  onMenuClick: () => void;
  activeTab: string;
}) => {
  const activeTabLabel =
    tabs.find((t) => t.id === activeTab)?.label || "Dashboard";

  const navigate = useNavigate();


  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1 hover:bg-gray-100 rounded text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-base font-medium text-gray-900 lg:hidden">
            {activeTabLabel}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          {/* Logout Button */}
          <button
            onClick={() => navigate("/login")}
            className="p-1.5 hover:bg-red-50 rounded text-red-600 ml-1"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default function MyDevArchive() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Render active component
  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-gray-50">
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
        className={`transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
      >
        <Header
          onMenuClick={() => setIsMobileMenuOpen(true)}
          activeTab={activeTab}
        />

        <div className="p-4 md:p-6">
          {/* Tab navigation pills for mobile */}
          <div className="lg:hidden overflow-x-auto pb-3 mb-4">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active component */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <ActiveComponent />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Dev Archive Admin Panel © 2026</p>
          </div>
        </div>
      </main>
    </div>
  );
}