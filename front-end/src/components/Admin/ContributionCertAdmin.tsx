import { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import {
  Search,
  Plus,
  Trash2,
  X,
  Filter,
  Image as ImageIcon,
  Upload,
  AlertTriangle,
  Grid,
  List,
  Briefcase,
  Award,
  FileText,
  Eye,
  Download,
  Edit,
} from "lucide-react";

export interface ContributionCert {
  _id: string;
  name?: string;
  title?: string;
  type: string;
  event: string;
  role?: string;
  issuer?: string;
  image?: string;
  description?: string;
  createdAt?: string;
}

// Alert Dialog Component
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
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
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
  contribution: ContributionCert | null;
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
      const title = contribution.name || contribution.title || 'contribution';
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.${blob.type.split('/')[1] || 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (!isOpen || !contribution) return null;

  const title = contribution.name || contribution.title || 'Untitled';
  const displayIssuer = contribution.issuer || contribution.event;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-4xl shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {displayIssuer && (
              <p className="text-sm text-gray-600">{displayIssuer}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {contribution.image && (
              <button
                onClick={downloadImage}
                className="p-2 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-900"
                title="Download Image"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4 flex items-center justify-center bg-gray-50 max-h-[70vh] overflow-auto">
          {contribution.image ? (
            <img
              ref={imageRef}
              src={contribution.image}
              alt={title}
              className="max-w-full max-h-[60vh] object-contain rounded"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No image available</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex flex-wrap gap-2">
            {contribution.type && (
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                {contribution.type}
              </span>
            )}
            {contribution.role && (
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700">
                Role: {contribution.role}
              </span>
            )}
            {contribution.createdAt && (
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                Added: {new Date(contribution.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          {contribution.description && (
            <p className="mt-3 text-sm text-gray-600">{contribution.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Form Modal Component
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
  initialData?: ContributionCert | null;
  mode?: 'add' | 'edit';
}) => {
  const [form, setForm] = useState({
    name: initialData?.name || initialData?.title || "",
    type: initialData?.type || "",
    event: initialData?.event || "",
    role: initialData?.role || "",
    issuer: initialData?.issuer || "",
    description: initialData?.description || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialData?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || initialData.title || "",
        type: initialData.type || "",
        event: initialData.event || "",
        role: initialData.role || "",
        issuer: initialData.issuer || "",
        description: initialData.description || "",
      });
      setPreview(initialData.image || "");
    } else {
      setForm({
        name: "",
        type: "",
        event: "",
        role: "",
        issuer: "",
        description: "",
      });
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
    formData.append("name", form.name);
    formData.append("type", form.type);
    formData.append("event", form.event);
    formData.append("role", form.role);
    formData.append("issuer", form.issuer);
    formData.append("description", form.description);
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
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'add' ? 'Add Contribution' : 'Edit Contribution'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title/Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., Google Summer of Code"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select type</option>
                  <option value="internship">Internship</option>
                  <option value="certificate">Certificate</option>
                  <option value="workshop">Workshop</option>
                  <option value="conference">Conference</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="volunteer">Volunteer Work</option>
                  <option value="training">Training Program</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event/Organization *
                </label>
                <input
                  type="text"
                  value={form.event}
                  onChange={(e) => setForm({ ...form, event: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., Google, Microsoft"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role (Optional)
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., Mentor, Participant"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuer (Optional)
                </label>
                <input
                  type="text"
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., Google, University"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Describe the contribution..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate/Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-500">
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-32 mx-auto rounded object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setPreview("");
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        required={mode === 'add' && !initialData?.image}
                      />
                      <div className="py-4">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? "Saving..." : mode === 'add' ? "Add" : "Update"}
              {!isSubmitting && mode === 'add' && <Plus className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Contribution Card Component (List View)
const ContributionCard = ({
  contribution,
  onDelete,
  onEdit,
  onViewImage,
}: {
  contribution: ContributionCert;
  onDelete: (id: string, title: string) => void;
  onEdit: (contribution: ContributionCert) => void;
  onViewImage: (contribution: ContributionCert) => void;
}) => {
  const getTypeColor = (type?: string) => {
    const colors: Record<string, string> = {
      internship: "bg-blue-100 text-blue-700",
      certificate: "bg-yellow-100 text-yellow-700",
      workshop: "bg-purple-100 text-purple-700",
      conference: "bg-green-100 text-green-700",
      hackathon: "bg-pink-100 text-pink-700",
      volunteer: "bg-orange-100 text-orange-700",
      training: "bg-indigo-100 text-indigo-700",
      other: "bg-gray-100 text-gray-700",
    };
    return type ? colors[type] || colors.other : colors.other;
  };

  const title = contribution.name || contribution.title || 'Untitled';

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-all">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewImage(contribution)}
            className="shrink-0"
          >
            {contribution.image ? (
              <img
                src={contribution.image}
                alt={title}
                className="w-12 h-12 object-cover rounded-md border border-gray-200 cursor-pointer hover:opacity-80"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {title}
              </h3>
              {contribution.type && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(contribution.type)}`}>
                  {contribution.type}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {contribution.event}
              {contribution.issuer && ` • ${contribution.issuer}`}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewImage(contribution)}
              className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-900"
              title="View Image"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(contribution)}
              className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-900"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(contribution._id, title)}
              className="p-1.5 hover:bg-red-100 rounded-md text-red-600 hover:text-red-700"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        {contribution.role && (
          <p className="mt-2 text-xs text-gray-500 pl-15">
            Role: {contribution.role}
          </p>
        )}
      </div>
    </div>
  );
};

export default function ContributionCertAdmin() {
  const [contributions, setContributions] = useState<ContributionCert[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<ContributionCert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImageViewModalOpen, setIsImageViewModalOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<ContributionCert | null>(null);
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

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/contributions/cert");
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

  useEffect(() => {
    let filtered = contributions;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          (item.name || item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.issuer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    setFilteredContributions(filtered);
  }, [searchTerm, selectedType, contributions]);

  const handleAddContribution = async (formData: FormData) => {
    try {
      await API.post("/contributions/cert", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchContributions();
    } catch (error) {
      console.error("Error adding contribution:", error);
    }
  };

  const handleEditContribution = async (formData: FormData, id?: string) => {
    if (!id) return;
    try {
      await API.put(`/contributions/cert/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchContributions();
    } catch (error) {
      console.error("Error updating contribution:", error);
    }
  };

  const confirmDelete = (id: string, title: string) => {
    setAlertConfig({
      isOpen: true,
      title: "Delete Contribution",
      message: `Are you sure you want to delete "${title}"?`,
      onConfirm: async () => {
        try {
          await API.delete(`/contributions/cert/${id}`);
          await fetchContributions();
        } catch (error) {
          console.error("Error deleting contribution:", error);
        }
      },
    });
  };

  const handleEditClick = (contribution: ContributionCert) => {
    setSelectedContribution(contribution);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleViewImage = (contribution: ContributionCert) => {
    setSelectedContribution(contribution);
    setIsImageViewModalOpen(true);
  };

  const types = ["all", ...new Set(contributions.map((item) => item.type).filter(Boolean))];

  const getTypeColor = (type?: string) => {
    const colors: Record<string, string> = {
      internship: "bg-blue-100 text-blue-700",
      certificate: "bg-yellow-100 text-yellow-700",
      workshop: "bg-purple-100 text-purple-700",
      conference: "bg-green-100 text-green-700",
      hackathon: "bg-pink-100 text-pink-700",
      volunteer: "bg-orange-100 text-orange-700",
      training: "bg-indigo-100 text-indigo-700",
      other: "bg-gray-100 text-gray-700",
    };
    return type ? colors[type] || colors.other : colors.other;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modals */}
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        message={alertConfig.message}
      />

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
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Contributions & Certificates
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your professional contributions and certificates
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
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
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded">
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-lg font-semibold text-gray-900">{contributions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-yellow-100 rounded">
                <Filter className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Filtered</p>
                <p className="text-lg font-semibold text-yellow-600">{filteredContributions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 rounded">
                <Briefcase className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Types</p>
                <p className="text-lg font-semibold text-purple-600">{types.length - 1}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-100 rounded">
                <ImageIcon className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">With Images</p>
                <p className="text-lg font-semibold text-green-600">{contributions.filter(c => c.image).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          </div>
        ) : filteredContributions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No contributions found</h3>
            <p className="text-xs text-gray-600 mb-4">
              {searchTerm || selectedType !== "all" ? "Try adjusting your filters" : "Add your first contribution"}
            </p>
            {!searchTerm && selectedType === "all" && (
              <button
                onClick={() => {
                  setFormMode('add');
                  setSelectedContribution(null);
                  setIsFormModalOpen(true);
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm inline-flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Contribution
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContributions.map((item) => (
              <div key={item._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-500">
                <div
                  className="aspect-video bg-gray-100 relative cursor-pointer"
                  onClick={() => handleViewImage(item)}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                    {item.name || item.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">{item.event}</p>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleViewImage(item)}
                      className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(item._id, item.name || item.title || '')}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredContributions.map((item) => (
              <ContributionCard
                key={item._id}
                contribution={item}
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