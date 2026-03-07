import { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import {
  Search,
  Plus,
  Trash2,
  X,
  Filter,
  Upload,
  AlertTriangle,
  Grid,
  List,
  Users,
  Calendar,
  Mic,
  Presentation,
  Code,
  BookOpen,
  Heart,
  Globe,
  Award,
  UserCircle,
  Eye,
  Download,
  Edit,
} from "lucide-react";

export interface Contribution {
  _id: string;
  title: string;
  type?: string;
  issuer?: string;
  event?: string;
  image?: string;
  role?: string;
  createdAt?: string;
}

// Custom Alert Component
const AlertDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg w-full max-w-md p-6 border border-gray-200 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-50 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Image View Modal
const ImageViewModal = ({
  isOpen,
  onClose,
  contribution,
}: {
  isOpen: boolean;
  onClose: () => void;
  contribution: Contribution | null;
}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const downloadImage = async () => {
    if (!contribution?.image) return;
    
    try {
      const response = await fetch(contribution.image);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${contribution.title.replace(/\s+/g, '-').toLowerCase()}-contribution.${blob.type.split('/')[1] || 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const getTypeIcon = (type?: string) => {
    const icons: Record<string, any> = {
      conference: Mic,
      workshop: Presentation,
      meetup: Users,
      opensource: Code,
      volunteer: Heart,
      teaching: BookOpen,
      mentoring: Users,
      speaking: Mic,
      organizing: Calendar,
    };
    return type && icons[type] ? icons[type] : Globe;
  };

  if (!isOpen || !contribution) return null;

  const TypeIcon = getTypeIcon(contribution.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-4xl border border-gray-200 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TypeIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{contribution.title}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {contribution.role && (
                  <span className="flex items-center gap-1">
                    <UserCircle className="w-4 h-4" />
                    {contribution.role}
                  </span>
                )}
                {contribution.type && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {contribution.type}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {contribution.image && (
              <button
                onClick={downloadImage}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
                title="Download Image"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 flex items-center justify-center bg-gray-50 max-h-[70vh] overflow-auto">
          {contribution.image ? (
            <img
              ref={imageRef}
              src={contribution.image}
              alt={contribution.title}
              className="max-w-full max-h-[60vh] object-contain rounded-lg"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
              <div className="text-center">
                <TypeIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No image available</p>
              </div>
            </div>
          )}
        </div>

        {(contribution.issuer || contribution.event) && (
          <div className="p-4 border-t border-gray-200 grid grid-cols-2 gap-4">
            {contribution.issuer && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Issuer/Host</p>
                <p className="text-sm text-gray-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-500" />
                  {contribution.issuer}
                </p>
              </div>
            )}
            {contribution.event && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Event Date</p>
                <p className="text-sm text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {new Date(contribution.event).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Modal Component (Add/Edit)
const ContributionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'add',
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, id?: string) => Promise<void>;
  initialData?: Contribution | null;
  mode?: 'add' | 'edit';
}) => {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    issuer: initialData?.issuer || "",
    event: initialData?.event || "",
    role: initialData?.role || "",
    type: initialData?.type || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialData?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        issuer: initialData.issuer || "",
        event: initialData.event || "",
        role: initialData.role || "",
        type: initialData.type || "",
      });
      setPreview(initialData.image || "");
    } else {
      setForm({ title: "", issuer: "", event: "", role: "", type: "" });
      setPreview("");
      setImageFile(null);
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("issuer", form.issuer);
    formData.append("event", form.event);
    formData.append("role", form.role);
    formData.append("type", form.type);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    await onSubmit(formData, initialData?._id);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg w-full max-w-3xl border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Add New Contribution' : 'Edit Contribution'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contribution Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Keynote Speech at TechConf"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contribution Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="meetup">Meetup</option>
                  <option value="opensource">Open Source</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="teaching">Teaching</option>
                  <option value="mentoring">Mentoring</option>
                  <option value="speaking">Speaking</option>
                  <option value="organizing">Organizing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Role
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Speaker, Organizer, Mentor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuer/Host
                </label>
                <input
                  type="text"
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., TechConf Organization"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  value={form.event}
                  onChange={(e) => setForm({ ...form, event: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contribution Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-500 transition-colors">
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setPreview("");
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="py-6">
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? "Saving..." : mode === 'add' ? "Add Contribution" : "Update Contribution"}
              {!isSubmitting && (mode === 'add' ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Contribution Card Component
const ContributionCard = ({
  contribution,
  onDelete,
  onEdit,
  onViewImage,
}: {
  contribution: Contribution;
  onDelete: (id: string, title: string) => void;
  onEdit: (contribution: Contribution) => void;
  onViewImage: (contribution: Contribution) => void;
}) => {
  const getTypeIcon = (type?: string) => {
    const icons: Record<string, any> = {
      conference: Mic,
      workshop: Presentation,
      meetup: Users,
      opensource: Code,
      volunteer: Heart,
      teaching: BookOpen,
      mentoring: Users,
      speaking: Mic,
      organizing: Calendar,
    };
    return type && icons[type] ? icons[type] : Globe;
  };

  const getTypeColor = (type?: string) => {
    const colors: Record<string, string> = {
      conference: "bg-blue-100 text-blue-700",
      workshop: "bg-yellow-100 text-yellow-700",
      meetup: "bg-green-100 text-green-700",
      opensource: "bg-purple-100 text-purple-700",
      volunteer: "bg-pink-100 text-pink-700",
      teaching: "bg-orange-100 text-orange-700",
      mentoring: "bg-indigo-100 text-indigo-700",
      speaking: "bg-cyan-100 text-cyan-700",
      organizing: "bg-amber-100 text-amber-700",
      other: "bg-gray-100 text-gray-700",
    };
    return type ? colors[type] || colors.other : colors.other;
  };

  const TypeIcon = getTypeIcon(contribution.type);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onViewImage(contribution)}
            className="relative shrink-0"
          >
            {contribution.image ? (
              <img
                src={contribution.image}
                alt={contribution.title}
                className="w-16 h-16 object-cover rounded-md border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors">
                <TypeIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-md opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
          </button>
          
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900">
              {contribution.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {contribution.role && (
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <UserCircle className="w-3 h-3" />
                  {contribution.role}
                </span>
              )}
              {contribution.issuer && (
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {contribution.issuer}
                </span>
              )}
              {contribution.event && (
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(contribution.event).toLocaleDateString()}
                </span>
              )}
            </div>
            {contribution.type && (
              <span
                className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${getTypeColor(contribution.type)}`}
              >
                {contribution.type}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewImage(contribution)}
              className="p-2 hover:bg-blue-50 rounded-md transition-colors text-blue-600"
              title="View Image"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(contribution)}
              className="p-2 hover:bg-yellow-50 rounded-md transition-colors text-yellow-600"
              title="Edit Contribution"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(contribution._id, contribution.title)}
              className="p-2 hover:bg-red-50 rounded-md transition-colors text-red-600"
              title="Delete Contribution"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ContributionAdmin() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<
    Contribution[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImageViewModalOpen, setIsImageViewModalOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [loading, setLoading] = useState(true);

  // Fetch contributions
  const fetchContributions = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/contributions");
      setContributions(data);
      setFilteredContributions(data);
    } catch (error) {
      console.error("Error fetching contributions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = contributions;

    if (searchTerm) {
      filtered = filtered.filter(
        (cont) =>
          cont.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cont.issuer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cont.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cont.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((cont) => cont.type === selectedType);
    }

    setFilteredContributions(filtered);
  }, [searchTerm, selectedType, contributions]);

  // Handle add contribution
  const handleAddContribution = async (formData: FormData) => {
    try {
      await API.post("/contributions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchContributions();
    } catch (error) {
      console.error("Error adding contribution:", error);
    }
  };

  // Handle edit contribution
  const handleEditContribution = async (formData: FormData, id?: string) => {
    if (!id) return;
    try {
      await API.put(`/contributions/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchContributions();
    } catch (error) {
      console.error("Error updating contribution:", error);
    }
  };

  // Handle delete with confirmation
  const confirmDelete = (id: string, title: string) => {
    setAlertConfig({
      isOpen: true,
      title: "Delete Contribution",
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await API.delete(`/contributions/${id}`);
          await fetchContributions();
        } catch (error) {
          console.error("Error deleting contribution:", error);
        }
      },
    });
  };

  // Handle edit click
  const handleEditClick = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  // Handle view image
  const handleViewImage = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setIsImageViewModalOpen(true);
  };

  // Get unique types
  const types = [
    "all",
    ...new Set(contributions.map((cont) => cont.type).filter(Boolean)),
  ];

  // Statistics
  const stats = {
    total: contributions.length,
    filtered: filteredContributions.length,
    withImages: contributions.filter((c) => c.image).length,
  };

  // Helper function for type icons (for grid view)
  const getTypeIcon = (type?: string) => {
    const icons: Record<string, any> = {
      conference: Mic,
      workshop: Presentation,
      meetup: Users,
      opensource: Code,
      volunteer: Heart,
      teaching: BookOpen,
      mentoring: Users,
      speaking: Mic,
      organizing: Calendar,
    };
    return type && icons[type] ? icons[type] : Globe;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        message={alertConfig.message}
      />

      {/* Contribution Form Modal */}
      <ContributionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedContribution(null);
        }}
        onSubmit={formMode === 'add' ? handleAddContribution : handleEditContribution}
        initialData={selectedContribution}
        mode={formMode}
      />

      {/* Image View Modal */}
      <ImageViewModal
        isOpen={isImageViewModalOpen}
        onClose={() => {
          setIsImageViewModalOpen(false);
          setSelectedContribution(null);
        }}
        contribution={selectedContribution}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Contributions & Impact
              </h1>
              <p className="text-gray-600 mt-1">
                Track your community involvement, talks, and volunteer work
              </p>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contributions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Type Filter */}
              <div className="relative flex-1 lg:flex-none">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-md p-1 bg-white">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={() => {
                  setFormMode('add');
                  setSelectedContribution(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Contribution</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-600 mb-1">Total</p>
            <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-600 mb-1">Filtered</p>
            <p className="text-xl font-semibold text-blue-600">{stats.filtered}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-600 mb-1">With Images</p>
            <p className="text-xl font-semibold text-purple-600">{stats.withImages}</p>
          </div>
        </div>

        {/* Contributions Display */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading...</span>
            </div>
          </div>
        ) : filteredContributions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
              No contributions found
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchTerm || selectedType !== "all"
                ? "Try adjusting your filters"
                : "Add your first contribution to showcase your impact"}
            </p>
            {!searchTerm && selectedType === "all" && (
              <button
                onClick={() => {
                  setFormMode('add');
                  setSelectedContribution(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Contribution
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContributions.map((contribution) => {
              const TypeIcon = getTypeIcon(contribution.type);
              return (
                <div key={contribution._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-500 transition-colors">
                  <div 
                    className="aspect-video bg-gray-100 relative cursor-pointer"
                    onClick={() => handleViewImage(contribution)}
                  >
                    {contribution.image ? (
                      <img
                        src={contribution.image}
                        alt={contribution.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <TypeIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    {contribution.type && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 text-gray-700 rounded-full text-xs">
                        {contribution.type}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {contribution.title}
                    </h3>
                    <div className="space-y-1 mb-3">
                      {contribution.role && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <UserCircle className="w-3 h-3" />
                          {contribution.role}
                        </p>
                      )}
                      {contribution.issuer && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {contribution.issuer}
                        </p>
                      )}
                      {contribution.event && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(contribution.event).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleViewImage(contribution)}
                        className="flex-1 px-2 py-1.5 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(contribution)}
                        className="flex-1 px-2 py-1.5 bg-yellow-50 text-yellow-600 rounded text-xs hover:bg-yellow-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(contribution._id, contribution.title)}
                        className="px-2 py-1.5 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredContributions.map((contribution) => (
              <ContributionCard
                key={contribution._id}
                contribution={contribution}
                onDelete={confirmDelete}
                onEdit={handleEditClick}
                onViewImage={handleViewImage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}