import React, { useEffect, useState } from "react";
import {
  BarChart2,
  Award,
  TrendingUp,
  RefreshCw,
  PieChart,
  Activity,
  Star,
  Zap,
  BookOpen,
  Briefcase,
  Code,
  Cloud,
  Database,
  Shield,
  Smartphone,
  Cpu,
  Globe,
  Layers,
  ChevronRight,
  MoreVertical,
  NotebookText,
  LucideGitGraph,
} from "lucide-react";
import API from "../api/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
);

// Types
interface Certificate {
  _id: string;
  title: string;
  issuer?: string;
  category?: string;
  createdAt?: string;
}

interface Badge {
  _id: string;
  title: string;
  issuer?: string;
  category?: string;
  createdAt?: string;
}

interface Internship {
  _id: string;
  title: string;
  company?: string;
  category?: string;
  createdAt?: string;
}

interface DashboardStats {
  totalCertificates: number;
  totalBadges: number;
  totalInternships: number;
  totalItems: number;
  categories: {
    [key: string]: number;
  };
  issuers: {
    [key: string]: number;
  };
  timeline: {
    [key: string]: {
      certificates: number;
      badges: number;
      internships: number;
    };
  };
}

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  bgColor,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  trend?: { value: number; isPositive: boolean };
  bgColor: string;
}) => (
  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        {trend && (
          <p
            className={`text-sm mt-2 flex items-center gap-1 ${trend.isPositive ? "text-green-400" : "text-red-400"}`}
          >
            <TrendingUp
              className={`w-4 h-4 ${!trend.isPositive && "rotate-180"}`}
            />
            {trend.value}% from last month
          </p>
        )}
      </div>
      <div
        className={`p-4 rounded-xl ${bgColor} group-hover:scale-110 transition-transform`}
      >
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

// Category Chart Component
const CategoryChart = ({ data }: { data: { [key: string]: number } }) => {
  const chartData = {
    labels: Object.keys(data).map(
      (key) => key.charAt(0).toUpperCase() + key.slice(1),
    ),
    datasets: [
      {
        label: "Items by Category",
        data: Object.values(data),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)", // blue
          "rgba(234, 179, 8, 0.8)", // yellow
          "rgba(168, 85, 247, 0.8)", // purple
          "rgba(34, 197, 94, 0.8)", // green
          "rgba(239, 68, 68, 0.8)", // red
          "rgba(249, 115, 22, 0.8)", // orange
          "rgba(20, 184, 166, 0.8)", // teal
          "rgba(236, 72, 153, 0.8)", // pink
        ],
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#9CA3AF",
          font: { size: 12 },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: { color: "rgba(75, 85, 99, 0.2)" },
        ticks: { color: "#9CA3AF" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#9CA3AF" },
      },
    },
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <PieChart className="w-5 h-5 text-blue-400" />
        Distribution by Category
      </h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

// Timeline Chart Component
const TimelineChart = ({ data }: { data: { [key: string]: any } }) => {
  const months = Object.keys(data).sort();

  const chartData = {
    labels: months.map((m) =>
      new Date(m).toLocaleDateString("default", {
        month: "short",
        year: "numeric",
      }),
    ),
    datasets: [
      {
        label: "Certificates",
        data: months.map((m) => data[m]?.certificates || 0),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Badges",
        data: months.map((m) => data[m]?.badges || 0),
        borderColor: "#EAB308",
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Internships",
        data: months.map((m) => data[m]?.internships || 0),
        borderColor: "#A855F7",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#9CA3AF",
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(75, 85, 99, 0.2)" },
        ticks: { color: "#9CA3AF", stepSize: 1 },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#9CA3AF" },
      },
    },
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-yellow-400" />
        Growth Timeline
      </h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

// Issuer Doughnut Chart
const IssuerChart = ({ data }: { data: { [key: string]: number } }) => {
  const topIssuers = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const chartData = {
    labels: topIssuers.map(([issuer]) => issuer),
    datasets: [
      {
        data: topIssuers.map(([, count]) => count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#9CA3AF",
          font: { size: 11 },
        },
      },
    },
    cutout: "60%",
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-purple-400" />
        Top Issuers
      </h3>
      <div className="h-62.5 flex items-center justify-center">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

// Recent Items Component
const RecentItems = ({ items, type }: { items: any[]; type: string }) => {
  const getIcon = () => {
    switch (type) {
      case "certificates":
        return <NotebookText className="w-4 h-4" />;
      case "badges":
        return <Award className="w-4 h-4" />;
      case "internships":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case "certificates":
        return "text-blue-400 bg-blue-500/20";
      case "badges":
        return "text-yellow-400 bg-yellow-500/20";
      case "internships":
        return "text-purple-400 bg-purple-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className={`p-2 rounded-lg ${getColor()}`}>{getIcon()}</span>
          Recent {type.charAt(0).toUpperCase() + type.slice(1)}
        </h3>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {items.slice(0, 5).map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700/30 transition-colors group"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColor()}`}
              >
                {getIcon()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                {item.title}
              </p>
              <p className="text-sm text-gray-400 truncate">
                {item.issuer || item.company || "No issuer"}
              </p>
            </div>
            {item.category && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                {item.category}
              </span>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-center text-gray-500 py-4">No recent items</p>
        )}

        <button className="w-full mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1 py-2">
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCertificates: 0,
    totalBadges: 0,
    totalInternships: 0,
    totalItems: 0,
    categories: {},
    issuers: {},
    timeline: {},
  });

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [timeRange, setTimeRange] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [certsRes, badgesRes, internshipsRes] = await Promise.all([
        API.get("/certificates"),
        API.get("/badges"),
        API.get("/internships"),
      ]);

      const certs = certsRes.data;
      const badges = badgesRes.data;
      const internships = internshipsRes.data;

      setCertificates(certs);
      setBadges(badges);
      setInternships(internships);

      // Process statistics
      const categoryCount: { [key: string]: number } = {};
      const issuerCount: { [key: string]: number } = {};
      const timelineData: { [key: string]: any } = {};

      // Process certificates
      certs.forEach((cert: Certificate) => {
        if (cert.category) {
          categoryCount[cert.category] =
            (categoryCount[cert.category] || 0) + 1;
        }
        if (cert.issuer) {
          issuerCount[cert.issuer] = (issuerCount[cert.issuer] || 0) + 1;
        }
        if (cert.createdAt) {
          const month = cert.createdAt.substring(0, 7); // YYYY-MM
          if (!timelineData[month])
            timelineData[month] = {
              certificates: 0,
              badges: 0,
              internships: 0,
            };
          timelineData[month].certificates += 1;
        }
      });

      // Process badges
      badges.forEach((badge: Badge) => {
        if (badge.category) {
          categoryCount[badge.category] =
            (categoryCount[badge.category] || 0) + 1;
        }
        if (badge.issuer) {
          issuerCount[badge.issuer] = (issuerCount[badge.issuer] || 0) + 1;
        }
        if (badge.createdAt) {
          const month = badge.createdAt.substring(0, 7);
          if (!timelineData[month])
            timelineData[month] = {
              certificates: 0,
              badges: 0,
              internships: 0,
            };
          timelineData[month].badges += 1;
        }
      });

      // Process internships
      internships.forEach((internship: Internship) => {
        if (internship.category) {
          categoryCount[internship.category] =
            (categoryCount[internship.category] || 0) + 1;
        }
        if (internship.company) {
          issuerCount[internship.company] =
            (issuerCount[internship.company] || 0) + 1;
        }
        if (internship.createdAt) {
          const month = internship.createdAt.substring(0, 7);
          if (!timelineData[month])
            timelineData[month] = {
              certificates: 0,
              badges: 0,
              internships: 0,
            };
          timelineData[month].internships += 1;
        }
      });

      setStats({
        totalCertificates: certs.length,
        totalBadges: badges.length,
        totalInternships: internships.length,
        totalItems: certs.length + badges.length + internships.length,
        categories: categoryCount,
        issuers: issuerCount,
        timeline: timelineData,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="w-20 h-20 border-4 border-gray-700 border-b-yellow-500 rounded-full animate-spin absolute top-0 left-0 opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BarChart2 className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="relative flex items-center gap-4">
            <div className="p-4 bg-linear-to-br from-blue-500 to-yellow-500 rounded-2xl shadow-lg shadow-blue-500/20">
              <LucideGitGraph className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-linear-to-r from-blue-400 via-blue-500 to-yellow-500 bg-clip-text text-transparent">
                  Analytics Dashboard
                </span>
              </h1>
              <p className="text-gray-400 text-lg mt-2">
                Track your achievements and progress
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="year">This Year</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-400 ${refreshing && "animate-spin"}`}
              />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Items"
            value={stats.totalItems}
            icon={Layers}
            color="text-blue-400"
            bgColor="bg-blue-500/20"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Certificates"
            value={stats.totalCertificates}
            icon={NotebookText}
            color="text-yellow-400"
            bgColor="bg-yellow-500/20"
          />
          <StatCard
            title="Badges"
            value={stats.totalBadges}
            icon={Award}
            color="text-purple-400"
            bgColor="bg-purple-500/20"
          />
          <StatCard
            title="Internships"
            value={stats.totalInternships}
            icon={Briefcase}
            color="text-green-400"
            bgColor="bg-green-500/20"
          />
        </div>

        {/* Category Distribution and Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CategoryChart data={stats.categories} />
          <TimelineChart data={stats.timeline} />
        </div>

        {/* Issuer Chart and Recent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <IssuerChart data={stats.issuers} />
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RecentItems items={certificates} type="certificates" />
              <RecentItems items={badges} type="badges" />
              <RecentItems items={internships} type="internships" />
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Category Breakdown
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.categories).map(([category, count]) => (
              <div
                key={category}
                className="p-4 bg-gray-700/30 rounded-xl border border-gray-600"
              >
                <div className="flex items-center gap-3 mb-2">
                  {category === "frontend" && (
                    <Code className="w-5 h-5 text-blue-400" />
                  )}
                  {category === "backend" && (
                    <Database className="w-5 h-5 text-yellow-400" />
                  )}
                  {category === "devops" && (
                    <Cloud className="w-5 h-5 text-purple-400" />
                  )}
                  {category === "cloud" && (
                    <Globe className="w-5 h-5 text-sky-400" />
                  )}
                  {category === "security" && (
                    <Shield className="w-5 h-5 text-red-400" />
                  )}
                  {category === "mobile" && (
                    <Smartphone className="w-5 h-5 text-green-400" />
                  )}
                  {category === "ai-ml" && (
                    <Cpu className="w-5 h-5 text-pink-400" />
                  )}
                  {![
                    "frontend",
                    "backend",
                    "devops",
                    "cloud",
                    "security",
                    "mobile",
                    "ai-ml",
                  ].includes(category) && (
                    <BookOpen className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-white font-medium capitalize">
                    {category}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-sm text-gray-400">
                  {((count / stats.totalItems) * 100).toFixed(1)}% of total
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Unique Categories</p>
            <p className="text-2xl font-bold text-white">
              {Object.keys(stats.categories).length}
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Unique Issuers</p>
            <p className="text-2xl font-bold text-white">
              {Object.keys(stats.issuers).length}
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Avg per Month</p>
            <p className="text-2xl font-bold text-white">
              {Math.round(
                stats.totalItems /
                  Math.max(1, Object.keys(stats.timeline).length),
              )}
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Completion Rate</p>
            <p className="text-2xl font-bold text-green-400">78%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
