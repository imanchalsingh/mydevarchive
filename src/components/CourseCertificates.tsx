import React, { useState } from "react";
import data from '../data/certificates.json';

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  image?: string;
  category: string;
  color: string;
}

const CourseCertificates: React.FC = () => {
  const [selectedIssuer, setSelectedIssuer] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Use data from JSON
  const certificatesData: Certificate[] = data.courseCertificates;

  const issuers = Array.from(new Set(certificatesData.map((c) => c.issuer)));
  const categories = Array.from(new Set(certificatesData.map((c) => c.category)));

  const filteredCertificates = certificatesData.filter((cert) => {
    const matchesIssuer =
      selectedIssuer === "all" || cert.issuer === selectedIssuer;
    const matchesCategory =
      selectedCategory === "all" || cert.category === selectedCategory;
    const matchesSearch = cert.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesIssuer && matchesCategory && matchesSearch;
  });

  const handleView = (cert: Certificate) => {
    // You can implement view logic based on your image paths
    alert(`Viewing: ${cert.name}`);
  };

  const handleDownload = (cert: Certificate) => {
    // You can implement download logic based on your image paths
    alert(`Downloading: ${cert.name}`);
  };

  // Get icon based on category
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      "Frontend": "🎨",
      "Backend": "⚙️",
      "Database": "🗄️",
      "Programming": "💻",
      "Full Stack": "📚",
      "AI": "🤖",
      "Projects": "🚀",
      "Algorithms": "🧮",
      "Computer Science": "💾",
      "Soft Skills": "🤝",
      "API": "🔌",
      "default": "📜"
    };
    return icons[category] || icons.default;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with color palette inspiration */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            My Certificate Gallery
          </h2>
          <div className="flex gap-1">
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#1abc9c] text-white">📜</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#3498db] text-white">🎓</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#9b59b6] text-white">🏅</span>
          </div>
        </div>
        <div className="flex gap-1 h-1 w-full overflow-hidden rounded-full">
          <div
            className="h-full w-1/5"
            style={{ backgroundColor: "#1abc9c" }}
          ></div>
          <div
            className="h-full w-1/5"
            style={{ backgroundColor: "#3498db" }}
          ></div>
          <div
            className="h-full w-1/5"
            style={{ backgroundColor: "#9b59b6" }}
          ></div>
          <div
            className="h-full w-1/5"
            style={{ backgroundColor: "#f1c40f" }}
          ></div>
          <div
            className="h-full w-1/5"
            style={{ backgroundColor: "#e74c3c" }}
          ></div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Search certificates..."
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
            style={{ backgroundColor: viewMode === "list" ? '#3498db' : undefined }}
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
            style={{ backgroundColor: viewMode === "grid" ? '#9b59b6' : undefined }}
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
            title="Reset filters"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Certificates Display */}
      {viewMode === "list" ? (
        // List View
        <div className="space-y-2">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
              style={{ borderLeftWidth: "4px", borderLeftColor: cert.color }}
            >
              {/* Color indicator - visible on mobile as dot */}
              <div
                className="w-2 h-2 rounded-full sm:hidden shrink-0"
                style={{ backgroundColor: cert.color }}
              ></div>

              {/* Certificate Info - Responsive */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div 
                      className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden border text-xl" 
                      style={{ borderColor: `${cert.color}30`, backgroundColor: `${cert.color}10` }}
                    >
                      {getCategoryIcon(cert.category)}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {cert.name}
                      </h3>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-gray-500">
                          {cert.issuer}
                        </span>
                        <span className="hidden sm:inline text-gray-500">•</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `${cert.color}20`,
                            color: cert.color,
                          }}
                        >
                          {cert.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-4">
                    <button
                      onClick={() => handleView(cert)}
                      className="px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1"
                      style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
                    >
                      <span>👁️</span>
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      onClick={() => handleDownload(cert)}
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
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="group bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              {/* Colored top border with pattern */}
              <div className="h-2 w-full relative overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundColor: cert.color }}></div>
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%)]"></div>
              </div>
              
              <div className="p-4">
                {/* Certificate Icon with glow effect on hover */}
                <div 
                  className="w-20 h-20 mx-auto mb-3 rounded-xl bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2 border-2 transition-all duration-300 group-hover:shadow-md text-4xl" 
                  style={{ borderColor: `${cert.color}40`, backgroundColor: `${cert.color}10` }}
                >
                  {getCategoryIcon(cert.category)}
                </div>
                
                {/* Certificate Info */}
                <h3 className="text-sm font-semibold text-gray-900 text-center line-clamp-2 mb-1 group-hover:text-[#2c3e50]">
                  {cert.name}
                </h3>
                <p className="text-xs text-gray-500 text-center mb-2 flex items-center justify-center gap-1">
                  <span>{cert.issuer}</span>
                </p>
                
                {/* Category */}
                <div className="flex items-center justify-center gap-1 mb-3 flex-wrap">
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full font-medium" 
                    style={{ backgroundColor: `${cert.color}20`, color: cert.color }}
                  >
                    {cert.category}
                  </span>
                </div>
                
                {/* Actions - Hidden by default, show on hover */}
                <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleView(cert)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
                    title="View"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleDownload(cert)}
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
      {filteredCertificates.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-3 animate-pulse">📜</div>
          <p className="text-gray-500 font-medium">No certificates found</p>
          <p className="text-xs text-gray-400 mb-3">Try adjusting your filters</p>
          <button
            onClick={() => {
              setSelectedIssuer("all");
              setSelectedCategory("all");
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
            Showing {filteredCertificates.length} of {certificatesData.length}{" "}
            certificates
          </span>
          <span className="px-2 py-0.5 bg-gray-100 rounded-full">
            {certificatesData.length} total
          </span>
        </span>
        <div className="flex gap-2 items-center">
          <span className="hidden sm:inline">Categories:</span>
          {Array.from(new Set(certificatesData.map(c => c.category))).slice(0, 5).map((category) => {
            const cert = certificatesData.find(c => c.category === category);
            return (
              <div
                key={category}
                className="w-3 h-3 rounded-full transition-transform hover:scale-150 cursor-pointer"
                style={{ backgroundColor: cert?.color || "#95a5a6" }}
                title={category}
              ></div>
            );
          })}
        </div>
      </div>

      {/* JSON Data Info */}
      <div className="mt-4 text-[10px] text-gray-400 text-right">
        Data source: certificates.json • Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default CourseCertificates;