import { useEffect, useState} from "react";
import API from "../api/axios";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Types
export interface Badge {
  _id: string;
  title: string;
  issuer?: string;
  image?: string;
  category?: string;
  createdAt?: string;
}

export interface Contribution {
  _id: string;
  title: string;
  organization: string;
  role: string;
  description?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  type: 'internship' | 'volunteer' | 'work' | 'other';
  createdAt?: string;
}

export interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  description?: string;
  createdAt?: string;
}

export interface ContributionCert {
  _id: string;
  name?: string;
  type: string;
  event: string;
  role?: string;
  issuer?: string;
  image?: string;
  createdAt?: string;
}

export interface Internship {
  _id: string;
  role: string;
  company: string;
  mode?: string;
  duration?: string;
  image?: string;
  skills?: string[];
  createdAt?: string;
}

type DataItem = {
  _id: string;
  title?: string;
  name?: string;
  role?: string;
  issuer?: string;
  company?: string;
  organization?: string;
  event?: string;
  image?: string;
  description?: string;
  type?: string;
  category?: string;
  createdAt?: string;
  dataType: 'badge' | 'contribution' | 'certificate' | 'contribution-cert' | 'internship';
};

// Tab configuration
const tabs = [
  { id: 'all', label: 'All', icon: Trophy },
  { id: 'badges', label: 'Badges', icon: Award },
  { id: 'certificates', label: 'Certificates', icon: Medal },
  { id: 'internships', label: 'Internships', icon: Briefcase },
  { id: 'contributions', label: 'Contributions', icon: Heart },
  { id: 'contribution-certs', label: 'Contribution Certs', icon: FileText },
];

// Image View Modal
const ImageViewModal = ({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: DataItem | null;
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
      
      const title = item.title || item.name || item.role || 'document';
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-${item.dataType}.${blob.type.split('/')[1] || 'png'}`;
      
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

  const getTitle = () => {
    if (item?.title) return item.title;
    if (item?.name) return item.name;
    if (item?.role) return item.role;
    return 'Untitled';
  };

  const getIssuer = () => {
    if (item?.issuer) return item.issuer;
    if (item?.company) return item.company;
    if (item?.organization) return item.organization;
    if (item?.event) return item.event;
    return null;
  };

  const getType = () => {
    if (item?.type) return item.type;
    if (item?.category) return item.category;
    return null;
  };

  const getRole = () => {
    if (item?.role) return item.role;
    return null;
  };

  const getDataTypeLabel = () => {
    const labels: Record<string, string> = {
      badge: 'Badge',
      contribution: 'Contribution',
      certificate: 'Certificate',
      'contribution-cert': 'Contribution Certificate',
      internship: 'Internship'
    };
    return item ? labels[item.dataType] : '';
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-2xl w-full max-w-4xl border border-gray-800 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white line-clamp-1">{getTitle()}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                {getDataTypeLabel()}
              </span>
              {getIssuer() && (
                <p className="text-sm text-gray-400 line-clamp-1">{getIssuer()}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {item.image && (
              <button
                onClick={downloadImage}
                disabled={downloading}
                className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-500 hover:text-blue-400 disabled:opacity-50"
                title="Download Image"
              >
                {downloading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 flex items-center justify-center bg-gray-950/50 max-h-[70vh] overflow-auto">
          {item.image ? (
            <img
              src={item.image}
              alt={getTitle()}
              className="max-w-full max-h-[60vh] object-contain rounded-lg"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-64 h-64 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center border-2 border-gray-700">
              <div className="text-center">
                <FileText className="w-20 h-20 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">No image available</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex flex-wrap gap-2 mb-3">
            {getType() && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500 border border-blue-500/30">
                {getType()}
              </span>
            )}
            {getRole() && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-500 border border-purple-500/30">
                Role: {getRole()}
              </span>
            )}
            {item.createdAt && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600">
                Added: {new Date(item.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-gray-400">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Card Components for different data types
const BadgeCard = ({ 
  item, 
  onView,
  viewMode 
}: { 
  item: Badge & { dataType: 'badge' }; 
  onView: (item: DataItem) => void;
  viewMode: 'grid' | 'list';
}) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 hover:border-blue-500/50 transition-all group">
        <div className="flex items-center gap-4">
          <div 
            className="relative w-16 h-16 shrink-0 cursor-pointer"
            onClick={() => onView(item)}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded-lg border border-gray-700"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <Award className="w-8 h-8 text-gray-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">{item.title}</h3>
            <p className="text-gray-400 text-sm truncate">{item.issuer || 'No issuer'}</p>
            {item.category && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                {item.category}
              </span>
            )}
          </div>
          <button
            onClick={() => onView(item)}
            className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-500"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all group">
      <div 
        className="aspect-square bg-gray-900 relative cursor-pointer"
        onClick={() => onView(item)}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Award className="w-16 h-16 text-gray-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-8 h-8 text-white" />
        </div>
        {item.category && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
              {item.category}
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold truncate">{item.title}</h3>
        <p className="text-gray-400 text-sm truncate">{item.issuer || 'No issuer'}</p>
      </div>
    </div>
  );
};

const CertificateCard = ({ 
  item, 
  onView,
  viewMode 
}: { 
  item: Certificate & { dataType: 'certificate' }; 
  onView: (item: DataItem) => void;
  viewMode: 'grid' | 'list';
}) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 hover:border-blue-500/50 transition-all group">
        <div className="flex items-center gap-4">
          <div 
            className="relative w-16 h-16 shrink-0 cursor-pointer"
            onClick={() => onView(item)}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded-lg border border-gray-700"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <Medal className="w-8 h-8 text-gray-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">{item.title}</h3>
            <p className="text-gray-400 text-sm truncate">{item.issuer}</p>
            <p className="text-gray-500 text-xs">Issued: {new Date(item.issueDate).toLocaleDateString()}</p>
          </div>
          <button
            onClick={() => onView(item)}
            className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-500"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all group">
      <div 
        className="aspect-square bg-gray-900 relative cursor-pointer"
        onClick={() => onView(item)}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Medal className="w-16 h-16 text-gray-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold truncate">{item.title}</h3>
        <p className="text-gray-400 text-sm truncate">{item.issuer}</p>
        <p className="text-gray-500 text-xs mt-1">{new Date(item.issueDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

const InternshipCard = ({ 
  item, 
  onView,
  viewMode 
}: { 
  item: Internship & { dataType: 'internship' }; 
  onView: (item: DataItem) => void;
  viewMode: 'grid' | 'list';
}) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 hover:border-blue-500/50 transition-all group">
        <div className="flex items-center gap-4">
          <div 
            className="relative w-16 h-16 shrink-0 cursor-pointer"
            onClick={() => onView(item)}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.role}
                className="w-full h-full object-cover rounded-lg border border-gray-700"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <Briefcase className="w-8 h-8 text-gray-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">{item.role}</h3>
            <p className="text-gray-400 text-sm truncate">{item.company}</p>
            {item.mode && (
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {item.mode}
              </p>
            )}
          </div>
          <button
            onClick={() => onView(item)}
            className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-500"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all group">
      <div 
        className="aspect-square bg-gray-900 relative cursor-pointer"
        onClick={() => onView(item)}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.role}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Briefcase className="w-16 h-16 text-gray-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold truncate">{item.role}</h3>
        <p className="text-gray-400 text-sm truncate">{item.company}</p>
        {item.mode && (
          <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {item.mode}
          </p>
        )}
      </div>
    </div>
  );
};

const ContributionCard = ({ 
  item, 
  onView,
  viewMode 
}: { 
  item: Contribution & { dataType: 'contribution' }; 
  onView: (item: DataItem) => void;
  viewMode: 'grid' | 'list';
}) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 hover:border-blue-500/50 transition-all group">
        <div className="flex items-center gap-4">
          <div 
            className="relative w-16 h-16 shrink-0 cursor-pointer"
            onClick={() => onView(item)}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded-lg border border-gray-700"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <Heart className="w-8 h-8 text-gray-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">{item.title}</h3>
            <p className="text-gray-400 text-sm truncate">{item.organization}</p>
            <p className="text-gray-500 text-xs">{item.role}</p>
          </div>
          <button
            onClick={() => onView(item)}
            className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-500"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all group">
      <div 
        className="aspect-square bg-gray-900 relative cursor-pointer"
        onClick={() => onView(item)}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-16 h-16 text-gray-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
            {item.type}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold truncate">{item.title}</h3>
        <p className="text-gray-400 text-sm truncate">{item.organization}</p>
        <p className="text-gray-500 text-xs mt-1">{item.role}</p>
      </div>
    </div>
  );
};

const ContributionCertCard = ({ 
  item, 
  onView,
  viewMode 
}: { 
  item: ContributionCert & { dataType: 'contribution-cert' }; 
  onView: (item: DataItem) => void;
  viewMode: 'grid' | 'list';
}) => {
  const title = item.role|| 'Untitled';

  if (viewMode === 'list') {
    return (
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 hover:border-blue-500/50 transition-all group">
        <div className="flex items-center gap-4">
          <div 
            className="relative w-16 h-16 shrink-0 cursor-pointer"
            onClick={() => onView(item)}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={title}
                className="w-full h-full object-cover rounded-lg border border-gray-700"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <FileText className="w-8 h-8 text-gray-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">{title}</h3>
            <p className="text-gray-400 text-sm truncate">{item.event}</p>
            {item.role && (
              <p className="text-gray-500 text-xs">{item.role}</p>
            )}
          </div>
          <button
            onClick={() => onView(item)}
            className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-500"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all group">
      <div 
        className="aspect-square bg-gray-900 relative cursor-pointer"
        onClick={() => onView(item)}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-16 h-16 text-gray-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
            {item.type}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold truncate">{title}</h3>
        <p className="text-gray-400 text-sm truncate">{item.event}</p>
        {item.role && (
          <p className="text-gray-500 text-xs mt-1">{item.role}</p>
        )}
      </div>
    </div>
  );
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [badges, setBadges] = useState<Badge[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [contributionCerts, setContributionCerts] = useState<ContributionCert[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);

  // Fetch all data with real-time updates
  const fetchAllData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    try {
      const [
        badgesRes,
        certificatesRes,
        internshipsRes,
        contributionsRes,
        contributionCertsRes
      ] = await Promise.allSettled([
        API.get("/badges"),
        API.get("/certificates"),
        API.get("/internships"),
        API.get("/contributions"),
        API.get("/contributions/cert"),
      ]);
      
      // Handle each response
      if (badgesRes.status === 'fulfilled') setBadges(badgesRes.value.data || []);
      else console.error("Error fetching badges:", badgesRes.reason);
      
      if (certificatesRes.status === 'fulfilled') setCertificates(certificatesRes.value.data || []);
      else console.error("Error fetching certificates:", certificatesRes.reason);
      
      if (internshipsRes.status === 'fulfilled') setInternships(internshipsRes.value.data || []);
      else console.error("Error fetching internships:", internshipsRes.reason);
      
      if (contributionsRes.status === 'fulfilled') setContributions(contributionsRes.value.data || []);
      else console.error("Error fetching contributions:", contributionsRes.reason);
      
      if (contributionCertsRes.status === 'fulfilled') setContributionCerts(contributionCertsRes.value.data || []);
      else console.error("Error fetching contribution certificates:", contributionCertsRes.reason);
      
    } catch (error) {
      console.error("Error in fetchAllData:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  // Set up real-time updates (poll every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData(true);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter function
  const filterItems = (items: any[], searchFields: (keyof any)[]): any[] => {
    if (!searchTerm) return items;
    return items.filter(item => 
      searchFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  };

  // Apply filters based on active tab
  const getFilteredItems = () => {
    const allItems: DataItem[] = [];

    if (activeTab === 'all' || activeTab === 'badges') {
      const filtered = filterItems(badges, ['title', 'issuer', 'category']);
      allItems.push(...filtered.map(item => ({ ...item, dataType: 'badge' as const })));
    }

    if (activeTab === 'all' || activeTab === 'certificates') {
      const filtered = filterItems(certificates, ['name', 'issuer']);
      allItems.push(...filtered.map(item => ({ ...item, dataType: 'certificate' as const })));
    }

    if (activeTab === 'all' || activeTab === 'internships') {
      const filtered = filterItems(internships, ['role', 'company', 'location']);
      allItems.push(...filtered.map(item => ({ ...item, dataType: 'internship' as const })));
    }

    if (activeTab === 'all' || activeTab === 'contributions') {
      const filtered = filterItems(contributions, ['title', 'organization', 'role']);
      allItems.push(...filtered.map(item => ({ ...item, dataType: 'contribution' as const })));
    }

    if (activeTab === 'all' || activeTab === 'contribution-certs') {
      const filtered = filterItems(contributionCerts, ['name', 'title', 'event', 'role', 'issuer']);
      allItems.push(...filtered.map(item => ({ ...item, dataType: 'contribution-cert' as const })));
    }

    return allItems;
  };

  const filteredItems = getFilteredItems();

  const handleViewItem = (item: DataItem) => {
    setSelectedItem(item);
    setIsImageViewOpen(true);
  };

  const handleRefresh = () => {
    fetchAllData(true);
  };

  const totalItems = 
    badges.length + 
    certificates.length + 
    internships.length + 
    contributions.length + 
    contributionCerts.length;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Image View Modal */}
      <ImageViewModal
        isOpen={isImageViewOpen}
        onClose={() => {
          setIsImageViewOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-linear-to-br from-blue-500 to-yellow-500 rounded-2xl shadow-lg shadow-blue-500/20">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="bg-linear-to-r from-blue-400 via-blue-500 to-yellow-500 bg-clip-text text-transparent">
                    Achievements Gallery
                  </span>
                </h1>
                <p className="text-gray-400 text-lg mt-2">
                  Explore all your achievements, certificates, and contributions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all border border-gray-700 disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Login as Admin Button */}
              <button
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all font-medium shadow-lg flex items-center gap-2 border border-gray-700"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden sm:inline">Login as Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Trophy className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white">{totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-yellow-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Badges</p>
                <p className="text-2xl font-bold text-yellow-400">{badges.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Medal className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Certificates</p>
                <p className="text-2xl font-bold text-purple-400">{certificates.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-green-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Internships</p>
                <p className="text-2xl font-bold text-green-400">{internships.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-pink-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Contributions</p>
                <p className="text-2xl font-bold text-pink-400">{contributions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Contribution Certs</p>
                <p className="text-2xl font-bold text-indigo-400">{contributionCerts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const counts: Record<string, number> = {
              all: totalItems,
              badges: badges.length,
              certificates: certificates.length,
              internships: internships.length,
              contributions: contributions.length,
              'contribution-certs': contributionCerts.length,
            };
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {counts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'all' ? 'all items' : tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* View Toggle */}
              <div className="flex bg-gray-900 rounded-xl border border-gray-700 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Last updated indicator */}
              <div className="text-xs text-gray-500">
                {refreshing ? 'Updating...' : 'Live data'}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-gray-700 border-b-yellow-500 rounded-full animate-spin absolute top-0 left-0 opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700">
                <div className="w-24 h-24 bg-linear-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                  <Trophy className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
                <p className="text-gray-400">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : `No ${activeTab === 'all' ? 'items' : tabs.find(t => t.id === activeTab)?.label.toLowerCase()} available`}
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
                {filteredItems.map((item) => {
                  switch (item.dataType) {
                    case 'badge':
                      return (
                        <BadgeCard
                          key={`badge-${item._id}`}
                          item={item as Badge & { dataType: 'badge' }}
                          onView={handleViewItem}
                          viewMode={viewMode}
                        />
                      );
                    case 'certificate':
                      return (
                        <CertificateCard
                          key={`cert-${item._id}`}
                          item={item as Certificate & { dataType: 'certificate' }}
                          onView={handleViewItem}
                          viewMode={viewMode}
                        />
                      );
                    case 'internship':
                      return (
                        <InternshipCard
                          key={`intern-${item._id}`}
                          item={item as Internship & { dataType: 'internship' }}
                          onView={handleViewItem}
                          viewMode={viewMode}
                        />
                      );
                    case 'contribution':
                      return (
                        <ContributionCard
                          key={`contrib-${item._id}`}
                          item={item as Contribution & { dataType: 'contribution' }}
                          onView={handleViewItem}
                          viewMode={viewMode}
                        />
                      );
                    case 'contribution-cert':
                      return (
                        <ContributionCertCard
                          key={`contrib-cert-${item._id}`}
                          item={item as ContributionCert & { dataType: 'contribution-cert' }}
                          onView={handleViewItem}
                          viewMode={viewMode}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}