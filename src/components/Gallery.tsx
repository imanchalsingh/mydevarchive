import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Filter,
  Award,
  Briefcase,
  Users,
  Code,
  Globe,
  BookOpen,
  X,
  Search,
  Calendar,
  Clock,
  Building,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Info,
} from "lucide-react";
import {
  courseCertificates,
  badges,
  contributionBadges,
  contributionCertificates,
  offerLetters,
} from "../Data/Data.ts";

interface StatCard {
  title: string;
  value: number;
  icon: React.ElementType;
  linear: string;
}

// Add type for data items
type DataItem = {
  id: number;
  name: string;
  issuer?: string;
  company?: string;
  category?: string;
  type?: string;
  role?: string;
  event?: string;
  year?: string;
  duration?: string;
  mode?: string;
  status?: string;
  image: string;
  color?: string;
  date?: string;
  [key: string]: any;
};

const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [filters, setFilters] = useState<Record<string, string>>({
    certificates: "all",
    badges: "all",
    contributions: "all",
    offers: "all",
  });
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({
    certificates: "",
    badges: "",
    contributions: "",
    offers: "",
  });
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const colors = [
    "#1abc9c",
    "#16a085",
    "#2ecc71",
    "#27ae60",
    "#3498db",
    "#2980b9",
    "#9b59b6",
    "#8e44ad",
    "#34495e",
    "#2c3e50",
    "#f1c40f",
    "#f39c12",
    "#e67e22",
    "#d35400",
    "#e74c3c",
    "#c0392b",
    "#ecf0f1",
    "#bdc3c7",
    "#95a5a6",
    "#7f8c8d",
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "certificates", label: "Certificates", icon: BookOpen },
    { id: "badges", label: "Badges", icon: Award },
    { id: "contributions", label: "Contributions", icon: Users },
    { id: "offers", label: "Internships", icon: Briefcase },
  ];

  // Statistics
  const statistics = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    courseCertificates.forEach((cert: DataItem) => {
      if (cert.category) {
        categoryCount[cert.category] = (categoryCount[cert.category] || 0) + 1;
      }
    });

    const issuerCount: Record<string, number> = {};
    courseCertificates.forEach((cert: DataItem) => {
      if (cert.issuer) {
        issuerCount[cert.issuer] = (issuerCount[cert.issuer] || 0) + 1;
      }
    });

    const yearData: Record<string, number> = {};
    [...badges, ...contributionBadges].forEach((item: DataItem) => {
      if (item.year) {
        yearData[item.year] = (yearData[item.year] || 0) + 1;
      }
    });

    const companyCount: Record<string, number> = {};
    offerLetters.forEach((offer: DataItem) => {
      if (offer.company) {
        companyCount[offer.company] = (companyCount[offer.company] || 0) + 1;
      }
    });

    return {
      categoryData: Object.entries(categoryCount).map(([name, value]) => ({
        name,
        value,
      })),
      issuerData: Object.entries(issuerCount).map(([name, value]) => ({
        name,
        value,
      })),
      yearData: Object.entries(yearData).map(([name, value]) => ({
        name,
        value: parseInt(value.toString()),
      })),
      companyData: Object.entries(companyCount).map(([name, value]) => ({
        name,
        value,
      })),
      totals: {
        certificates: courseCertificates.length,
        badges: badges.length,
        contributions:
          contributionBadges.length + contributionCertificates.length,
        offers: offerLetters.length,
      },
    };
  }, []);

  const statCards: StatCard[] = [
    {
      title: "Certificates",
      value: statistics.totals.certificates,
      icon: BookOpen,
      linear: "from-emerald-500 to-teal-600",
    },
    {
      title: "Badges",
      value: statistics.totals.badges,
      icon: Award,
      linear: "from-blue-500 to-indigo-600",
    },
    {
      title: "Contributions",
      value: statistics.totals.contributions,
      icon: Users,
      linear: "from-purple-500 to-pink-600",
    },
    {
      title: "Internships",
      value: statistics.totals.offers,
      icon: Briefcase,
      linear: "from-orange-500 to-red-600",
    },
  ];

  // Filter functions
  const getFilteredItems = (items: DataItem[], section: string) => {
    return items.filter((item) => {
      const searchTerm = searchTerms[section]?.toLowerCase() || "";
      const matchesSearch = 
        item.name?.toLowerCase().includes(searchTerm) ||
        item.issuer?.toLowerCase().includes(searchTerm) ||
        item.company?.toLowerCase().includes(searchTerm) ||
        item.category?.toLowerCase().includes(searchTerm) ||
        item.type?.toLowerCase().includes(searchTerm) ||
        item.role?.toLowerCase().includes(searchTerm) ||
        item.event?.toLowerCase().includes(searchTerm);
      
      const filterValue = filters[section];
      if (filterValue === "all") return matchesSearch;
      
      const matchesFilter = 
        item.category?.toLowerCase() === filterValue.toLowerCase() ||
        item.type?.toLowerCase() === filterValue.toLowerCase() ||
        item.issuer?.toLowerCase() === filterValue.toLowerCase() ||
        item.company?.toLowerCase() === filterValue.toLowerCase();
      
      return matchesSearch && matchesFilter;
    });
  };

  // Get unique filter options for a section
  const getFilterOptions = (items: DataItem[]) => {
    const options = new Set<string>();
    items.forEach((item) => {
      if (item.category) options.add(item.category);
      if (item.type) options.add(item.type);
      if (item.issuer) options.add(item.issuer);
      if (item.company) options.add(item.company);
    });
    return Array.from(options);
  };

  // Download image function
  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  // Modal Component
  const Modal = ({
    item,
    onClose,
  }: {
    item: DataItem;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-[#111] rounded-2xl overflow-hidden border border-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative group h-full min-h-100 bg-black">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => downloadImage(item.image, item.name)}
              className="absolute bottom-4 right-4 p-3 bg-[#1abc9c] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#16a085]"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">{item.name}</h2>

            <div className="space-y-4">
              {item.issuer && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Building className="w-5 h-5 text-[#1abc9c]" />
                  <span>{item.issuer}</span>
                </div>
              )}

              {item.company && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Building className="w-5 h-5 text-[#3498db]" />
                  <span>{item.company}</span>
                </div>
              )}

              {item.role && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Briefcase className="w-5 h-5 text-[#9b59b6]" />
                  <span>{item.role}</span>
                </div>
              )}

              {item.category && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Code className="w-5 h-5 text-[#e74c3c]" />
                  <span>{item.category}</span>
                </div>
              )}

              {item.year && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-[#f39c12]" />
                  <span>{item.year}</span>
                </div>
              )}

              {item.duration && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-[#2ecc71]" />
                  <span>{item.duration}</span>
                </div>
              )}

              {item.mode && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Globe className="w-5 h-5 text-[#9b59b6]" />
                  <span>{item.mode}</span>
                </div>
              )}

              {item.date && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-[#f1c40f]" />
                  <span>{item.date}</span>
                </div>
              )}

              {item.status && (
                <div className="mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Gallery Card Component
  const GalleryCard = ({
    item,
    index,
  }: {
    item: DataItem;
    index: number;
  }) => (
    <div
      className="group relative bg-[#111] rounded-xl overflow-hidden border border-gray-800 hover:border-[#1abc9c] transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedItem(item)}
    >
      <div className="relative h-48 overflow-hidden bg-black">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            downloadImage(item.image, item.name);
          }}
          className="absolute bottom-2 right-2 p-2 bg-[#1abc9c] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#16a085] z-10"
        >
          <Download className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          {item.issuer || item.company || item.event || ""}
        </p>

        <div className="flex items-center justify-between">
          <span
            className="px-2 py-1 text-xs rounded-full"
            style={{
              backgroundColor: `${colors[index % colors.length]}20`,
              color: colors[index % colors.length],
            }}
          >
            {item.category || item.type || item.role || "Achievement"}
          </span>

          {item.year && (
            <span className="text-xs text-gray-500">{item.year}</span>
          )}
        </div>
      </div>
    </div>
  );

  // Overview Page
  const OverviewPage = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-linear-to-br ${stat.linear} p-6 rounded-xl relative overflow-hidden group`}
          >
            <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform" />
            <stat.icon className="w-8 h-8 text-white/80 mb-3" />
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-white/80">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-[#1abc9c]" />
            <h3 className="text-lg font-semibold text-white">
              Category Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statistics.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                  const percentage = percent ? (percent * 100).toFixed(0) : "0";
                  return `${name} ${percentage}%`;
                }}
                outerRadius={80}
                dataKey="value"
              >
                {statistics.categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Issuers */}
        <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <BarChartIcon className="w-5 h-5 text-[#3498db]" />
            <h3 className="text-lg font-semibold text-white">Top Issuers</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistics.issuerData.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value">
                {statistics.issuerData.slice(0, 8).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-[#1abc9c] to-[#3498db] bg-clip-text text-transparent">
                Achievement Gallery
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Showcase of Learning & Professional Growth
              </p>
            </div>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 bg-[#111] rounded-lg border border-gray-800 hover:border-[#1abc9c] transition-colors lg:hidden"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-[#1abc9c] text-white"
                    : "bg-[#111] text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filters for each section */}
        {activeTab !== "overview" && (
          <div className={`mb-8 ${isFilterOpen ? "block" : "hidden lg:block"}`}>
            <div className="bg-[#111] rounded-xl p-4 border border-gray-800">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerms[activeTab]}
                    onChange={(e) =>
                      setSearchTerms({
                        ...searchTerms,
                        [activeTab]: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-[#1abc9c] text-white"
                  />
                </div>

                <select
                  value={filters[activeTab]}
                  onChange={(e) =>
                    setFilters({ ...filters, [activeTab]: e.target.value })
                  }
                  className="px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-[#1abc9c] text-white"
                >
                  <option value="all">All Categories</option>
                  {getFilterOptions(
                    activeTab === "certificates"
                      ? courseCertificates
                      : activeTab === "badges"
                        ? badges
                        : activeTab === "contributions"
                          ? [...contributionBadges, ...contributionCertificates]
                          : offerLetters
                  ).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mt-8">
          {activeTab === "overview" && <OverviewPage />}

          {activeTab === "certificates" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredItems(courseCertificates, "certificates").map(
                (item, index) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    index={index}
                  />
                ),
              )}
            </div>
          )}

          {activeTab === "badges" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredItems(badges, "badges").map((item, index) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          )}

          {activeTab === "contributions" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredItems(
                [...contributionBadges, ...contributionCertificates],
                "contributions"
              ).map((item, index) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          )}

          {activeTab === "offers" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getFilteredItems(offerLetters, "offers").map((item) => (
                  <div
                    key={item.id}
                    className="group relative bg-[#111] rounded-xl overflow-hidden border border-gray-800 hover:border-[#1abc9c] transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="relative h-48 overflow-hidden bg-linear-to-br from-gray-900 to-black">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(item.image, item.name);
                        }}
                        className="absolute bottom-2 right-2 p-2 bg-[#1abc9c] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#16a085] z-10"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1">
                        {item.company}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">{item.role}</p>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{item.duration}</span>
                        <span className="mx-1">•</span>
                        <Globe className="w-3 h-3" />
                        <span>{item.mode}</span>
                      </div>

                      <div className="mt-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Note Component */}
              <div className="relative mt-8 p-6 rounded-xl border-l-4 border-amber-500 bg-linear-to-r from-amber-500/5 to-transparent overflow-hidden group">
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-linear(circle at 2px 2px, #f59e0b 1px, transparent 0)`,
                      backgroundSize: "24px 24px",
                    }}
                  />
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Info className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      <span className="font-semibold text-amber-400">
                        Note:
                      </span>{" "}
                      I chose not to obtain paid certificates for certain
                      virtual internship programs. The complete project work and
                      proof of contribution can be viewed on my{" "}
                      <a
                        href="https://github.com/imanchalsingh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors group/link"
                      >
                        GitHub profile
                        <svg
                          className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default Gallery;