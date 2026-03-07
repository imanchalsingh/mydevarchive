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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-4xl border border-gray-200 shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{getTitle()}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                {getDataTypeLabel()}
              </span>
              {getIssuer() && (
                <p className="text-sm text-gray-600 truncate">{getIssuer()}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-4">
            {item.image && (
              <button
                onClick={downloadImage}
                disabled={downloading}
                className="p-2 hover:bg-gray-100 rounded transition-colors text-blue-600 disabled:opacity-50"
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
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4 flex items-center justify-center bg-gray-50 max-h-[70vh] overflow-auto">
          {item.image ? (
            <img
              src={item.image}
              alt={getTitle()}
              className="max-w-full max-h-[60vh] object-contain rounded"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No image available</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 mb-2">
            {getType() && (
              <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 border border-blue-200">
                {getType()}
              </span>
            )}
            {getRole() && (
              <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700 border border-purple-200">
                Role: {getRole()}
              </span>
            )}
            {item.createdAt && (
              <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 border border-gray-200">
                Added: {new Date(item.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-gray-600">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Card Components
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
      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-all">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 shrink-0 cursor-pointer"
            onClick={() => onView(item)}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded border border-gray-200"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                <Award className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 text-sm font-medium truncate">{item.title}</h3>
            <p className="text-gray-500 text-xs truncate">{item.issuer || 'No issuer'}</p>
            {item.category && (
              <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">
                {item.category}
              </span>
            )}
          </div>
          <button
            onClick={() => onView(item)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors text-blue-600"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all">
      <div
        className="aspect-square bg-gray-50 relative cursor-pointer"
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
            <Award className="w-10 h-10 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-6 h-6 text-white" />
        </div>
        {item.category && (
          <div className="absolute top-2 left-2">
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">
              {item.category}
            </span>
          </div>
        )}
      </div>
      <div className="p-2">
        <h3 className="text-gray-900 text-sm font-medium truncate">{item.title}</h3>
        <p className="text-gray-500 text-xs truncate">{item.issuer || 'No issuer'}</p>
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
      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-all">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 shrink-0 cursor-pointer"
            onClick={() => onView(item)}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded border border-gray-200"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                <Medal className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 text-sm font-medium truncate">{item.title}</h3>
            <p className="text-gray-500 text-xs truncate">{item.issuer}</p>
            <p className="text-gray-400 text-[10px]">{new Date(item.issueDate).toLocaleDateString()}</p>
          </div>
          <button
            onClick={() => onView(item)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors text-blue-600"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all">
      <div
        className="aspect-square bg-gray-50 relative cursor-pointer"
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
            <Medal className="w-10 h-10 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="p-2">
        <h3 className="text-gray-900 text-sm font-medium truncate">{item.title}</h3>
        <p className="text-gray-500 text-xs truncate">{item.issuer}</p>
        <p className="text-gray-400 text-[10px] mt-0.5">{new Date(item.issueDate).toLocaleDateString()}</p>
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
      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-all">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 shrink-0 cursor-pointer"
            onClick={() => onView(item)}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.role}
                className="w-full h-full object-cover rounded border border-gray-200"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                <Briefcase className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 text-sm font-medium truncate">{item.role}</h3>
            <p className="text-gray-500 text-xs truncate">{item.company}</p>
            {item.mode && (
              <p className="text-gray-400 text-[10px] flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" /> {item.mode}
              </p>
            )}
          </div>
          <button
            onClick={() => onView(item)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors text-blue-600"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all">
      <div
        className="aspect-square bg-gray-50 relative cursor-pointer"
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
            <Briefcase className="w-10 h-10 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="p-2">
        <h3 className="text-gray-900 text-sm font-medium truncate">{item.role}</h3>
        <p className="text-gray-500 text-xs truncate">{item.company}</p>
        {item.mode && (
          <p className="text-gray-400 text-[10px] mt-0.5 flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5" /> {item.mode}
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
      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-all">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 shrink-0 cursor-pointer"
            onClick={() => onView(item)}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded border border-gray-200"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                <Heart className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 text-sm font-medium truncate">{item.title}</h3>
            <p className="text-gray-500 text-xs truncate">{item.organization}</p>
            <p className="text-gray-400 text-[10px]">{item.role}</p>
          </div>
          <button
            onClick={() => onView(item)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors text-blue-600"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all">
      <div
        className="aspect-square bg-gray-50 relative cursor-pointer"
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
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-6 h-6 text-white" />
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px]">
            {item.type}
          </span>
        </div>
      </div>
      <div className="p-2">
        <h3 className="text-gray-900 text-sm font-medium truncate">{item.title}</h3>
        <p className="text-gray-500 text-xs truncate">{item.organization}</p>
        <p className="text-gray-400 text-[10px] mt-0.5">{item.role}</p>
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
  const title = item.role || 'Untitled';

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-all">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 shrink-0 cursor-pointer"
            onClick={() => onView(item)}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={title}
                className="w-full h-full object-cover rounded border border-gray-200"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 text-sm font-medium truncate">{title}</h3>
            <p className="text-gray-500 text-xs truncate">{item.event}</p>
            {item.role && (
              <p className="text-gray-400 text-[10px]">{item.role}</p>
            )}
          </div>
          <button
            onClick={() => onView(item)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors text-blue-600"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all">
      <div
        className="aspect-square bg-gray-50 relative cursor-pointer"
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
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-6 h-6 text-white" />
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px]">
            {item.type}
          </span>
        </div>
      </div>
      <div className="p-2">
        <h3 className="text-gray-900 text-sm font-medium truncate">{title}</h3>
        <p className="text-gray-500 text-xs truncate">{item.event}</p>
        {item.role && (
          <p className="text-gray-400 text-[10px] mt-0.5">{item.role}</p>
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

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filterItems = (items: any[], searchFields: (keyof any)[]): any[] => {
    if (!searchTerm) return items;
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  };

  const getFilteredItems = () => {
    const allItems: DataItem[] = [];

    if (activeTab === 'all' || activeTab === 'badges') {
      const filtered = filterItems(badges, ['title', 'issuer', 'category']);
      allItems.push(...filtered.map(item => ({ ...item, dataType: 'badge' as const })));
    }

    if (activeTab === 'all' || activeTab === 'certificates') {
      const filtered = filterItems(certificates, ['title', 'issuer']);
      allItems.push(...filtered.map(item => ({ ...item, dataType: 'certificate' as const })));
    }

    if (activeTab === 'all' || activeTab === 'internships') {
      const filtered = filterItems(internships, ['role', 'company', 'mode']);
      allItems.push(...filtered.map(item => ({ ...item, dataType: 'internship' as const })));
    }

    if (activeTab === 'all' || activeTab === 'contributions') {
      const filtered = filterItems(contributions, ['title', 'organization', 'role']);
      allItems.push(...filtered.map(item => ({ ...item, dataType: 'contribution' as const })));
    }

    if (activeTab === 'all' || activeTab === 'contribution-certs') {
      const filtered = filterItems(contributionCerts, ['name', 'event', 'role', 'issuer']);
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Achievements Gallery
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                View your badges, certificates, and contributions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm flex items-center gap-2 border border-gray-200"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Admin Login</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded">
                <Trophy className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-xs">Total</p>
                <p className="text-lg font-semibold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-yellow-100 rounded">
                <Award className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600 text-xs">Badges</p>
                <p className="text-lg font-semibold text-gray-900">{badges.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 rounded">
                <Medal className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-xs">Certs</p>
                <p className="text-lg font-semibold text-gray-900">{certificates.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-100 rounded">
                <Briefcase className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-xs">Intern</p>
                <p className="text-lg font-semibold text-gray-900">{internships.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-pink-100 rounded">
                <Heart className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <p className="text-gray-600 text-xs">Contrib</p>
                <p className="text-lg font-semibold text-gray-900">{contributions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 rounded">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-gray-600 text-xs">C. Certs</p>
                <p className="text-lg font-semibold text-gray-900">{contributionCerts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-4 gap-1 scrollbar-hide">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-sm transition-colors ${activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
                  }`}>
                  {counts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg p-3 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'all' ? 'all items' : tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors ${viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition-colors ${viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-400">
                {refreshing ? 'Updating...' : 'Live'}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-200">
                  <Trophy className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">No items found</h3>
                <p className="text-sm text-gray-600">
                  {searchTerm
                    ? "Try adjusting your search"
                    : `No ${activeTab === 'all' ? 'items' : tabs.find(t => t.id === activeTab)?.label.toLowerCase()} yet`}
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3' : 'space-y-2'}>
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