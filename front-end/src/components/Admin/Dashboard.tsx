import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  RefreshCw,
  FileText,
  LogOut,
  Eye,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

// Simple Types
interface ArchiveItem {
  _id: string;
  title: string;
  type: "badge" | "certificate" | "internship" | "contribution";
  issuer?: string;
  event?: string;
  role?: string;
  category?: string;
  duration?: string;
  mode?: string;
  status?: string;
  skills?: string[];
  image?: string;
  createdAt?: string;
}

// Simple Form Data
interface FormData {
  title: string;
  type: "badge" | "certificate" | "internship" | "contribution";
  issuer: string;
  event: string;
  role: string;
  category: string;
  duration: string;
  mode: string;
  status: string;
  skills: string;
  image: string;
}

const initialForm: FormData = {
  title: "",
  type: "badge",
  issuer: "",
  event: "",
  role: "",
  category: "",
  duration: "",
  mode: "",
  status: "",
  skills: "",
  image: "",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await API.get("/archive");
      setItems(res.data);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle input change
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      setMessage("Title is required");
      return;
    }

    try {
      const submitData: any = { ...formData };
      if (formData.skills) {
        submitData.skills = formData.skills.split(",").map(s => s.trim());
      }

      if (editingId) {
        await API.put(`/archive/${editingId}`, submitData);
        setMessage("Item updated!");
      } else {
        await API.post("/archive", submitData);
        setMessage("Item created!");
      }

      setFormData(initialForm);
      setEditingId(null);
      setShowForm(false);
      fetchItems();
    } catch (error) {
      setMessage("Error saving item");
    }
  };

  // Handle edit
  const handleEdit = (item: ArchiveItem) => {
    setFormData({
      title: item.title,
      type: item.type,
      issuer: item.issuer || "",
      event: item.event || "",
      role: item.role || "",
      category: item.category || "",
      duration: item.duration || "",
      mode: item.mode || "",
      status: item.status || "",
      skills: item.skills?.join(", ") || "",
      image: item.image || "",
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await API.delete(`/archive/${id}`);
      setMessage("Item deleted!");
      fetchItems();
    } catch (error) {
      setMessage("Error deleting item");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.issuer?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Get type badge
  const getTypeBadge = (type: string) => {
    const colors = {
      badge: "bg-yellow-600 text-white",
      certificate: "bg-purple-600 text-white",
      internship: "bg-green-600 text-white",
      contribution: "bg-pink-600 text-white",
    };
    return colors[type as keyof typeof colors] || "bg-gray-600 text-white";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Archive Admin</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="p-6">
        {/* Message */}
        {message && (
          <div className="mb-4 p-3 bg-blue-600 rounded flex justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage("")}>✕</button>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => {
              setFormData(initialForm);
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> {showForm ? "Hide Form" : "Add New"}
          </button>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded"
            >
              <option value="all">All Types</option>
              <option value="badge">Badges</option>
              <option value="certificate">Certificates</option>
              <option value="internship">Internships</option>
              <option value="contribution">Contributions</option>
            </select>
          </div>

          <button
            onClick={fetchItems}
            className="p-2 bg-gray-800 rounded hover:bg-gray-700"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Item" : "Create New Item"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                  >
                    <option value="badge">Badge</option>
                    <option value="certificate">Certificate</option>
                    <option value="internship">Internship</option>
                    <option value="contribution">Contribution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Issuer</label>
                  <input
                    type="text"
                    name="issuer"
                    value={formData.issuer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                    placeholder="Microsoft, Google..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Event</label>
                  <input
                    type="text"
                    name="event"
                    value={formData.event}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                    placeholder="Hackathon, Conference..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                    placeholder="Developer, Participant..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                    placeholder="Frontend, AI, Cloud..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                    placeholder="3 months"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Mode</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Completed">Completed</option>
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm mb-1">Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                    placeholder="React, Node.js, Python"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm mb-1">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData(initialForm);
                  }}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Items List */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No items found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs">Image</th>
                    <th className="px-4 py-3 text-left text-xs">Title</th>
                    <th className="px-4 py-3 text-left text-xs">Type</th>
                    <th className="px-4 py-3 text-left text-xs">Issuer/Event</th>
                    <th className="px-4 py-3 text-left text-xs">Category</th>
                    <th className="px-4 py-3 text-right text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-700/50">
                      <td className="px-4 py-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 rounded object-cover border border-gray-600"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{item.title}</div>
                        {item.role && <div className="text-xs text-gray-400">{item.role}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${getTypeBadge(item.type)}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {item.issuer || item.event || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {item.category && (
                          <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                            {item.category}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {item.image && (
                            <button
                              onClick={() => window.open(item.image, "_blank")}
                              className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id, item.title)}
                            className="p-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}