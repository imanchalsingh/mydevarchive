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
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg w-full max-w-md p-6 border border-gray-200 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-yellow-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
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
      const response = await fetch(internship.image);
      const blob = await response.blob();
      
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
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-3xl border border-gray-200 shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{internship.role}</h3>
            <p className="text-sm text-gray-600">{internship.company}</p>
          </div>
          <div className="flex items-center gap-2">
            {internship.image && (
              <button
                onClick={downloadImage}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                title="Download Image"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 flex items-center justify-center bg-gray-50">
          {internship.image ? (
            <img
              ref={imageRef}
              src={internship.image}
              alt={internship.company}
              className="max-w-full max-h-[70vh] object-contain rounded"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-64 h-64 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <Building className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No image available</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {internship.status && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                internship.status === "Active" ? "bg-green-100 text-green-700" :
                internship.status === "Completed" ? "bg-blue-100 text-blue-700" :
                internship.status === "Upcoming" ? "bg-yellow-100 text-yellow-700" :
                "bg-orange-100 text-orange-700"
              }`}>
                {internship.status}
              </span>
            )}
            {internship.mode && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                internship.mode === "Remote" ? "bg-purple-100 text-purple-700" :
                internship.mode === "On-site" ? "bg-blue-100 text-blue-700" :
                "bg-cyan-100 text-cyan-700"
              }`}>
                {internship.mode}
              </span>
            )}
          </div>
          {internship.duration && (
            <span className="text-sm text-gray-600 flex items-center gap-1">
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
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg w-full max-w-3xl border border-gray-200 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Add New Internship' : 'Edit Internship'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company/Organization *
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Google, Microsoft, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role/Position *
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Software Engineering Intern"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3 months, Jan - Mar 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {modeOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setForm({ ...form, mode: option })}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        form.mode === option
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setForm({ ...form, status: option })}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        form.status === option
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (Press Enter to add)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., React, Node.js, Python"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
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
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo/Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded object-cover"
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
                      <div className="py-4">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">
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
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? "Saving..." : mode === 'add' ? "Add Internship" : "Update Internship"}
              {!isSubmitting && (mode === 'add' ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />)}
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
    const configs: Record<string, { className: string; icon: any }> = {
      Active: { className: "bg-green-100 text-green-700", icon: CheckCircle },
      Completed: { className: "bg-blue-100 text-blue-700", icon: CheckCircle },
      Upcoming: { className: "bg-yellow-100 text-yellow-700", icon: Clock3 },
      "On Hold": { className: "bg-orange-100 text-orange-700", icon: XCircle },
    };
    const config = configs[status] || { className: "bg-gray-100 text-gray-700", icon: Clock };
    const Icon = config.icon;

    return { ...config, Icon };
  };

  const { className, Icon } = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

// Mode Badge Component
const ModeBadge = ({ mode }: { mode: string }) => {
  const getModeConfig = (mode: string) => {
    const configs: Record<string, { className: string; icon: any }> = {
      Remote: { className: "bg-purple-100 text-purple-700", icon: Wifi },
      "On-site": { className: "bg-blue-100 text-blue-700", icon: Building },
      Hybrid: { className: "bg-cyan-100 text-cyan-700", icon: MapPin },
    };
    const config = configs[mode] || { className: "bg-gray-100 text-gray-700", icon: MapPin };
    const Icon = config.icon;

    return { ...config, Icon };
  };

  const { className, Icon } = getModeConfig(mode);

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-500 transition-all">
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
                className="w-16 h-16 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </button>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {internship.role}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Building className="w-4 h-4" />
              <span>{internship.company}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {internship.status && <StatusBadge status={internship.status} />}
              {internship.mode && <ModeBadge mode={internship.mode} />}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewImage(internship)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-blue-600"
              title="View Image"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(internship)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-yellow-600"
              title="Edit Internship"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(internship._id, internship.role)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-red-600"
              title="Delete Internship"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function InternshipAdmin() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
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

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (internship) => internship.status === statusFilter,
      );
    }

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
      message: `Are you sure you want to delete "${role}"?`,
      onConfirm: async () => {
        try {
          await API.delete(`/internships/${id}`);
          await fetchInternships();
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
    <div className="min-h-screen bg-gray-50">
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
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Internships & Experience
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your professional internships and work experience
              </p>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company, role, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "all" ? "All Status" : status}
                  </option>
                ))}
              </select>

              {/* Mode Filter */}
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {uniqueModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === "all" ? "All Modes" : mode}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Internship</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Internships</p>
                <p className="text-2xl font-bold text-gray-900">{internships.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {internships.filter((i) => i.status === "Active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded">
                <Wifi className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Remote</p>
                <p className="text-2xl font-bold text-gray-900">
                  {internships.filter((i) => i.mode === "Remote").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Unique Skills</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(internships.flatMap((i) => i.skills || [])).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Internships List/Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading internships...</span>
            </div>
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No internships found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all" || modeFilter !== "all"
                ? "Try adjusting your filters"
                : "Add your first internship"}
            </p>
            {!searchTerm && statusFilter === "all" && modeFilter === "all" && (
              <button
                onClick={() => {
                  setFormMode('add');
                  setSelectedInternship(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Internship
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <div key={internship._id} className="group">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-500 transition-all h-full flex flex-col">
                  <div 
                    className="aspect-video bg-gray-100 relative cursor-pointer"
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
                          <Building className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">
                            {internship.company}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                      {internship.role}
                    </h3>

                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
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
                      {internship.status && <StatusBadge status={internship.status} />}
                      {internship.mode && <ModeBadge mode={internship.mode} />}
                    </div>

                    {internship.skills && internship.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {internship.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {internship.skills.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            +{internship.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleViewImage(internship)}
                        className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(internship)}
                        className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(internship._id, internship.role)}
                        className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                      >
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