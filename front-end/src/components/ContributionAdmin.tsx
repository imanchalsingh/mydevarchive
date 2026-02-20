import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Search,
  Plus,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Image as ImageIcon,
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

// Modal Component
const ContributionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}) => {
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    event: "",
    role: "",
    type: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    await onSubmit(formData);
    setIsSubmitting(false);
    onClose();
    setForm({ title: "", issuer: "", event: "", role: "", type: "" });
    setImageFile(null);
    setPreview("");
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
            Add New Contribution
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Contribution Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., Keynote Speech at TechConf"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Contribution Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., Speaker, Organizer, Mentor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Issuer/Host
                </label>
                <input
                  type="text"
                  name="issuer"
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., TechConf Organization"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  name="event"
                  value={form.event}
                  onChange={(e) => setForm({ ...form, event: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., TechConf 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  name="event"
                  value={form.event}
                  onChange={(e) => setForm({ ...form, event: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Contribution Image
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
                      />
                      <div className="py-8">
                        <Upload className="w-12 h-12 text-gray-600 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                        <p className="text-gray-400 group-hover:text-blue-500 transition-colors">
                          Click to upload or drag and drop
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
              {isSubmitting ? "Adding..." : "Add Contribution"}
              {!isSubmitting && <Plus className="w-5 h-5" />}
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
  isExpanded,
  onToggle,
}: {
  contribution: Contribution;
  onDelete: (id: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
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
      conference: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      workshop: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      meetup: "bg-green-500/20 text-green-500 border-green-500/30",
      opensource: "bg-purple-500/20 text-purple-500 border-purple-500/30",
      volunteer: "bg-pink-500/20 text-pink-500 border-pink-500/30",
      teaching: "bg-orange-500/20 text-orange-500 border-orange-500/30",
      mentoring: "bg-indigo-500/20 text-indigo-500 border-indigo-500/30",
      speaking: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30",
      organizing: "bg-amber-500/20 text-amber-500 border-amber-500/30",
      other: "bg-gray-500/20 text-gray-500 border-gray-500/30",
    };
    return type ? colors[type] || colors.other : colors.other;
  };

  const TypeIcon = getTypeIcon(contribution.type);

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all group">
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {contribution.image ? (
              <img
                src={contribution.image}
                alt={contribution.title}
                className="w-16 h-16 object-cover rounded-lg border border-gray-700"
              />
            ) : (
              <div className="w-16 h-16 bg-linear-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center border border-gray-600">
                <TypeIcon className="w-8 h-8 text-gray-600" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                {contribution.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                {contribution.role && (
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <UserCircle className="w-4 h-4" />
                    {contribution.role}
                  </span>
                )}
                {contribution.issuer && (
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {contribution.issuer}
                  </span>
                )}
                {contribution.event && (
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(contribution.event).toLocaleDateString()}
                  </span>
                )}
              </div>
              {contribution.type && (
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(contribution.type)}`}
                >
                  {contribution.type}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(contribution._id);
              }}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500 hover:text-red-400"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-700">
          <div className="ml-20">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">
                Contribution Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {contribution.role && (
                  <p className="text-gray-300 text-sm">
                    <span className="text-gray-500">Role:</span>{" "}
                    {contribution.role}
                  </p>
                )}
                {contribution.type && (
                  <p className="text-gray-300 text-sm">
                    <span className="text-gray-500">Type:</span>{" "}
                    {contribution.type}
                  </p>
                )}
                {contribution.issuer && (
                  <p className="text-gray-300 text-sm">
                    <span className="text-gray-500">Issuer:</span>{" "}
                    {contribution.issuer}
                  </p>
                )}
                {contribution.event && (
                  <p className="text-gray-300 text-sm">
                    <span className="text-gray-500">Event Date:</span>{" "}
                    {new Date(contribution.event).toLocaleDateString()}
                  </p>
                )}
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-500">ID:</span> {contribution._id}
                </p>
                {contribution.createdAt && (
                  <p className="text-gray-300 text-sm">
                    <span className="text-gray-500">Added:</span>{" "}
                    {new Date(contribution.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (cont) =>
          cont.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cont.issuer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cont.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cont.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cont.event?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply type filter
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
          // Show success alert
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
    types: types.length - 1,
    conferences: contributions.filter((c) => c.type === "conference").length,
    workshops: contributions.filter((c) => c.type === "workshop").length,
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

      {/* Add Contribution Modal */}
      <ContributionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddContribution}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>

          <div className="relative flex items-center gap-4">
            <div className="p-4 bg-linear-to-br from-blue-500 to-yellow-500 rounded-2xl shadow-lg shadow-blue-500/20">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-linear-to-r from-blue-400 via-blue-500 to-yellow-500 bg-clip-text text-transparent">
                  Contributions & Impact
                </span>
              </h1>
              <p className="text-gray-400 text-lg mt-2">
                Track your community involvement, talks, and volunteer work
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
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Contribution</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Heart className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
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
                  {stats.filtered}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Mic className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Conferences</p>
                <p className="text-2xl font-bold text-purple-400">
                  {stats.conferences}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-green-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Presentation className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Workshops</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.workshops}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-pink-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <ImageIcon className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">With Images</p>
                <p className="text-2xl font-bold text-pink-400">
                  {stats.withImages}
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
                <Heart className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        ) : filteredContributions.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700">
            <div className="w-24 h-24 bg-linear-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
              <Heart className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No contributions found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedType !== "all"
                ? "Try adjusting your filters"
                : "Add your first contribution to showcase your impact"}
            </p>
            {!searchTerm && selectedType === "all" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium inline-flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-5 h-5" />
                Add Contribution
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContributions.map((contribution) => {
              const TypeIcon = getTypeIcon(contribution.type);
              return (
                <div key={contribution._id} className="group">
                  <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/5 h-full flex flex-col">
                    <div className="aspect-video bg-linear-to-br from-gray-800 to-gray-900 relative">
                      {contribution.image ? (
                        <img
                          src={contribution.image}
                          alt={contribution.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <TypeIcon className="w-16 h-16 text-gray-700 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm">No image</p>
                          </div>
                        </div>
                      )}

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Type badge on image */}
                      {contribution.type && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-gray-900/90 text-white border border-gray-700 backdrop-blur-sm">
                          {contribution.type}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                        {contribution.title}
                      </h3>

                      <div className="space-y-2 mb-4 flex-1">
                        {contribution.role && (
                          <p className="text-sm text-gray-400 flex items-center gap-2">
                            <UserCircle className="w-4 h-4 shrink-0" />
                            <span className="truncate">
                              {contribution.role}
                            </span>
                          </p>
                        )}
                        {contribution.issuer && (
                          <p className="text-sm text-gray-400 flex items-center gap-2">
                            <Award className="w-4 h-4 shrink-0" />
                            <span className="truncate">
                              {contribution.issuer}
                            </span>
                          </p>
                        )}
                        {contribution.event && (
                          <p className="text-sm text-gray-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span className="truncate">
                              {new Date(
                                contribution.event,
                              ).toLocaleDateString()}
                            </span>
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          confirmDelete(contribution._id, contribution.title)
                        }
                        className="w-full mt-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredContributions.map((contribution) => (
              <ContributionCard
                key={contribution._id}
                contribution={contribution}
                onDelete={confirmDelete}
                isExpanded={expandedId === contribution._id}
                onToggle={() =>
                  setExpandedId(
                    expandedId === contribution._id ? null : contribution._id,
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function for type icons (duplicated for grid view)
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
