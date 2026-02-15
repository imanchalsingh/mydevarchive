import React, { useState } from "react";
import data from '../data/certificates.json';

interface ContributionBadge {
  id: number;
  name: string;
  event: string;
  type: string;
  color: string;
  year?: string;
  role?: string;
}

const ContributionBadges: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  // Use data from JSON
  const contributionBadgesData: ContributionBadge[] = data.contributionBadges;

  const events = Array.from(new Set(contributionBadgesData.map((b) => b.event)));
  const types = Array.from(new Set(contributionBadgesData.map((b) => b.type)));

  const filteredBadges = contributionBadgesData.filter((badge) => {
    const matchesEvent =
      selectedEvent === "all" || badge.event === selectedEvent;
    const matchesType = selectedType === "all" || badge.type === selectedType;
    const matchesSearch = badge.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesEvent && matchesType && matchesSearch;
  });

  const handleView = (badge: ContributionBadge) => {
    // You can implement view logic here
    alert(`Viewing: ${badge.name}`);
  };

  const handleDownload = (badge: ContributionBadge) => {
    // You can implement download logic here
    alert(`Downloading: ${badge.name}`);
  };

  // Get icon based on type
  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      "Participant": "👤",
      "Contributor": "🤝",
      "Recognition": "🏆",
      "Hackathon": "💻",
      "Networking": "🌐",
      "Ticket": "🎫",
      "default": "🎯"
    };
    return icons[type] || icons.default;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with contribution theme */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Contribution Badges
          </h2>
          <div className="flex gap-1">
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#1abc9c] text-white">
              🌟
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#e74c3c] text-white">
              🤝
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#f39c12] text-white">
              🚀
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Open Source • Hackathons • Community Contributions
        </p>
        <div className="flex gap-1 h-1 w-full overflow-hidden rounded-full">
          {contributionBadgesData.map((badge) => (
            <div
              key={badge.id}
              className="h-full transition-all duration-300"
              style={{ 
                backgroundColor: badge.color,
                width: `${100 / contributionBadgesData.length}%`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Search contribution badges..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] text-sm col-span-1 lg:col-span-2"
        />

        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] text-sm"
        >
          <option value="all">All Events</option>
          {events.map((event) => (
            <option key={event} value={event}>
              {event}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] text-sm"
        >
          <option value="all">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="flex gap-2 lg:col-span-1">
          <button
            onClick={() => setViewMode("list")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "list"
                ? "text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{
              backgroundColor: viewMode === "list" ? "#3498db" : undefined,
            }}
          >
            📋 List
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "grid"
                ? "text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{
              backgroundColor: viewMode === "grid" ? "#9b59b6" : undefined,
            }}
          >
            🔲 Grid
          </button>
          <button
            onClick={() => {
              setSelectedEvent("all");
              setSelectedType("all");
              setSearchTerm("");
            }}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
            title="Reset filters"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Contribution Badges Display */}
      {viewMode === "list" ? (
        // List View
        <div className="space-y-2">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
              style={{ borderLeftWidth: "4px", borderLeftColor: badge.color }}
            >
              {/* Color indicator */}
              <div
                className="w-2 h-2 rounded-full sm:hidden shrink-0"
                style={{ backgroundColor: badge.color }}
              ></div>

              {/* Badge Preview */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden text-2xl"
                style={{ 
                  backgroundColor: `${badge.color}15`,
                  borderColor: `${badge.color}30`,
                  borderWidth: '1px'
                }}
              >
                {getTypeIcon(badge.type)}
              </div>

              {/* Badge Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {badge.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                      <span>{badge.event}</span>
                      {badge.year && (
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                          📅 {badge.year}
                        </span>
                      )}
                      {badge.role && (
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                          🎯 {badge.role}
                        </span>
                      )}
                      <span className="hidden sm:inline">•</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${badge.color}20`,
                          color: badge.color,
                        }}
                      >
                        {badge.type}
                      </span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleView(badge)}
                      className="px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1"
                      style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
                    >
                      <span>👁️</span>
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      onClick={() => handleDownload(badge)}
                      className="px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 text-white"
                      style={{ backgroundColor: "#3498db" }}
                    >
                      <span>⬇️</span>
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className="group bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              {/* Colored top border */}
              <div className="h-2 w-full relative overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: badge.color }}
                ></div>
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%)]"></div>
              </div>

              <div className="p-4">
                {/* Badge Icon */}
                <div
                  className="w-20 h-20 mx-auto mb-3 rounded-xl flex items-center justify-center text-4xl border-2 transition-all duration-300 group-hover:shadow-md group-hover:scale-110"
                  style={{ 
                    borderColor: `${badge.color}40`,
                    backgroundColor: `${badge.color}10`
                  }}
                >
                  {getTypeIcon(badge.type)}
                </div>

                {/* Badge Info */}
                <h3 className="text-sm font-semibold text-gray-900 text-center line-clamp-2 mb-1 group-hover:text-[#2c3e50]">
                  {badge.name}
                </h3>
                <p className="text-xs text-gray-500 text-center mb-2 flex items-center justify-center gap-1">
                  <span>{badge.event}</span>
                  {badge.year && <span>• {badge.year}</span>}
                </p>

                {/* Type and Role */}
                <div className="flex items-center justify-center gap-1 mb-3 flex-wrap">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: `${badge.color}20`,
                      color: badge.color,
                    }}
                  >
                    {badge.type}
                  </span>
                  {badge.role && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                      {badge.role}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleView(badge)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
                    title="View"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleDownload(badge)}
                    className="p-2 rounded-lg transition-all hover:scale-110 text-white"
                    style={{ backgroundColor: "#3498db" }}
                    title="Download"
                  >
                    ⬇️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-3 animate-pulse">🏅</div>
          <p className="text-gray-500 font-medium">
            No contribution badges found
          </p>
          <p className="text-xs text-gray-400 mb-3">
            Try adjusting your filters
          </p>
          <button
            onClick={() => {
              setSelectedEvent("all");
              setSelectedType("all");
              setSearchTerm("");
            }}
            className="px-4 py-2 text-sm rounded-lg transition-colors inline-flex items-center gap-2"
            style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
          >
            <span>🔄</span> Clear Filters
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 text-xs text-gray-500 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span>
            Showing {filteredBadges.length} of {contributionBadgesData.length} contributions
          </span>
          <span className="px-2 py-0.5 bg-gray-100 rounded-full">
            {filteredBadges.reduce(
              (acc, badge) => acc + (badge.role ? 1 : 0),
              0,
            )} roles
          </span>
        </span>
        <div className="flex gap-2 items-center">
          <span className="hidden sm:inline">Events:</span>
          {contributionBadgesData.map((badge) => (
            <div
              key={badge.id}
              className="w-2 h-2 rounded-full transition-transform hover:scale-150 cursor-pointer"
              style={{ backgroundColor: badge.color }}
              title={`${badge.name} (${badge.event})`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContributionBadges;