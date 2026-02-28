import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
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
  Calendar,
  Users,
  Briefcase,
  Award,
  MapPin,
  Clock,
  UserCircle,
  FileText,
  Eye,
  Download,
  Edit,
} from "lucide-react";

export interface ContributionCert {
  _id: string;
  name?: string;
  title?: string; // For compatibility
  type: string;
  event: string;
  role?: string;
  issuer?: string;
  image?: string;
  description?: string;
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
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-900 rounded-2xl w-full max-w-md p-6 border border-gray-800 shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-yellow-500/20 rounded-full">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-gray-400 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-lg shadow-red-500/20"
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
  const [imageLoaded, setImageLoaded] = useState(false);

  const downloadImage = async () => {
    if (!contribution?.image) return;
    
    try {
      // Fetch the image
      const response = await fetch(contribution.image);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const title = contribution.name || contribution.title || 'contribution';
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-certificate.${blob.type.split('/')[1] || 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      
      // Fallback: try to download via canvas
      if (imageRef.current && imageLoaded) {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = imageRef.current.naturalWidth;
          canvas.height = imageRef.current.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(imageRef.current, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              const title = contribution.name || contribution.title || 'contribution';
              link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-certificate.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }
          }, 'image/png');
        } catch (canvasError) {
          console.error('Canvas download failed:', canvasError);
        }
      }
    }
  };

  if (!isOpen || !contribution) return null;

  const title = contribution.name || contribution.title || 'Untitled';
  const displayIssuer = contribution.issuer || contribution.event;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-2xl w-full max-w-4xl border border-gray-800 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            {displayIssuer && (
              <p className="text-sm text-gray-400">{displayIssuer}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {contribution.image && (
              <button
                onClick={downloadImage}
                className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-500 hover:text-blue-400"
                title="Download Image"
              >
                <Download className="w-5 h-5" />
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
          {contribution.image ? (
            <img
              ref={imageRef}
              src={contribution.image}
              alt={title}
              className="max-w-full max-h-[60vh] object-contain rounded-lg"
              crossOrigin="anonymous"
              onLoad={() => setImageLoaded(true)}
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
          <div className="flex flex-wrap gap-3">
            {contribution.type && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500 border border-blue-500/30">
                {contribution.type}
              </span>
            )}
            {contribution.role && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-500 border border-purple-500/30">
                Role: {contribution.role}
              </span>
            )}
            {contribution.createdAt && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600">
                Added: {new Date(contribution.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          {contribution.description && (
            <p className="mt-3 text-sm text-gray-400">{contribution.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal Component
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
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-900 rounded-2xl w-full max-w-3xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            {mode === 'add' ? 'Add Contribution Certificate' : 'Edit Contribution Certificate'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Title/Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., Google Summer of Code"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Event/Organization *
                </label>
                <input
                  type="text"
                  name="event"
                  value={form.event}
                  onChange={(e) => setForm({ ...form, event: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., Google, Microsoft, Local Community"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Role (Optional)
                </label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., Mentor, Participant, Organizer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Issuer (Optional)
                </label>
                <input
                  type="text"
                  name="issuer"
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., Google, University, Organization"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                  placeholder="Describe the contribution, achievements, or learnings..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Certificate/Image *
                </label>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-blue-500 transition-colors group">
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setPreview("");
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
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
                        required={mode === 'add' && !initialData?.image}
                      />
                      <div className="py-8">
                        <Upload className="w-12 h-12 text-gray-600 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                        <p className="text-gray-400 group-hover:text-blue-500 transition-colors">
                          Click to upload certificate image
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? "Saving..." : mode === 'add' ? "Add Contribution" : "Update Contribution"}
              {!isSubmitting && (mode === 'add' ? <Plus className="w-5 h-5" /> : <Edit className="w-5 h-5" />)}
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
      internship: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      certificate: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      workshop: "bg-purple-500/20 text-purple-500 border-purple-500/30",
      conference: "bg-green-500/20 text-green-500 border-green-500/30",
      hackathon: "bg-pink-500/20 text-pink-500 border-pink-500/30",
      volunteer: "bg-orange-500/20 text-orange-500 border-orange-500/30",
      training: "bg-indigo-500/20 text-indigo-500 border-indigo-500/30",
      other: "bg-gray-500/20 text-gray-500 border-gray-500/30",
    };
    return type ? colors[type] || colors.other : colors.other;
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "internship":
        return <Briefcase className="w-4 h-4" />;
      case "certificate":
        return <Award className="w-4 h-4" />;
      case "workshop":
        return <Users className="w-4 h-4" />;
      case "conference":
        return <Calendar className="w-4 h-4" />;
      case "hackathon":
        return <Clock className="w-4 h-4" />;
      case "volunteer":
        return <UserCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const title = contribution.name || contribution.title || 'Untitled';

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all group">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onViewImage(contribution)}
            className="relative flex-shrink-0"
          >
            {contribution.image ? (
              <img
                src={contribution.image}
                alt={title}
                className="w-16 h-16 object-cover rounded-lg border border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="w-16 h-16 bg-linear-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center border border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors">
                <FileText className="w-8 h-8 text-gray-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
          </button>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {contribution.event}
              {contribution.issuer && ` • ${contribution.issuer}`}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {contribution.type && (
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(contribution.type)}`}
                >
                  {getTypeIcon(contribution.type)}
                  {contribution.type}
                </span>
              )}
              {contribution.role && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600">
                  <UserCircle className="w-3 h-3" />
                  {contribution.role}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewImage(contribution)}
              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-500 hover:text-blue-400"
              title="View Image"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit(contribution)}
              className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors text-yellow-500 hover:text-yellow-400"
              title="Edit"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(contribution._id, title)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500 hover:text-red-400"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        {contribution.description && (
          <p className="mt-3 text-sm text-gray-500 line-clamp-2 pl-20">
            {contribution.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default function ContributionCertAdmin() {
  const [contributions, setContributions] = useState<ContributionCert[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<
    ContributionCert[]
  >([]);
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

  // Fetch contributions
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

  // Filter and search
  useEffect(() => {
    let filtered = contributions;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          (item.name || item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.issuer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    setFilteredContributions(filtered);
  }, [searchTerm, selectedType, contributions]);

  // Handle add contribution
  const handleAddContribution = async (formData: FormData) => {
    try {
      await API.post("/contributions/cert", formData, {
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
      await API.put(`/contributions/cert/${id}`, formData, {
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
          await API.delete(`/contributions/cert/${id}`);
          await fetchContributions();
          setAlertConfig({
            isOpen: true,
            title: "Contribution Deleted",
            message: `"${title}" has been successfully deleted.`,
            onConfirm: () =>
              setAlertConfig((prev) => ({ ...prev, isOpen: false })),
          });
        } catch (error) {
          console.error("Error deleting contribution:", error);
        }
      },
    });
  };

  // Handle edit click
  const handleEditClick = (contribution: ContributionCert) => {
    setSelectedContribution(contribution);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  // Handle view image
  const handleViewImage = (contribution: ContributionCert) => {
    setSelectedContribution(contribution);
    setIsImageViewModalOpen(true);
  };

  // Get unique types
  const types = [
    "all",
    ...new Set(contributions.map((item) => item.type).filter(Boolean)),
  ];

  // Helper function for type colors (used in grid view)
  const getTypeColor = (type?: string) => {
    const colors: Record<string, string> = {
      internship: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      certificate: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      workshop: "bg-purple-500/20 text-purple-500 border-purple-500/30",
      conference: "bg-green-500/20 text-green-500 border-green-500/30",
      hackathon: "bg-pink-500/20 text-pink-500 border-pink-500/30",
      volunteer: "bg-orange-500/20 text-orange-500 border-orange-500/30",
      training: "bg-indigo-500/20 text-indigo-500 border-indigo-500/30",
      other: "bg-gray-500/20 text-gray-500 border-gray-500/30",
    };
    return type ? colors[type] || colors.other : colors.other;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950">
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
        <div className="relative mb-8">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>

          <div className="relative flex items-center gap-4">
            <div className="p-4 bg-linear-to-br from-blue-500 to-yellow-500 rounded-2xl shadow-lg shadow-blue-500/20">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-linear-to-r from-blue-400 via-blue-500 to-yellow-500 bg-clip-text text-transparent">
                  Contributions & Certificates
                </span>
              </h1>
              <p className="text-gray-400 text-lg mt-2">
                Manage your professional contributions, internships, and certificates
              </p>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search contributions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Type Filter */}
              <div className="relative flex-1 lg:flex-none">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full lg:w-48 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-900 rounded-xl border border-gray-700 p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={() => {
                  setFormMode('add');
                  setSelectedContribution(null);
                  setIsFormModalOpen(true);
                }}
                className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Contribution</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Award className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white">
                  {contributions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-yellow-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Filter className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Filtered</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {filteredContributions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Types</p>
                <p className="text-2xl font-bold text-purple-400">
                  {types.length - 1}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-green-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ImageIcon className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">With Images</p>
                <p className="text-2xl font-bold text-green-400">
                  {contributions.filter((c) => c.image).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contributions List/Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-gray-700 border-b-yellow-500 rounded-full animate-spin absolute top-0 left-0 opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Award className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        ) : filteredContributions.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700">
            <div className="w-24 h-24 bg-linear-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
              <Award className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No contributions found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedType !== "all"
                ? "Try adjusting your filters"
                : "Add your first contribution to showcase your experience"}
            </p>
            {!searchTerm && selectedType === "all" && (
              <button
                onClick={() => {
                  setFormMode('add');
                  setSelectedContribution(null);
                  setIsFormModalOpen(true);
                }}
                className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium inline-flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-5 h-5" />
                Add Contribution
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContributions.map((item) => {
              const title = item.name || item.title || 'Untitled';
              return (
                <div key={item._id} className="group">
                  <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/5">
                    <div
                      className="aspect-video bg-linear-to-br from-gray-800 to-gray-900 relative cursor-pointer"
                      onClick={() => handleViewImage(item)}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="w-16 h-16 text-gray-700 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm">No image</p>
                          </div>
                        </div>
                      )}

                      {/* Type Badge on Image */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}
                        >
                          {item.type}
                        </span>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                        {title}
                      </h3>

                      <div className="space-y-2 mb-3">
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.event}</span>
                        </p>
                        {item.role && (
                          <p className="text-gray-400 text-sm flex items-center gap-2">
                            <UserCircle className="w-4 h-4 shrink-0" />
                            <span className="truncate">{item.role}</span>
                          </p>
                        )}
                        {item.issuer && (
                          <p className="text-gray-400 text-sm flex items-center gap-2">
                            <Award className="w-4 h-4 shrink-0" />
                            <span className="truncate">{item.issuer}</span>
                          </p>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                          {item.description}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewImage(item)}
                          className="flex-1 px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(item)}
                          className="flex-1 px-3 py-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(item._id, title)}
                          className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
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