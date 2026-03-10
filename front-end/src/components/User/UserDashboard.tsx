import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  Search,
  Grid,
  List,
  Award,
  Trophy,
  Eye,
  Download,
  FileText,
  Briefcase,
  MapPin,
  LogIn,
  X,
  Loader2,
  Heart,
  Medal,
  RefreshCw,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Unified Archive Type
export interface ArchiveItem {
  _id: string;
  title: string;
  type: "badge" | "certificate" | "internship" | "contribution";
  issuer?: string;
  event?: string;
  role?: string;
  category?: string;
  duration?: string;
  mode?: string;
  status?: string;
  skills?: string[];
  image?: string;
  createdAt?: string;
}

// Tab configuration
const tabs = [
  { id: 'all', label: 'All', icon: Trophy },
  { id: 'badge', label: 'Badges', icon: Award },
  { id: 'certificate', label: 'Certificates', icon: Medal },
  { id: 'internship', label: 'Internships', icon: Briefcase },
  { id: 'contribution', label: 'Contributions', icon: Heart },
];

// Image View Modal
const ImageViewModal = ({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: ArchiveItem | null;
}) => {
  const [downloading, setDownloading] = useState(false);

  const downloadImage = async () => {
    if (!item?.image) return;

    setDownloading(true);
    try {
      const response = await fetch(item.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.title.replace(/\s+/g, '-').toLowerCase()}-${item.type}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setDownloading(false);
    }
  };

  const getIssuer = () => item?.issuer || item?.event || null;
  const getTypeLabel = () => {
    const labels = {
      badge: 'Badge',
      certificate: 'Certificate',
      internship: 'Internship',
      contribution: 'Contribution'
    };
    return item ? labels[item.type] : '';
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-4xl shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <div className="flex gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                {getTypeLabel()}
              </span>
              {getIssuer() && (
                <span className="text-sm text-gray-600">{getIssuer()}</span>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            {item.image && (
              <button
                onClick={downloadImage}
                disabled={downloading}
                className="p-2 hover:bg-gray-100 rounded"
              >
                {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 flex items-center justify-center bg-gray-50 max-h-[70vh]">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="max-w-full max-h-[60vh] object-contain"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex flex-wrap gap-2">
            {item.category && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                {item.category}
              </span>
            )}
            {item.role && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                Role: {item.role}
              </span>
            )}
            {item.mode && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {item.mode}
              </span>
            )}
            {item.duration && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                {item.duration}
              </span>
            )}
            {item.status && (
              <span className={`px-2 py-0.5 rounded text-xs ${
                item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                item.status === 'Active' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {item.status}
              </span>
            )}
          </div>
          
          {item.skills && item.skills.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Skills:</p>
              <div className="flex flex-wrap gap-1">
                {item.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Card Component
const ArchiveCard = ({
  item,
  onView,
  viewMode
}: {
  item: ArchiveItem;
  onView: (item: ArchiveItem) => void;
  viewMode: 'grid' | 'list';
}) => {
  const getIcon = () => {
    switch (item.type) {
      case 'badge': return <Award className="w-6 h-6 text-gray-400" />;
      case 'certificate': return <Medal className="w-6 h-6 text-gray-400" />;
      case 'internship': return <Briefcase className="w-6 h-6 text-gray-400" />;
      case 'contribution': return <Heart className="w-6 h-6 text-gray-400" />;
      default: return <FileText className="w-6 h-6 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'badge': return 'bg-yellow-100 text-yellow-700';
      case 'certificate': return 'bg-purple-100 text-purple-700';
      case 'internship': return 'bg-green-100 text-green-700';
      case 'contribution': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const secondaryInfo = item.issuer || item.event || '';

  if (viewMode === 'list') {
    return (
      <div className="bg-white border rounded-lg p-3 hover:border-gray-300 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 shrink-0 cursor-pointer" onClick={() => onView(item)}>
            {item.image ? (
              <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded border" />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center border">
                {getIcon()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{item.title}</h3>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${getTypeColor(item.type)}`}>
                {item.type}
              </span>
            </div>
            {secondaryInfo && <p className="text-xs text-gray-500 truncate">{secondaryInfo}</p>}
            {item.role && <p className="text-[10px] text-gray-400">{item.role}</p>}
          </div>
          <button onClick={() => onView(item)} className="p-1.5 hover:bg-gray-100 rounded">
            <Eye className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden hover:border-gray-300 transition-all">
      <div className="aspect-square bg-gray-50 relative cursor-pointer" onClick={() => onView(item)}>
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">{getIcon()}</div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center">
          <Eye className="w-6 h-6 text-white" />
        </div>
        <span className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded ${getTypeColor(item.type)}`}>
          {item.type}
        </span>
      </div>
      <div className="p-2">
        <h3 className="font-medium text-sm truncate">{item.title}</h3>
        {secondaryInfo && <p className="text-xs text-gray-500 truncate">{secondaryInfo}</p>}
      </div>
    </div>
  );
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all items
  const fetchItems = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const response = await API.get("/archive");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchItems(true), 30000);
    return () => clearInterval(interval);
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(items.map(item => item.category).filter(Boolean))];

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.issuer?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.event?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.role?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesCategory && matchesSearch;
  });

  // Get counts
  const counts = {
    all: items.length,
    badge: items.filter(i => i.type === 'badge').length,
    certificate: items.filter(i => i.type === 'certificate').length,
    internship: items.filter(i => i.type === 'internship').length,
    contribution: items.filter(i => i.type === 'contribution').length,
  };

  const handleViewItem = (item: ArchiveItem) => {
    setSelectedItem(item);
    setIsImageViewOpen(true);
  };

  const handleRefresh = () => fetchItems(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <ImageViewModal
        isOpen={isImageViewOpen}
        onClose={() => {
          setIsImageViewOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Achievements Gallery</h1>
              <p className="text-sm text-gray-600">View all your badges, certificates, internships and contributions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-white border rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded"><Trophy className="w-4 h-4 text-blue-600" /></div>
              <div><p className="text-xs text-gray-600">Total</p><p className="text-lg font-semibold">{counts.all}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-yellow-100 rounded"><Award className="w-4 h-4 text-yellow-600" /></div>
              <div><p className="text-xs text-gray-600">Badges</p><p className="text-lg font-semibold">{counts.badge}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 rounded"><Medal className="w-4 h-4 text-purple-600" /></div>
              <div><p className="text-xs text-gray-600">Certs</p><p className="text-lg font-semibold">{counts.certificate}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-100 rounded"><Briefcase className="w-4 h-4 text-green-600" /></div>
              <div><p className="text-xs text-gray-600">Intern</p><p className="text-lg font-semibold">{counts.internship}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-pink-100 rounded"><Heart className="w-4 h-4 text-pink-600" /></div>
              <div><p className="text-xs text-gray-600">Contrib</p><p className="text-lg font-semibold">{counts.contribution}</p></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 mb-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setCategoryFilter('all'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {counts[tab.id as keyof typeof counts] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg p-3 mb-6 border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 border rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>

              <div className="flex border rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-500"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-500"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          {showFilters && categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
              <span className="text-xs text-gray-500 py-1">Category:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-1 text-xs rounded ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">No items found</h3>
                <p className="text-sm text-gray-600">
                  {searchTerm || categoryFilter !== 'all' 
                    ? 'Try adjusting your filters'
                    : `No ${activeTab === 'all' ? 'items' : activeTab + 's'} yet`}
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3' 
                : 'space-y-2'
              }>
                {filteredItems.map(item => (
                  <ArchiveCard
                    key={item._id}
                    item={item}
                    onView={handleViewItem}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}