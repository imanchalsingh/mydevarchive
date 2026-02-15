import { useState } from "react";
import Overview from "./Overview";
import CourseCertificates from "../components/CourseCertificates";
import Badges from "../components/Badges";
import ContributionBadges from "../components/ContributionBadges";
import ContributionsCertificates from "../components/ContributionsCertificates";
import OfferLetters from "../components/OfferLetters";

// Import JSON data for counts
import data from "../data/certificates.json";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: "📊",
      color: "#34495e",
    },
    {
      id: "certificates",
      label: "Course Certs",
      count: data.courseCertificates.length,
      icon: "📜",
      color: "#3498db",
    },
    {
      id: "badges",
      label: "Badges",
      count: data.badges.length,
      icon: "🏅",
      color: "#f39c12",
    },
    {
      id: "contribution-badges",
      label: "Contribution Badges",
      count: data.contributionBadges.length,
      icon: "🤝",
      color: "#9b59b6",
    },
    {
      id: "contribution-certs",
      label: "Contribution Certs",
      count: data.contributionCertificates.length,
      icon: "📄",
      color: "#1abc9c",
    },
    {
      id: "offers",
      label: "Offer Letters",
      count: data.offerLetters.length,
      icon: "💼",
      color: "#e74c3c",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "certificates":
        return <CourseCertificates />;
      case "badges":
        return <Badges />;
      case "contribution-badges":
        return <ContributionBadges />;
      case "contribution-certs":
        return <ContributionsCertificates />;
      case "offers":
        return <OfferLetters />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with title and mobile menu button */}
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#3498db] to-[#9b59b6] flex items-center justify-center text-white text-lg">
                🎓
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                My<span className="text-[#3498db]">Dev</span>
                <span className="text-[#e74c3c]">Archive</span>
              </h1>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative group px-3 py-2 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor:
                      activeTab === tab.id ? `${tab.color}15` : "transparent",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: activeTab === tab.id ? tab.color : "#4a5568",
                      }}
                    >
                      {tab.label}
                    </span>
                    {tab.count !== undefined && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor:
                            activeTab === tab.id ? tab.color : "#edf2f7",
                          color: activeTab === tab.id ? "white" : "#4a5568",
                        }}
                      >
                        {tab.count}
                      </span>
                    )}
                  </div>

                  {/* Active Indicator */}
                  {activeTab === tab.id && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: tab.color }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-gray-600 transform transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-gray-600 transform transition-all duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Navigation - Collapsible */}
          <div
            className={`lg:hidden transition-all duration-300 overflow-hidden ${
              isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
            }`}
          >
            <div className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="relative p-3 rounded-lg transition-all duration-200 flex flex-col items-center text-center"
                  style={{
                    backgroundColor:
                      activeTab === tab.id ? `${tab.color}15` : "#f7fafc",
                    borderLeft:
                      activeTab === tab.id ? `3px solid ${tab.color}` : "none",
                  }}
                >
                  <span className="text-2xl mb-1">{tab.icon}</span>
                  <span
                    className="text-xs font-medium mb-1"
                    style={{
                      color: activeTab === tab.id ? tab.color : "#4a5568",
                    }}
                  >
                    {tab.label}
                  </span>
                  {tab.count !== undefined && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor:
                          activeTab === tab.id ? tab.color : "#edf2f7",
                        color: activeTab === tab.id ? "white" : "#4a5568",
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Color Bar */}
        <div className="flex gap-1 h-1 w-full overflow-hidden rounded-full mb-6">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="h-full transition-all duration-300"
              style={{
                backgroundColor: tab.color,
                width: activeTab === tab.id ? "15%" : `${100 / tabs.length}%`,
                opacity: activeTab === tab.id ? 1 : 0.5,
              }}
            />
          ))}
        </div>

        {/* Content with transition */}
        <div
          key={activeTab}
          className="transition-all duration-300 animate-fadeIn"
        >
          {renderContent()}
        </div>

        {/* Footer Stats */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#3498db]"></span>
                Total Items:{" "}
                {data.courseCertificates.length +
                  data.badges.length +
                  data.contributionBadges.length +
                  data.contributionCertificates.length +
                  data.offerLetters.length}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#f39c12]"></span>
                Active Tab: {tabs.find((t) => t.id === activeTab)?.label}
              </span>
            </div>
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className="w-2 h-2 rounded-full cursor-pointer transition-transform hover:scale-150"
                  style={{
                    backgroundColor: tab.color,
                    opacity: activeTab === tab.id ? 1 : 0.3,
                  }}
                  onClick={() => setActiveTab(tab.id)}
                  title={tab.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
