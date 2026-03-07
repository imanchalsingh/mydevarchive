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
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg w-full max-w-md p-6 border border-gray-200 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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
      const response = await fetch(certificate.image);
      const blob = await response.blob();
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
    }
  };

  if (!isOpen || !certificate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-3xl border border-gray-200 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{certificate.title}</h3>
            {certificate.issuer && (
              <p className="text-sm text-gray-600">{certificate.issuer}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {certificate.image && (
              <button
                onClick={downloadImage}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Download Image"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 flex items-center justify-center">
          {certificate.image ? (
            <img
              ref={imageRef}
              src={certificate.image}
              alt={certificate.title}
              className="max-w-full max-h-[70vh] object-contain rounded"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-64 h-64 bg-gray-100 rounded flex items-center justify-center border-2 border-gray-200">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No image available</p>
              </div>
            </div>
          )}
        </div>

        {certificate.category && (
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-600">Category:</span>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
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
  categories = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, id?: string) => Promise<void>;
  initialData?: Certificate | null;
  mode?: 'add' | 'edit';
  categories?: string[];
}) => {
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
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
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg w-full max-w-2xl border border-gray-200 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'add' ? 'Add New Certificate' : 'Edit Certificate'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., AWS Certified Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., Amazon Web Services"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.filter(c => c !== 'all').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificate Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-500 transition-colors">
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
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700"
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
                    />
                    <div className="py-4">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload
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

          <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? "Saving..." : mode === 'add' ? "Add Certificate" : "Update Certificate"}
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
      frontend: "bg-blue-100 text-blue-700",
      backend: "bg-yellow-100 text-yellow-700",
      devops: "bg-purple-100 text-purple-700",
      cloud: "bg-sky-100 text-sky-700",
      database: "bg-green-100 text-green-700",
      other: "bg-gray-100 text-gray-700",
    };
    return category ? colors[category] || colors.other : colors.other;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-500 transition-colors">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onViewImage(cert)}
            className="relative shrink-0"
          >
            {cert.image ? (
              <img
                src={cert.image}
                alt={cert.title}
                className="w-16 h-16 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </button>

          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900">
              {cert.title}
            </h3>
            <p className="text-sm text-gray-600">{cert.issuer || "No issuer specified"}</p>
            {cert.category && (
              <span
                className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(cert.category)}`}
              >
                {cert.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewImage(cert)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="View Image"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(cert)}
              className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
              title="Edit Certificate"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(cert._id, cert.title);
              }}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Certificate"
            >
              <Trash2 className="w-4 h-4" />
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
    onConfirm: () => { },
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

    if (searchTerm) {
      filtered = filtered.filter(
        (cert) =>
          cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.issuer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

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
    ...new Set(certificates.map((cert) => cert.category).filter((cat): cat is string => Boolean(cat))),
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
        categories={categories}
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-600 mt-1">
            Manage your professional certifications
          </p>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              {/* Category Filter */}
              <div className="relative flex-1 lg:flex-none">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={() => {
                  setFormMode('add');
                  setSelectedCertificate(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Certificate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-xl font-semibold text-gray-900">
              {certificates.length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Filtered</p>
            <p className="text-xl font-semibold text-blue-600">
              {filteredCertificates.length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-xl font-semibold text-yellow-600">
              {categories.length - 1}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">With Images</p>
            <p className="text-xl font-semibold text-green-600">
              {certificates.filter((c) => c.image).length}
            </p>
          </div>
        </div>

        {/* Certificates List/Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Loading certificates...</span>
            </div>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Folder className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
              No certificates found
            </h3>
            <p className="text-sm text-gray-600 mb-4">
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Certificate
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCertificates.map((cert) => (
              <div
                key={cert._id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-500 transition-colors"
              >
                <div
                  className="aspect-video bg-gray-100 relative cursor-pointer"
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
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{cert.issuer || "No issuer specified"}</p>
                  {cert.category && (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded mb-3">
                      {cert.category}
                    </span>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditClick(cert)}
                      className="flex-1 px-3 py-1.5 bg-yellow-50 text-yellow-700 text-sm rounded hover:bg-yellow-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(cert._id, cert.title)}
                      className="flex-1 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
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