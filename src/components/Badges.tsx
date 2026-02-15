import React, { useState } from "react";
import data from '../data/certificates.json';

interface Badge {
  id: number;
  name: string;
  issuer: string;
  image?: string; // Optional since we're using JSON paths
  category: string;
  color: string;
  date?: string;
}

const Badges: React.FC = () => {
  const [selectedIssuer, setSelectedIssuer] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Use data from JSON
  const badgesData: Badge[] = data.badges.map(badge => ({
    ...badge,
    // You can add image path logic here if needed
    image: '', // Will be handled by the component
  }));

  const issuers = Array.from(new Set(badgesData.map((b) => b.issuer)));
  const categories = Array.from(new Set(badgesData.map((b) => b.category)));

  const filteredBadges = badgesData.filter((badge) => {
    const matchesIssuer =
      selectedIssuer === "all" || badge.issuer === selectedIssuer;
    const matchesCategory =
      selectedCategory === "all" || badge.category === selectedCategory;
    const matchesSearch = badge.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesIssuer && matchesCategory && matchesSearch;
  });

  const handleView = (badge: Badge) => {
    // You can implement view logic based on your image paths
    alert(`Viewing: ${badge.name}`);
  };

  const handleDownload = (badge: Badge) => {
    // You can implement download logic based on your image paths
    alert(`Downloading: ${badge.name}`);
  };

  // Get icon based on category
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      "Competitive": "🏆",
      "API": "🔌",
      "Frontend": "🎨",
      "default": "🏅"
    };
    return icons[category] || icons.default;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with color palette inspiration */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            My Badge Collection
          </h2>
          <div className="flex gap-1">
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#1abc9c] text-white">
              🏆
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#3498db] text-white">
              ⭐
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#9b59b6] text-white">
              🎯
            </span>
          </div>
        </div>
        <div className="flex gap-1 h-1 w-full overflow-hidden rounded-full">
          <div
            className="h-full w-1/4"
            style={{ backgroundColor: "#1abc9c" }}
          ></div>
          <div
            className="h-full w-1/4"
            style={{ backgroundColor: "#3498db" }}
          ></div>
          <div
            className="h-full w-1/4"
            style={{ backgroundColor: "#9b59b6" }}
          ></div>
          <div
            className="h-full w-1/4"
            style={{ backgroundColor: "#e74c3c" }}
          ></div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Search badges..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] text-sm col-span-1 lg:col-span-2"
        />

        <select
          value={selectedIssuer}
          onChange={(e) => setSelectedIssuer(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] text-sm"
        >
          <option value="all">All Issuers</option>
          {issuers.map((issuer) => (
            <option key={issuer} value={issuer}>
              {issuer}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
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
              setSelectedIssuer("all");
              setSelectedCategory("all");
              setSearchTerm("");
            }}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Badges Display */}
      {viewMode === "list" ? (
        // List View
        <div className="space-y-2">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
              style={{ borderLeftWidth: "4px", borderLeftColor: badge.color }}
            >
              {/* Color indicator - visible on mobile as dot */}
              <div
                className="w-2 h-2 rounded-full sm:hidden shrink-0"
                style={{ backgroundColor: badge.color }}
              ></div>

              {/* Badge Icon/Preview */}
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden text-lg"
                style={{ backgroundColor: `${badge.color}20` }}
              >
                {getCategoryIcon(badge.category)}
              </div>

              {/* Badge Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {badge.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                      <span>{badge.issuer}</span>
                      {badge.date && (
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                          📅 {badge.date}
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
                        {badge.category}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className="group bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Colored top border */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: badge.color }}
              ></div>

              <div className="p-4">
                {/* Badge Icon */}
                <div
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl border-2"
                  style={{ 
                    borderColor: `${badge.color}40`,
                    backgroundColor: `${badge.color}10`
                  }}
                >
                  {getCategoryIcon(badge.category)}
                </div>

                {/* Badge Info */}
                <h3 className="text-sm font-medium text-gray-900 text-center line-clamp-2 mb-1">
                  {badge.name}
                </h3>
                <p className="text-xs text-gray-500 text-center mb-2">
                  {badge.issuer}
                </p>

                {/* Category and Date */}
                <div className="flex items-center justify-center gap-1 mb-3 flex-wrap">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${badge.color}20`,
                      color: badge.color,
                    }}
                  >
                    {badge.category}
                  </span>
                  {badge.date && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                      {badge.date}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleView(badge)}
                    className="p-1.5 rounded-md transition-colors"
                    style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
                    title="View"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleDownload(badge)}
                    className="p-1.5 rounded-md transition-colors text-white"
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
          <div className="text-4xl mb-3">🏅</div>
          <p className="text-gray-500">
            No badges found matching your filters.
          </p>
          <button
            onClick={() => {
              setSelectedIssuer("all");
              setSelectedCategory("all");
              setSearchTerm("");
            }}
            className="mt-3 px-4 py-2 text-sm rounded-lg transition-colors"
            style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
        <span>
          Showing {filteredBadges.length} of {badgesData.length} badges
        </span>
        <div className="flex gap-2">
          {badgesData.map((badge) => (
            <div
              key={badge.id}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: badge.color }}
              title={badge.name}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Badges;