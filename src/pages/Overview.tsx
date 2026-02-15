import React, { useState, useEffect } from 'react';
import data from '../data/certificates.json';

const Overview: React.FC = () => {
  const [animatedValues, setAnimatedValues] = useState({
    certificates: 0,
    badges: 0,
    contributionBadges: 0,
    contributionCerts: 0,
    offers: 0,
    total: 0
  });

  // Calculate real-time stats from JSON
  const stats = {
    totalCertificates: data.courseCertificates.length,
    totalBadges: data.badges.length,
    totalContributionBadges: data.contributionBadges.length,
    totalContributionCerts: data.contributionCertificates.length,
    totalOffers: data.offerLetters.length,
    
    // Category breakdown
    categories: data.courseCertificates.reduce((acc: any, cert) => {
      acc[cert.category] = (acc[cert.category] || 0) + 1;
      return acc;
    }, {}),
    
    // Issuer breakdown
    issuers: data.courseCertificates.reduce((acc: any, cert) => {
      acc[cert.issuer] = (acc[cert.issuer] || 0) + 1;
      return acc;
    }, {}),
    
    // Contribution events
    contributionEvents: data.contributionBadges.reduce((acc: any, badge) => {
      acc[badge.event] = (acc[badge.event] || 0) + 1;
      return acc;
    }, {})
  };

  const totalItems = stats.totalCertificates + stats.totalBadges + 
                     stats.totalContributionBadges + stats.totalContributionCerts + 
                     stats.totalOffers;

  // Animate numbers on load
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedValues({
        certificates: Math.floor(stats.totalCertificates * Math.min(progress, 1)),
        badges: Math.floor(stats.totalBadges * Math.min(progress, 1)),
        contributionBadges: Math.floor(stats.totalContributionBadges * Math.min(progress, 1)),
        contributionCerts: Math.floor(stats.totalContributionCerts * Math.min(progress, 1)),
        offers: Math.floor(stats.totalOffers * Math.min(progress, 1)),
        total: Math.floor(totalItems * Math.min(progress, 1))
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  // Category colors mapping
  const categoryColors: any = {
    Frontend: "#3498db",
    Backend: "#e74c3c",
    Database: "#2ecc71",
    Programming: "#f39c12",
    "Full Stack": "#9b59b6",
    AI: "#1abc9c",
    Projects: "#e67e22",
    Algorithms: "#8e44ad",
    "Computer Science": "#34495e",
    "Soft Skills": "#95a5a6",
    API: "#27ae60"
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="flex gap-1">
          <span className="px-3 py-1 text-xs rounded-full bg-[#1abc9c] text-white">📊 Real-time</span>
          <span className="px-3 py-1 text-xs rounded-full bg-[#3498db] text-white">🔄 Live Data</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Card */}
        <div className="bg-linear-to-br from-[#34495e] to-[#2c3e50] text-white rounded-lg p-4 shadow-lg">
          <div className="text-2xl font-bold">{animatedValues.total}</div>
          <div className="text-xs opacity-90">Total Items</div>
          <div className="mt-2 text-[10px] opacity-75">All achievements</div>
        </div>

        {/* Course Certificates */}
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4" style={{ borderLeftColor: '#3498db' }}>
          <div className="text-2xl font-bold text-gray-800">{animatedValues.certificates}</div>
          <div className="text-xs text-gray-500">Course Certs</div>
          <div className="mt-2 flex gap-1">
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full">
              {stats.totalCertificates} total
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4" style={{ borderLeftColor: '#f39c12' }}>
          <div className="text-2xl font-bold text-gray-800">{animatedValues.badges}</div>
          <div className="text-xs text-gray-500">Platform Badges</div>
          <div className="mt-2 flex gap-1">
            <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-600 rounded-full">
              {stats.totalBadges} earned
            </span>
          </div>
        </div>

        {/* Contribution Badges */}
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4" style={{ borderLeftColor: '#9b59b6' }}>
          <div className="text-2xl font-bold text-gray-800">{animatedValues.contributionBadges}</div>
          <div className="text-xs text-gray-500">Contribution Badges</div>
          <div className="mt-2 flex gap-1">
            <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded-full">
              {stats.totalContributionBadges} events
            </span>
          </div>
        </div>

        {/* Contribution Certs */}
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4" style={{ borderLeftColor: '#1abc9c' }}>
          <div className="text-2xl font-bold text-gray-800">{animatedValues.contributionCerts}</div>
          <div className="text-xs text-gray-500">Contribution Certs</div>
          <div className="mt-2 flex gap-1">
            <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-600 rounded-full">
              {stats.totalContributionCerts} earned
            </span>
          </div>
        </div>

        {/* Offer Letters */}
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4" style={{ borderLeftColor: '#e74c3c' }}>
          <div className="text-2xl font-bold text-gray-800">{animatedValues.offers}</div>
          <div className="text-xs text-gray-500">Offer Letters</div>
          <div className="mt-2 flex gap-1">
            <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full">
              {stats.totalOffers} internships
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Distribution */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📊</span> Certificates by Category
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.categories)
              .sort(([,a]: any, [,b]: any) => b - a)
              .map(([category, count]: [string, any]) => (
              <div key={category} className="flex items-center gap-2">
                <div className="w-20 text-xs text-gray-600">{category}</div>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${(count / stats.totalCertificates) * 100}%`,
                      backgroundColor: categoryColors[category] || "#95a5a6"
                    }}
                  ></div>
                </div>
                <div className="w-8 text-xs font-medium text-gray-700">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Issuer Distribution */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>🏢</span> Top Certificate Issuers
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {Object.entries(stats.issuers)
              .sort(([,a]: any, [,b]: any) => b - a)
              .slice(0, 8)
              .map(([issuer, count]: [string, any]) => (
              <div key={issuer} className="flex items-center gap-2">
                <div className="w-24 text-xs text-gray-600 truncate">{issuer}</div>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#3498db] rounded-full transition-all duration-1000"
                    style={{ width: `${(count / stats.totalCertificates) * 100}%` }}
                  ></div>
                </div>
                <div className="w-8 text-xs font-medium text-gray-700">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contribution Events */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>🤝</span> Contribution Events
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(stats.contributionEvents).map(([event, count]: [string, any]) => (
              <div key={event} className="p-2 bg-gray-50 rounded-lg">
                <div className="text-xs font-medium text-gray-700">{event}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-lg font-bold" style={{ color: '#9b59b6' }}>{count}</span>
                  <span className="text-[10px] text-gray-500">badges</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offer Letters Summary */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>💼</span> Internship Offers
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {data.offerLetters.map((offer) => (
              <div 
                key={offer.id} 
                className="p-2 rounded-lg text-xs"
                style={{ backgroundColor: `${offer.color}15` }}
              >
                <div className="font-medium" style={{ color: offer.color }}>{offer.company}</div>
                <div className="text-[10px] text-gray-500 mt-1">{offer.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
        <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">📚</div>
          <div>
            <div className="text-xs text-gray-500">Learning Hours</div>
            <div className="text-sm font-bold">~200+ hrs</div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">🏆</div>
          <div>
            <div className="text-xs text-gray-500">Achievements</div>
            <div className="text-sm font-bold">{totalItems}</div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">🚀</div>
          <div>
            <div className="text-xs text-gray-500">Skills</div>
            <div className="text-sm font-bold">{Object.keys(stats.categories).length}</div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">💼</div>
          <div>
            <div className="text-xs text-gray-500">Internships</div>
            <div className="text-sm font-bold">{stats.totalOffers}</div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-[10px] text-gray-400 text-right">
        Last updated: {new Date().toLocaleDateString()} • Real-time data from JSON
      </div>
    </div>
  );
};

export default Overview;