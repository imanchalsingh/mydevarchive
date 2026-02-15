import React, { useState } from "react";
import data from "../data/certificates.json";

interface ContributionCertificate {
  id: number;
  name: string;
  event: string;
  type: string;
  color: string;
  year?: string;
  role?: string;
  issuer?: string;
}

const ContributionsCertificates: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  // Use data from JSON
  const contributionCertsData: ContributionCertificate[] =
    data.contributionCertificates;

  const events = Array.from(new Set(contributionCertsData.map((c) => c.event)));
  const types = Array.from(new Set(contributionCertsData.map((c) => c.type)));

  const filteredCerts = contributionCertsData.filter((cert) => {
    const matchesEvent =
      selectedEvent === "all" || cert.event === selectedEvent;
    const matchesType = selectedType === "all" || cert.type === selectedType;
    const matchesSearch =
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.event.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesEvent && matchesType && matchesSearch;
  });

  const handleView = (cert: ContributionCertificate) => {
    // You can implement view logic here
    alert(`Viewing: ${cert.name}`);
  };

  const handleDownload = (cert: ContributionCertificate) => {
    // You can implement download logic here
    alert(`Downloading: ${cert.name}`);
  };

  // Get icon based on type/role
  const getCertificateIcon = (cert: ContributionCertificate) => {
    if (cert.role?.includes("Contributor")) return "🤝";
    if (cert.type === "Contribution") return "📜";
    return "🏆";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with contribution theme */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Contribution Certificates
          </h2>
          <div className="flex gap-1">
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#9b59b6] text-white">
              🤝
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#3498db] text-white">
              🌟
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#1abc9c] text-white">
              📜
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Open Source • Community • Event Contributions
        </p>
        <div className="flex gap-1 h-1 w-full overflow-hidden rounded-full">
          <div
            className="h-full w-1/3"
            style={{ backgroundColor: "#9b59b6" }}
          ></div>
          <div
            className="h-full w-1/3"
            style={{ backgroundColor: "#3498db" }}
          ></div>
          <div
            className="h-full w-1/3"
            style={{ backgroundColor: "#1abc9c" }}
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b59b6] text-sm col-span-1 lg:col-span-2"
        />

        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b59b6] text-sm"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b59b6] text-sm"
        >
          <option value="all">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
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

      {/* Contribution Certificates Display */}
      {filteredCerts.length === 0 ? (
        // Empty State with encouragement to add more
        <div className="text-center py-16 bg-linear-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4 animate-pulse">🏆</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Contribution Certificates Yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Your contribution certificates will appear here. Start contributing
            to open source, participate in events, and earn recognition!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://github.com/imanchalsingh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
              style={{ backgroundColor: "#2c3e50" }}
            >
              <span>🐙</span> View GitHub Profile
            </a>
            <button
              onClick={() => {
                setSelectedEvent("all");
                setSelectedType("all");
                setSearchTerm("");
              }}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
            >
              Clear Filters
            </button>
          </div>

          {/* Placeholder for future certificates */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 opacity-30">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ) : viewMode === "list" ? (
        // List View
        <div className="space-y-2">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
              style={{ borderLeftWidth: "4px", borderLeftColor: cert.color }}
            >
              <div
                className="w-2 h-2 rounded-full sm:hidden shrink-0"
                style={{ backgroundColor: cert.color }}
              ></div>

              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden text-xl"
                style={{ backgroundColor: `${cert.color}20` }}
              >
                {getCertificateIcon(cert)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {cert.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                      <span style={{ color: cert.color }}>{cert.event}</span>
                      {cert.year && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                            📅 {cert.year}
                          </span>
                        </>
                      )}
                      {cert.role && (
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                          🎯 {cert.role}
                        </span>
                      )}
                      <span className="hidden sm:inline">•</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${cert.color}20`,
                          color: cert.color,
                        }}
                      >
                        {cert.type}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              className="group bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              <div
                className="h-2 w-full"
                style={{ backgroundColor: cert.color }}
              ></div>

              <div className="p-4">
                <div
                  className="w-20 h-20 mx-auto mb-3 rounded-xl bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center border-2 transition-all duration-300 group-hover:shadow-md text-3xl"
                  style={{
                    borderColor: `${cert.color}40`,
                    backgroundColor: `${cert.color}10`,
                  }}
                >
                  {getCertificateIcon(cert)}
                </div>

                <h3 className="text-sm font-semibold text-gray-900 text-center line-clamp-2 mb-1">
                  {cert.name}
                </h3>

                <p className="text-xs text-gray-600 text-center mb-2 font-medium">
                  {cert.event}
                </p>

                <div className="flex items-center justify-center gap-1 mb-3 flex-wrap">
                  {cert.year && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                      📅 {cert.year}
                    </span>
                  )}
                  {cert.role && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                      🎯 {cert.role}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center mb-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: `${cert.color}20`,
                      color: cert.color,
                    }}
                  >
                    {cert.type}
                  </span>
                </div>

                <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleView(cert)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
                    title="View Certificate"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleDownload(cert)}
                    className="p-2 rounded-lg transition-all hover:scale-110 text-white"
                    style={{ backgroundColor: "#3498db" }}
                    title="Download Certificate"
                  >
                    ⬇️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats and Encouragement */}
      {filteredCerts.length > 0 && (
        <div className="mt-6 text-xs text-gray-500 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>
              Showing {filteredCerts.length} of {contributionCertsData.length}{" "}
              contribution certificates
            </span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full">
              {contributionCertsData.length} Achievement
              {contributionCertsData.length !== 1 ? "s" : ""}
            </span>
          </span>
          <div className="flex gap-2 items-center">
            <span className="hidden sm:inline">Contributions:</span>
            {contributionCertsData.map((cert) => (
              <div
                key={cert.id}
                className="w-2 h-2 rounded-full transition-transform hover:scale-150 cursor-pointer"
                style={{ backgroundColor: cert.color }}
                title={cert.event}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionsCertificates;
