import { useEffect, useState } from "react";
import {
  BarChart2,
  Award,
  RefreshCw,
  PieChart,
  BookOpen,
  Code,
  Cloud,
  Database,
  Shield,
  Smartphone,
  Cpu,
  Globe,
} from "lucide-react";
import API from "../../api/axios";
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
import { Bar, Doughnut } from "react-chartjs-2";

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
  totalContributions?: number;
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
      contributions?: number;
    };
  };
}

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
          "#3B82F6", // blue
          "#EAB308", // yellow
          "#A855F7", // purple
          "#22C55E", // green
          "#EF4444", // red
          "#F97316", // orange
          "#14B8A6", // teal
          "#EC4899", // pink
        ],
        borderColor: "#E5E7EB",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#E5E7EB",
        },
        ticks: {
          color: "#6B7280",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <PieChart className="w-5 h-5 text-blue-600" />
        Distribution by Category
      </h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
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
          "#3B82F6",
          "#EAB308",
          "#A855F7",
          "#22C55E",
          "#EF4444",
        ],
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
      },
    },
    cutout: "60%",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-purple-600" />
        Top Issuers
      </h3>
      <div className="h-64 flex items-center justify-center">
        <Doughnut data={chartData} options={options} />
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

  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [certsRes, badgesRes, internshipsRes, contributionsRes] = await Promise.all([
        API.get("/certificates"),
        API.get("/badges"),
        API.get("/internships"),
        API.get("/contributions"),
      ]);

      const certs = certsRes.data;
      const badges = badgesRes.data;
      const internships = internshipsRes.data;
      const contributions = contributionsRes.data;

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
          const month = cert.createdAt.substring(0, 7);
          if (!timelineData[month])
            timelineData[month] = {
              certificates: 0,
              badges: 0,
              internships: 0,
              contributions: 0,
              certContributions: 0,
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
              contributions: 0,
              certContributions: 0,
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
              contributions: 0,
              certContributions: 0,
            };
          timelineData[month].internships += 1;
        }
      });

      setStats({
        totalCertificates: certs.length,
        totalBadges: badges.length,
        totalInternships: internships.length,
        totalItems: certs.length + badges.length + internships.length + contributions.length,
        totalContributions: contributions.length,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <BarChart2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Track your achievements and progress
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing && "animate-spin"}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Items</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalItems}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Certificates</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalCertificates}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Badges</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.totalBadges}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Internships</p>
            <p className="text-3xl font-bold text-green-600">{stats.totalInternships}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Contributions</p>
            <p className="text-3xl font-bold text-purple-600">{stats.totalContributions}</p>
          </div>
          
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CategoryChart data={stats.categories} />
          <IssuerChart data={stats.issuers} />
        </div>

        {/* Category Breakdown */}
        {Object.keys(stats.categories).length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-600" />
              Category Breakdown
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div
                  key={category}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {category === "frontend" && <Code className="w-4 h-4 text-blue-600" />}
                    {category === "backend" && <Database className="w-4 h-4 text-yellow-600" />}
                    {category === "devops" && <Cloud className="w-4 h-4 text-purple-600" />}
                    {category === "cloud" && <Globe className="w-4 h-4 text-sky-600" />}
                    {category === "security" && <Shield className="w-4 h-4 text-red-600" />}
                    {category === "mobile" && <Smartphone className="w-4 h-4 text-green-600" />}
                    {category === "ai-ml" && <Cpu className="w-4 h-4 text-pink-600" />}
                    {!["frontend", "backend", "devops", "cloud", "security", "mobile", "ai-ml"].includes(category) && (
                      <BookOpen className="w-4 h-4 text-gray-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {category}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {((count / stats.totalItems) * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Unique Categories</p>
            <p className="text-xl font-bold text-gray-900">
              {Object.keys(stats.categories).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Unique Issuers</p>
            <p className="text-xl font-bold text-gray-900">
              {Object.keys(stats.issuers).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Avg per Month</p>
            <p className="text-xl font-bold text-gray-900">
              {Math.round(
                stats.totalItems /
                Math.max(1, Object.keys(stats.timeline).length),
              )}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-xl font-bold text-green-600">78%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;