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
  Folder,
  LetterText,
  Eye,
  Download,
  Edit,
} from "lucide-react";

export interface Certificate {
  _id: string;
  title: string;
  issuer?: string;
  image?: string;
  category?: string;
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
  certificate,
}: {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const downloadImage = async () => {
    if (!certificate?.image) return;
    
    try {
      // Fetch the image
      const response = await fetch(certificate.image);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificate.title.replace(/\s+/g, '-').toLowerCase()}-certificate.${blob.type.split('/')[1] || 'png'}`;
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
              link.download = `${certificate.title.replace(/\s+/g, '-').toLowerCase()}-certificate.png`;
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

  if (!isOpen || !certificate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-2xl w-full max-w-3xl border border-gray-800 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-semibold text-white">{certificate.title}</h3>
            {certificate.issuer && (
              <p className="text-sm text-gray-400">{certificate.issuer}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {certificate.image && (
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
          {certificate.image ? (
            <img
              ref={imageRef}
              src={certificate.image}
              alt={certificate.title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-64 h-64 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center border-2 border-gray-700">
              <div className="text-center">
                <ImageIcon className="w-20 h-20 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">No image available</p>
              </div>
            </div>
          )}
        </div>

        {certificate.category && (
          <div className="p-4 border-t border-gray-800 flex justify-between items-center">
            <span className="text-sm text-gray-400">Category:</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500 border border-blue-500/30">
              {certificate.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Certificate Form Modal (Add/Edit)
const CertificateFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'add',
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, id?: string) => Promise<void>;
  initialData?: Certificate | null;
  mode?: 'add' | 'edit';
}) => {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    issuer: initialData?.issuer || "",
    category: initialData?.category || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialData?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        issuer: initialData.issuer || "",
        category: initialData.category || "",
      });
      setPreview(initialData.image || "");
    } else {
      setForm({ title: "", issuer: "", category: "" });
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
    formData.append("category", form.category);
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
      <div className="relative bg-gray-900 rounded-2xl w-full max-w-2xl border border-gray-800 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            {mode === 'add' ? 'Add New Certificate' : 'Edit Certificate'}
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
                  Certificate Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., AWS Certified Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., Amazon Web Services"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Select category</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="devops">DevOps</option>
                  <option value="cloud">Cloud</option>
                  <option value="database">Database</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Certificate Image
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
              {isSubmitting ? "Saving..." : mode === 'add' ? "Add Certificate" : "Update Certificate"}
              {!isSubmitting && (mode === 'add' ? <Plus className="w-5 h-5" /> : <Edit className="w-5 h-5" />)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Certificate Card Component (List View)
const CertificateCard = ({
  cert,
  onDelete,
  onEdit,
  onViewImage,
}: {
  cert: Certificate;
  onDelete: (id: string, title: string) => void;
  onEdit: (cert: Certificate) => void;
  onViewImage: (cert: Certificate) => void;
}) => {
  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      frontend: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      backend: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      devops: "bg-purple-500/20 text-purple-500 border-purple-500/30",
      cloud: "bg-sky-500/20 text-sky-500 border-sky-500/30",
      database: "bg-green-500/20 text-green-500 border-green-500/30",
      other: "bg-gray-500/20 text-gray-500 border-gray-500/30",
    };
    return category ? colors[category] || colors.other : colors.other;
  };

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all group">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onViewImage(cert)}
            className="relative flex-shrink-0"
          >
            {cert.image ? (
              <img
                src={cert.image}
                alt={cert.title}
                className="w-16 h-16 object-cover rounded-lg border border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors">
                <ImageIcon className="w-8 h-8 text-gray-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
          </button>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {cert.title}
            </h3>
            <p className="text-gray-400 text-sm">{cert.issuer || "No issuer specified"}</p>
            {cert.category && (
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(cert.category)}`}
              >
                {cert.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewImage(cert)}
              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-500 hover:text-blue-400"
              title="View Image"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit(cert)}
              className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors text-yellow-500 hover:text-yellow-400"
              title="Edit Certificate"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(cert._id, cert.title);
              }}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500 hover:text-red-400"
              title="Delete Certificate"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CertificatesAdmin() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImageViewModalOpen, setIsImageViewModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
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

  // Fetch certificates
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/certificates");
      setCertificates(data);
      setFilteredCertificates(data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = certificates;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (cert) =>
          cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.issuer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((cert) => cert.category === selectedCategory);
    }

    setFilteredCertificates(filtered);
  }, [searchTerm, selectedCategory, certificates]);

  // Handle add certificate
  const handleAddCertificate = async (formData: FormData) => {
    try {
      await API.post("/certificates", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchCertificates();
    } catch (error) {
      console.error("Error adding certificate:", error);
    }
  };

  // Handle edit certificate
  const handleEditCertificate = async (formData: FormData, id?: string) => {
    if (!id) return;
    try {
      await API.put(`/certificates/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchCertificates();
    } catch (error) {
      console.error("Error updating certificate:", error);
    }
  };

  // Handle delete with confirmation
  const confirmDelete = (id: string, title: string) => {
    setAlertConfig({
      isOpen: true,
      title: "Delete Certificate",
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await API.delete(`/certificates/${id}`);
          await fetchCertificates();
          // Show success alert
          setAlertConfig({
            isOpen: true,
            title: "Certificate Deleted",
            message: `"${title}" has been successfully deleted.`,
            onConfirm: () =>
              setAlertConfig((prev) => ({ ...prev, isOpen: false })),
          });
        } catch (error) {
          console.error("Error deleting certificate:", error);
        }
      },
    });
  };

  // Handle edit click
  const handleEditClick = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  // Handle view image
  const handleViewImage = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setIsImageViewModalOpen(true);
  };

  // Get unique categories
  const categories = [
    "all",
    ...new Set(certificates.map((cert) => cert.category).filter(Boolean)),
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

      {/* Certificate Form Modal */}
      <CertificateFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedCertificate(null);
        }}
        onSubmit={formMode === 'add' ? handleAddCertificate : handleEditCertificate}
        initialData={selectedCertificate}
        mode={formMode}
      />

      {/* Image View Modal */}
      <ImageViewModal
        isOpen={isImageViewModalOpen}
        onClose={() => {
          setIsImageViewModalOpen(false);
          setSelectedCertificate(null);
        }}
        certificate={selectedCertificate}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="relative flex items-center gap-4 mb-8">
          <div className="p-4 bg-linear-to-br from-blue-500 to-yellow-500 rounded-2xl shadow-lg shadow-blue-500/20">
            <LetterText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-linear-to-r from-blue-400 via-blue-500 to-yellow-500 bg-clip-text text-transparent">
                Certificates
              </span>
            </h1>
            <p className="text-gray-400 text-lg mt-2">
              Manage your professional courses completion certifications
            </p>
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
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Category Filter */}
              <div className="relative flex-1 lg:flex-none">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full lg:w-48 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
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
                  setSelectedCertificate(null);
                  setIsFormModalOpen(true);
                }}
                className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Certificate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-2xl font-bold text-white">
              {certificates.length}
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Filtered</p>
            <p className="text-2xl font-bold text-blue-400">
              {filteredCertificates.length}
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Categories</p>
            <p className="text-2xl font-bold text-yellow-400">
              {categories.length - 1}
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">With Images</p>
            <p className="text-2xl font-bold text-green-400">
              {certificates.filter((c) => c.image).length}
            </p>
          </div>
        </div>

        {/* Certificates List/Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-gray-700 border-b-yellow-500 rounded-full animate-spin absolute top-0 left-0 opacity-50"></div>
            </div>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700">
            <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Folder className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No certificates found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your filters"
                : "Add your first certificate to get started"}
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <button
                onClick={() => {
                  setFormMode('add');
                  setSelectedCertificate(null);
                  setIsFormModalOpen(true);
                }}
                className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Certificate
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCertificates.map((cert) => (
              <div
                key={cert._id}
                className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all group"
              >
                <div 
                  className="aspect-video bg-gray-700 relative cursor-pointer"
                  onClick={() => handleViewImage(cert)}
                >
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{cert.issuer || "No issuer specified"}</p>
                  {cert.category && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500 border border-blue-500/30 mb-3">
                      {cert.category}
                    </span>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditClick(cert)}
                      className="flex-1 px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(cert._id, cert.title)}
                      className="flex-1 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCertificates.map((cert) => (
              <CertificateCard
                key={cert._id}
                cert={cert}
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