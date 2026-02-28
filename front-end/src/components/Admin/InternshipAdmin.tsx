import { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import {
  Search,
  Plus,
  Trash2,
  X,
  Upload,
  AlertTriangle,
  Grid,
  List,
  Briefcase,
  Calendar,
  Building,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Clock3,
  Wifi,
  Eye,
  Download,
  Edit,
} from "lucide-react";

export interface Internship {
  _id: string;
  company: string;
  role: string;
  duration: string;
  mode: string;
  status: string;
  image?: string;
  skills: string[];
  createdAt: string;
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
  internship 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  internship: Internship | null;
}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const downloadImage = async () => {
    if (!internship?.image) return;
    
    try {
      // Fetch the image
      const response = await fetch(internship.image);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${internship.company.replace(/\s+/g, '-').toLowerCase()}-${internship.role.replace(/\s+/g, '-').toLowerCase()}.${blob.type.split('/')[1] || 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      
      // Fallback: try to download via canvas
      if (imageRef.current) {
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
              link.download = `${internship.company.replace(/\s+/g, '-').toLowerCase()}-${internship.role.replace(/\s+/g, '-').toLowerCase()}.png`;
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

  if (!isOpen || !internship) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-2xl w-full max-w-3xl border border-gray-800 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-semibold text-white">{internship.role}</h3>
            <p className="text-sm text-gray-400">{internship.company}</p>
          </div>
          <div className="flex items-center gap-2">
            {internship.image && (
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

        <div className="p-6 flex items-center justify-center bg-gray-950/50">
          {internship.image ? (
            <img
              ref={imageRef}
              src={internship.image}
              alt={internship.company}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-64 h-64 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center border-2 border-gray-700">
              <div className="text-center">
                <Building className="w-20 h-20 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">No image available</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {internship.status && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                internship.status === "Active" ? "bg-green-500/20 text-green-400" :
                internship.status === "Completed" ? "bg-blue-500/20 text-blue-400" :
                internship.status === "Upcoming" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-orange-500/20 text-orange-400"
              }`}>
                {internship.status}
              </span>
            )}
            {internship.mode && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                internship.mode === "Remote" ? "bg-purple-500/20 text-purple-400" :
                internship.mode === "On-site" ? "bg-blue-500/20 text-blue-400" :
                "bg-cyan-500/20 text-cyan-400"
              }`}>
                {internship.mode}
              </span>
            )}
          </div>
          {internship.duration && (
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {internship.duration}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal Component
const InternshipModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'add'
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, id?: string) => Promise<void>;
  initialData?: Internship | null;
  mode?: 'add' | 'edit';
}) => {
  const [form, setForm] = useState({
    company: initialData?.company || "",
    role: initialData?.role || "",
    duration: initialData?.duration || "",
    mode: initialData?.mode || "",
    status: initialData?.status || "",
  });
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialData?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        company: initialData.company || "",
        role: initialData.role || "",
        duration: initialData.duration || "",
        mode: initialData.mode || "",
        status: initialData.status || "",
      });
      setSkills(initialData.skills || []);
      setPreview(initialData.image || "");
    } else {
      setForm({ company: "", role: "", duration: "", mode: "", status: "" });
      setSkills([]);
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

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("company", form.company);
    formData.append("role", form.role);
    formData.append("duration", form.duration);
    formData.append("mode", form.mode);
    formData.append("status", form.status);
    formData.append("skills", JSON.stringify(skills));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    await onSubmit(formData, initialData?._id);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  const modeOptions = ["Remote", "On-site", "Hybrid"];
  const statusOptions = ["Active", "Completed", "Upcoming", "On Hold"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-900 rounded-2xl w-full max-w-3xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            {mode === 'add' ? 'Add New Internship' : 'Edit Internship'}
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
                  Company/Organization *
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., Google, Microsoft, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Role/Position *
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., Software Engineering Intern"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., 3 months, Jan - Mar 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {modeOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setForm({ ...form, mode: option })}
                      className={`px-3 py-2 rounded-lg border transition-all ${
                        form.mode === option
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setForm({ ...form, status: option })}
                      className={`px-3 py-2 rounded-lg border transition-all ${
                        form.status === option
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Skills (Press Enter to add)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="e.g., React, Node.js, Python"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors border border-blue-500/30"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Skills Tags */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-1 border border-blue-500/30"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Company Logo/Image
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
              {isSubmitting ? "Saving..." : mode === 'add' ? "Add Internship" : "Update Internship"}
              {!isSubmitting && (mode === 'add' ? <Plus className="w-5 h-5" /> : <Edit className="w-5 h-5" />)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { color: string; bgColor: string; icon: any }
    > = {
      Active: {
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        icon: CheckCircle,
      },
      Completed: {
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
        icon: CheckCircle,
      },
      Upcoming: {
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        icon: Clock3,
      },
      "On Hold": {
        color: "text-orange-400",
        bgColor: "bg-orange-500/20",
        icon: XCircle,
      },
    };
    return (
      configs[status] || {
        color: "text-gray-400",
        bgColor: "bg-gray-500/20",
        icon: Clock,
      }
    );
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

// Mode Badge Component
const ModeBadge = ({ mode }: { mode: string }) => {
  const getModeConfig = (mode: string) => {
    const configs: Record<
      string,
      { color: string; bgColor: string; icon: any }
    > = {
      Remote: {
        color: "text-purple-400",
        bgColor: "bg-purple-500/20",
        icon: Wifi,
      },
      "On-site": {
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
        icon: Building,
      },
      Hybrid: {
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/20",
        icon: MapPin,
      },
    };
    return (
      configs[mode] || {
        color: "text-gray-400",
        bgColor: "bg-gray-500/20",
        icon: MapPin,
      }
    );
  };

  const config = getModeConfig(mode);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      {mode}
    </span>
  );
};

// Internship Card Component
const InternshipCard = ({
  internship,
  onDelete,
  onEdit,
  onViewImage,
}: {
  internship: Internship;
  onDelete: (id: string, title: string) => void;
  onEdit: (internship: Internship) => void;
  onViewImage: (internship: Internship) => void;
}) => {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all group">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onViewImage(internship)}
            className="relative shrink-0"
          >
            {internship.image ? (
              <img
                src={internship.image}
                alt={internship.company}
                className="w-16 h-16 object-cover rounded-lg border border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="w-16 h-16 bg-linear-to-br from-blue-500/10 to-yellow-500/10 rounded-lg flex items-center justify-center border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors">
                <Briefcase className="w-8 h-8 text-gray-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
          </button>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {internship.role}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
              <Building className="w-4 h-4" />
              <span>{internship.company}</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              {internship.status && (
                <StatusBadge status={internship.status} />
              )}
              {internship.mode && <ModeBadge mode={internship.mode} />}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewImage(internship)}
              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-500 hover:text-blue-400"
              title="View Image"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit(internship)}
              className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors text-yellow-500 hover:text-yellow-400"
              title="Edit Internship"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(internship._id, internship.role)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500 hover:text-red-400"
              title="Delete Internship"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function InternshipAdmin() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImageViewModalOpen, setIsImageViewModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
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

  // Fetch internships
  const fetchInternships = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/internships");
      setInternships(data);
      setFilteredInternships(data);
    } catch (error) {
      console.error("Error fetching internships:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = internships;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (internship) =>
          internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.skills?.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (internship) => internship.status === statusFilter,
      );
    }

    // Apply mode filter
    if (modeFilter !== "all") {
      filtered = filtered.filter(
        (internship) => internship.mode === modeFilter,
      );
    }

    setFilteredInternships(filtered);
  }, [searchTerm, statusFilter, modeFilter, internships]);

  // Handle add internship
  const handleAddInternship = async (formData: FormData) => {
    try {
      await API.post("/internships", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchInternships();
    } catch (error) {
      console.error("Error adding internship:", error);
    }
  };

  // Handle edit internship
  const handleEditInternship = async (formData: FormData, id?: string) => {
    if (!id) return;
    try {
      await API.put(`/internships/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchInternships();
    } catch (error) {
      console.error("Error updating internship:", error);
    }
  };

  // Handle delete with confirmation
  const confirmDelete = (id: string, role: string) => {
    setAlertConfig({
      isOpen: true,
      title: "Delete Internship",
      message: `Are you sure you want to delete the "${role}" internship? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await API.delete(`/internships/${id}`);
          await fetchInternships();
          setAlertConfig({
            isOpen: true,
            title: "Internship Deleted",
            message: `Internship has been successfully deleted.`,
            onConfirm: () =>
              setAlertConfig((prev) => ({ ...prev, isOpen: false })),
          });
        } catch (error) {
          console.error("Error deleting internship:", error);
        }
      },
    });
  };

  // Handle edit click
  const handleEditClick = (internship: Internship) => {
    setSelectedInternship(internship);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  // Handle view image
  const handleViewImage = (internship: Internship) => {
    setSelectedInternship(internship);
    setIsImageViewModalOpen(true);
  };

  // Get unique statuses and modes for filters
  const uniqueStatuses = [
    "all",
    ...new Set(internships.map((i) => i.status).filter(Boolean)),
  ];
  const uniqueModes = [
    "all",
    ...new Set(internships.map((i) => i.mode).filter(Boolean)),
  ];

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

      {/* Internship Form Modal */}
      <InternshipModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedInternship(null);
        }}
        onSubmit={formMode === 'add' ? handleAddInternship : handleEditInternship}
        initialData={selectedInternship}
        mode={formMode}
      />

      {/* Image View Modal */}
      <ImageViewModal
        isOpen={isImageViewModalOpen}
        onClose={() => {
          setIsImageViewModalOpen(false);
          setSelectedInternship(null);
        }}
        internship={selectedInternship}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>

          <div className="relative flex items-center gap-4">
            <div className="p-4 bg-linear-to-br from-blue-500 to-yellow-500 rounded-2xl shadow-lg shadow-blue-500/20">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-linear-to-r from-blue-400 via-blue-500 to-yellow-500 bg-clip-text text-transparent">
                  Internships & Experience
                </span>
              </h1>
              <p className="text-gray-400 text-lg mt-2">
                Manage your professional internships and work experience
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
                placeholder="Search by company, role, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Status Filter */}
              <div className="relative flex-1 lg:flex-none min-w-35">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
                >
                  {uniqueStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "All Status" : status}
                    </option>
                  ))}
                </select>
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>

              {/* Mode Filter */}
              <div className="relative flex-1 lg:flex-none min-w-35">
                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
                >
                  {uniqueModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode === "all" ? "All Modes" : mode}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
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
                  setSelectedInternship(null);
                  setIsFormModalOpen(true);
                }}
                className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Internship</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Internships</p>
                <p className="text-2xl font-bold text-white">
                  {internships.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-green-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-2xl font-bold text-green-400">
                  {internships.filter((i) => i.status === "Active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Wifi className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Remote</p>
                <p className="text-2xl font-bold text-purple-400">
                  {internships.filter((i) => i.mode === "Remote").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-yellow-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Unique Skills</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {new Set(internships.flatMap((i) => i.skills || [])).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Internships List/Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-gray-700 border-b-yellow-500 rounded-full animate-spin absolute top-0 left-0 opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700">
            <div className="w-24 h-24 bg-linear-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
              <Briefcase className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No internships found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== "all" || modeFilter !== "all"
                ? "Try adjusting your filters"
                : "Add your first internship to showcase your experience"}
            </p>
            {!searchTerm && statusFilter === "all" && modeFilter === "all" && (
              <button
                onClick={() => {
                  setFormMode('add');
                  setSelectedInternship(null);
                  setIsFormModalOpen(true);
                }}
                className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium inline-flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-5 h-5" />
                Add Internship
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <div key={internship._id} className="group">
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/5 h-full flex flex-col">
                  <div 
                    className="aspect-video bg-linear-to-br from-gray-800 to-gray-900 relative cursor-pointer"
                    onClick={() => handleViewImage(internship)}
                  >
                    {internship.image ? (
                      <img
                        src={internship.image}
                        alt={internship.company}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Building className="w-16 h-16 text-gray-700 mx-auto mb-2" />
                          <p className="text-gray-600 text-sm">
                            {internship.company}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                      {internship.role}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Building className="w-4 h-4 shrink-0" />
                        <span className="truncate">{internship.company}</span>
                      </div>

                      {internship.duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span>{internship.duration}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {internship.status && (
                        <StatusBadge status={internship.status} />
                      )}
                      {internship.mode && <ModeBadge mode={internship.mode} />}
                    </div>

                    {internship.skills && internship.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {internship.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {internship.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                            +{internship.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleViewImage(internship)}
                        className="flex-1 px-3 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(internship)}
                        className="flex-1 px-3 py-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(internship._id, internship.role)}
                        className="flex-1 px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInternships.map((internship) => (
              <InternshipCard
                key={internship._id}
                internship={internship}
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