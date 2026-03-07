import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  Search,
  Plus,
  Trash2,
  X,
  Filter,
  Image as ImageIcon,
  Upload,
  Award,
  Eye,
  Download,
  Edit,
  Grid,
  List,
} from "lucide-react";

export interface Badge {
  _id: string;
  title: string;
  issuer?: string;
  image?: string;
  category?: string;
  createdAt?: string;
}

// Delete Confirmation Modal
const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Badge</h3>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete "{title}"? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
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
  badge
}: {
  isOpen: boolean;
  onClose: () => void;
  badge: Badge | null;
}) => {
  const downloadImage = async () => {
    if (!badge?.image) return;

    try {
      const response = await fetch(badge.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${badge.title.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (!isOpen || !badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-3xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{badge.title}</h3>
            {badge.issuer && (
              <p className="text-sm text-gray-600">{badge.issuer}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {badge.image && (
              <button
                onClick={downloadImage}
                className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
                title="Download Image"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 flex items-center justify-center bg-gray-50">
          {badge.image ? (
            <img
              src={badge.image}
              alt={badge.title}
              className="max-w-full max-h-[70vh] object-contain"
            />
          ) : (
            <div className="w-64 h-64 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-center">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No image available</p>
              </div>
            </div>
          )}
        </div>

        {badge.category && (
          <div className="p-4 border-t flex justify-between items-center">
            <span className="text-sm text-gray-600">Category:</span>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
              {badge.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Badge Form Modal
const BadgeModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'add',
  categories = []
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, id?: string) => Promise<void>;
  initialData?: Badge | null;
  mode?: 'add' | 'edit';
  categories?: string[];
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

    try {
      await onSubmit(formData, initialData?._id);
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'add' ? 'Add New Badge' : 'Edit Badge'}
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="AWS Certified Developer"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Amazon Web Services"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {/* Map categories dynamically */}
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge Image
              </label>
              <div className="border border-gray-300 rounded-lg p-4">
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
                      className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full text-xs"
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
                    <div className="py-4 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
            >
              {isSubmitting ? "Saving..." : mode === 'add' ? "Add Badge" : "Update Badge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Badge Card Component (List View)
const BadgeCard = ({
  badge,
  onDelete,
  onEdit,
  onViewImage,
}: {
  badge: Badge;
  onDelete: (id: string, title: string) => void;
  onEdit: (badge: Badge) => void;
  onViewImage: (badge: Badge) => void;
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onViewImage(badge)}
          className="shrink-0"
        >
          {badge.image ? (
            <img
              src={badge.image}
              alt={badge.title}
              className="w-12 h-12 object-cover rounded border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
              <Award className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {badge.title}
          </h3>
          <p className="text-xs text-gray-500 truncate">{badge.issuer || "No issuer"}</p>
          {badge.category && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
              {badge.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewImage(badge)}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
            title="View Image"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(badge)}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
            title="Edit Badge"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(badge._id, badge.title)}
            className="p-1.5 hover:bg-red-50 rounded text-gray-500 hover:text-red-600"
            title="Delete Badge"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function BadgeAdmin() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [filteredBadges, setFilteredBadges] = useState<Badge[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImageViewModalOpen, setIsImageViewModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
  }>({
    isOpen: false,
    id: "",
    title: "",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [loading, setLoading] = useState(true);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/badges");
      setBadges(data);
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  useEffect(() => {
    let filtered = badges;

    if (searchTerm) {
      filtered = filtered.filter(
        (badge) =>
          badge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          badge.issuer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          badge.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((badge) => badge.category === selectedCategory);
    }

    setFilteredBadges(filtered);
  }, [searchTerm, selectedCategory, badges]);

  const handleAddBadge = async (formData: FormData) => {
    try {
      await API.post("/badges", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchBadges();
    } catch (error) {
      console.error("Error adding badge:", error);
    }
  };

  const handleEditBadge = async (formData: FormData, id?: string) => {
    if (!id) return;
    try {
      await API.put(`/badges/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchBadges();
    } catch (error) {
      console.error("Error updating badge:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/badges/${deleteModal.id}`);
      await fetchBadges();
    } catch (error) {
      console.error("Error deleting badge:", error);
    }
  };

  const handleEditClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleViewImage = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsImageViewModalOpen(true);
  };

  const categories = ["all", ...new Set(badges.map((b) => b.category).filter(Boolean) as string[])];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: "", title: "" })}
        onConfirm={handleDelete}
        title={deleteModal.title}
      />

      {/* Form Modal */}
      <BadgeModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedBadge(null);
        }}
        onSubmit={formMode === 'add' ? handleAddBadge : handleEditBadge}
        initialData={selectedBadge}
        mode={formMode}
        categories={categories}
      />

      {/* Image View Modal */}
      <ImageViewModal
        isOpen={isImageViewModalOpen}
        onClose={() => {
          setIsImageViewModalOpen(false);
          setSelectedBadge(null);
        }}
        badge={selectedBadge}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Badges</h1>
          <p className="text-gray-600 text-sm mt-1">Manage your badges and certifications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded">
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Badges</p>
                <p className="text-xl font-semibold text-gray-900">{badges.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded">
                <Filter className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Filtered</p>
                <p className="text-xl font-semibold text-gray-900">{filteredBadges.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded">
                <Filter className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Categories</p>
                <p className="text-xl font-semibold text-gray-900">{categories.length - 1}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded">
                <ImageIcon className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">With Images</p>
                <p className="text-xl font-semibold text-green-600">
                  {badges.filter(b => b.image).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search badges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              <div className="flex border border-gray-300 rounded overflow-hidden">
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

              <button
                onClick={() => {
                  setFormMode('add');
                  setSelectedBadge(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Badge</span>
              </button>
            </div>
          </div>
        </div>

        {/* Badge List/Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredBadges.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-900 font-medium mb-1">No badges found</h3>
            <p className="text-gray-600 text-sm mb-4">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your filters"
                : "Get started by adding your first badge"}
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <button
                onClick={() => {
                  setFormMode('add');
                  setSelectedBadge(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm inline-flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Badge
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBadges.map((badge) => (
              <div key={badge._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300">
                <div
                  className="aspect-square bg-gray-100 relative cursor-pointer"
                  onClick={() => handleViewImage(badge)}
                >
                  {badge.image ? (
                    <img
                      src={badge.image}
                      alt={badge.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mb-2">{badge.issuer || "No issuer"}</p>

                  <div className="flex items-center justify-between">
                    {badge.category && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                        {badge.category}
                      </span>
                    )}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleViewImage(badge)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(badge)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, id: badge._id, title: badge.title })}
                        className="p-1 hover:bg-red-50 rounded text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredBadges.map((badge) => (
              <BadgeCard
                key={badge._id}
                badge={badge}
                onDelete={(id, title) => setDeleteModal({ isOpen: true, id, title })}
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