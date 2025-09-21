import { useState, useEffect } from "react";
import API from "../api";
import { Camera, CheckCircle, Tag, XCircle } from "lucide-react";

export default function ProductForm({ initialData = {}, onSubmit, submitLabel = "Save Product" }) {
  // ✅ Initialize states with initialData if editing
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [price, setPrice] = useState(initialData.price || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [manufacturingDate, setManufacturingDate] = useState(initialData.manufacturingDate || "");
  const [expiryDate, setExpiryDate] = useState(initialData.expiryDate || "");
  const [isAvailable, setIsAvailable] = useState(initialData.available ?? true);
  const [onOffer, setOnOffer] = useState(initialData.onOffer ?? false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.imagePreview || null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    checkBackendConnection();
    fetchCategories();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await API.get("/products");
      setConnectionError(false);
    } catch {
      setConnectionError(true);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch {
      setCategories([]);
    }
  };

  // ✅ Handle image change for both Add & Edit
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      // Keep existing preview if editing
      setImagePreview(initialData.imagePreview || null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Product name is required";
    if (!price) newErrors.price = "Price is required";
    if (!category) newErrors.category = "Category is required";
    if (manufacturingDate && expiryDate && new Date(expiryDate) < new Date(manufacturingDate)) {
      newErrors.expiryDate = "Expiry date cannot be before manufacturing date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (connectionError) throw new Error("Backend server is not reachable");

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("category", category);
      if (manufacturingDate) formData.append("manufacturingDate", manufacturingDate);
      if (expiryDate) formData.append("expiryDate", expiryDate);
      formData.append("available", isAvailable.toString());
      formData.append("onOffer", onOffer.toString());
      if (image) formData.append("image", image);

      await onSubmit(formData);
    } catch (err) {
      setErrors({ submit: err.message || "Failed to save product" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl p-8 mx-auto space-y-6 bg-white shadow-xl rounded-2xl">
      {/* Connection Error */}
      {connectionError && (
        <div className="flex items-center p-4 mb-4 text-red-800 border border-red-200 bg-red-50 rounded-xl">
          <XCircle className="w-5 h-5 mr-2" />
          Cannot connect to backend server. Make sure it is running.
        </div>
      )}

      {/* Submission Error */}
      {errors.submit && (
        <div className="flex items-center p-4 mb-4 text-red-800 border border-red-200 bg-red-50 rounded-xl">
          <XCircle className="w-5 h-5 mr-2" /> {errors.submit}
        </div>
      )}

      {/* Product Name */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Product Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.category ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Price (PKR) *</label>
        <div className="relative">
          <span className="absolute font-medium text-gray-500 -translate-y-1/2 left-3 top-1/2">Rs.</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            className={`w-full py-3 pl-12 pr-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
      </div>

      {/* Manufacturing & Expiry */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Manufacturing Date</label>
          <input
            type="date"
            value={manufacturingDate}
            onChange={(e) => setManufacturingDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            min={manufacturingDate || undefined}
            onChange={(e) => setExpiryDate(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.expiryDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="flex items-center block mb-2 space-x-1 font-semibold text-gray-700">
          <Camera className="w-4 h-4" /> Product Image
        </label>
        <div className="p-6 text-center border-2 border-dashed rounded-xl hover:border-indigo-500">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="object-cover w-32 h-32 mx-auto rounded-lg" />
          ) : (
            <div className="text-4xl text-gray-400">📷</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full mt-4 text-sm text-gray-500 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
      </div>

      {/* Availability & Offer */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label className="flex items-center space-x-1 text-sm font-semibold text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-500" /> Available
          </label>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={onOffer}
            onChange={(e) => setOnOffer(e.target.checked)}
            className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <label className="flex items-center space-x-1 text-sm font-semibold text-gray-700">
            <Tag className="w-4 h-4 text-orange-500" /> On Offer
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || connectionError}
        className="flex items-center justify-center w-full px-6 py-3 space-x-2 font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? <span>Saving...</span> : <span>{submitLabel}</span>}
      </button>
    </form>
  );
}
