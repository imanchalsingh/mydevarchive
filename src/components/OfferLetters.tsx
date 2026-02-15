import React, { useState } from "react";
import data from '../data/certificates.json';

interface OfferLetter {
  id: number;
  company: string;
  role: string;
  color: string;
  duration?: string;
  mode?: string;
  status: string;
  name?: string; // For display purposes
}

const OfferLetters: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Use data from JSON
  const offerLettersData: OfferLetter[] = data.offerLetters.map(offer => ({
    ...offer,
    name: `${offer.company} Internship Offer` // Create display name
  }));

  const companies = Array.from(new Set(offerLettersData.map((o) => o.company)));

  const filteredOffers = offerLettersData.filter((offer) => {
    const matchesCompany =
      selectedCompany === "all" || offer.company === selectedCompany;
    const matchesSearch =
      offer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCompany && matchesSearch;
  });

  const handleView = (offer: OfferLetter) => {
    // You can implement view logic here
    alert(`Viewing offer from ${offer.company}`);
  };

  const handleDownload = (offer: OfferLetter) => {
    // You can implement download logic here
    alert(`Downloading offer from ${offer.company}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with offer letter theme */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Internship Offer Letters
          </h2>
          <div className="flex gap-1">
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#1abc9c] text-white">
              📄
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#3498db] text-white">
              💼
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#e74c3c] text-white">
              🚀
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Web Development Internship Opportunities
        </p>
        <div className="flex gap-1 h-1 w-full overflow-hidden rounded-full">
          {offerLettersData.map((offer) => (
            <div
              key={offer.id}
              className="h-full transition-all duration-300"
              style={{ 
                backgroundColor: offer.color,
                width: `${100 / offerLettersData.length}%`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Search by company, role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] text-sm col-span-1 lg:col-span-2"
        />

        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] text-sm"
        >
          <option value="all">All Companies</option>
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
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
              setSelectedCompany("all");
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

      {/* Offer Letters Display */}
      {viewMode === "list" ? (
        // List View
        <div className="space-y-2">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
              style={{ borderLeftWidth: "4px", borderLeftColor: offer.color }}
            >
              {/* Color indicator */}
              <div
                className="w-2 h-2 rounded-full sm:hidden shrink-0"
                style={{ backgroundColor: offer.color }}
              ></div>

              {/* Document Icon */}
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${offer.color}20` }}
              >
                <span className="text-lg">📄</span>
              </div>

              {/* Offer Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {offer.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                      <span
                        className="font-medium"
                        style={{ color: offer.color }}
                      >
                        {offer.company}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{offer.role}</span>
                      {offer.duration && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                            {offer.duration}
                          </span>
                        </>
                      )}
                      {offer.mode && (
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                          {offer.mode}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleView(offer)}
                      className="px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1"
                      style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
                    >
                      <span>👁️</span>
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      onClick={() => handleDownload(offer)}
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
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="group bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Colored top border */}
              <div
                className="h-1.5 w-full"
                style={{ backgroundColor: offer.color }}
              ></div>

              <div className="p-4">
                {/* Company Icon */}
                <div
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center border-2 text-3xl"
                  style={{ 
                    borderColor: `${offer.color}30`,
                    backgroundColor: `${offer.color}10`
                  }}
                >
                  📄
                </div>

                {/* Offer Info */}
                <h3 className="text-sm font-semibold text-gray-900 text-center line-clamp-2 mb-1">
                  {offer.company}
                </h3>
                <p className="text-xs text-gray-600 text-center mb-2 font-medium">
                  {offer.role}
                </p>

                {/* Details */}
                <div className="flex items-center justify-center gap-1 mb-3 flex-wrap">
                  {offer.duration && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                      ⏱️ {offer.duration}
                    </span>
                  )}
                  {offer.mode && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                      🏠 {offer.mode}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleView(offer)}
                    className="p-1.5 rounded-md transition-colors"
                    style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
                    title="View Offer"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleDownload(offer)}
                    className="p-1.5 rounded-md transition-colors text-white"
                    style={{ backgroundColor: "#3498db" }}
                    title="Download Offer"
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
      {filteredOffers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-3">📄</div>
          <p className="text-gray-500 font-medium">No offer letters found</p>
          <p className="text-xs text-gray-400 mb-3">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSelectedCompany("all");
              setSearchTerm("");
            }}
            className="px-4 py-2 text-sm rounded-lg transition-colors inline-flex items-center gap-2"
            style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}
          >
            <span>🔄</span> Clear Filters
          </button>
        </div>
      )}

      {/* Note about GitHub proof of work */}
      <div className="mt-8 p-4 bg-linear-to-r from-gray-50 to-white rounded-lg border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔗</div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Important Note
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              I didn't purchase certificates - these are internship offer letters. 
              The proof of my work and contributions during these internships is available on my
              <a
                href="https://github.com/imanchalsingh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-md font-medium transition-colors hover:underline"
                style={{ color: "#3498db" }}
              >
                GitHub profile
              </a>
              . Each repository contains the actual work done during the
              respective internship period.
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 bg-[#1abc9c] bg-opacity-10 text-white rounded-full">
                💻 Code Available
              </span>
              <span className="text-xs px-2 py-0.5 bg-[#3498db] bg-opacity-10 text-white rounded-full">
                📁 Public Repos
              </span>
              <span className="text-xs px-2 py-0.5 bg-[#e74c3c] bg-opacity-10 text-white rounded-full">
                ✅ Verified Work
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span>
            Showing {filteredOffers.length} of {offerLettersData.length} offer
            letters
          </span>
          <span className="px-2 py-0.5 bg-gray-100 rounded-full">
            {offerLettersData.length} Companies
          </span>
        </span>
        <div className="flex gap-2 items-center">
          <span className="hidden sm:inline">Companies:</span>
          {offerLettersData.map((offer) => (
            <div
              key={offer.id}
              className="w-2 h-2 rounded-full transition-transform hover:scale-150 cursor-pointer"
              style={{ backgroundColor: offer.color }}
              title={offer.company}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferLetters;