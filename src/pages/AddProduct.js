import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [onOffer, setonOffer] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const navigate = useNavigate();

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await API.get("/products");
      setConnectionError(false);
    } catch (error) {
      console.error("Backend connection failed:", error);
      setConnectionError(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check if backend is reachable first
      if (connectionError) {
        throw new Error("Backend server is not reachable");
      }

      // Debug logging
      console.log("Form data before submission:", {
        name,
        description,
        price,
        isAvailable,
        onOffer
      });

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      // Ensure booleans are properly converted
      formData.append("isAvailable", isAvailable.toString());
      formData.append("onOffer", onOffer.toString());
      if (image) {
        formData.append("image", image);
      }

      // Debug FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      console.log("Submitting product data...");
      const res = await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Server response:", res.data);
      alert("✅ Product Added: " + res.data.name);
      navigate("/list");
    } catch (err) {
      console.error("Error details:", err);
      
      let errorMessage = "❌ Failed to add product";
      
      if (err.code === 'ERR_NETWORK') {
        errorMessage = "❌ Cannot connect to server. Please ensure:\n" +
                      "1. Backend server is running on http://localhost:5000\n" +
                      "2. CORS is properly configured on the backend\n" +
                      "3. No firewall is blocking the connection";
      } else if (err.response) {
        errorMessage = `❌ Server Error: ${err.response.data?.message || err.response.statusText}`;
      } else if (err.message) {
        errorMessage = `❌ Error: ${err.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-lg text-gray-600">Fill in the details to add a new product to your inventory</p>
      </div>

      {connectionError && (
        <div className="px-6 py-4 mb-6 text-red-800 border border-red-200 bg-red-50 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚠️</span>
            <div>
              <strong>Connection Error:</strong> Cannot connect to backend server. 
              Make sure your backend is running on http://localhost:5000
              <button 
                onClick={checkBackendConnection}
                className="ml-2 font-medium text-red-900 underline hover:no-underline"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-8 bg-white shadow-xl rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Product Name *
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Price (PKR) *
            </label>
            <div className="relative">
              <span className="absolute font-medium text-gray-500 transform -translate-y-1/2 left-3 top-1/2">Rs.</span>
              <input
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full py-3 pl-12 pr-4 transition-all duration-200 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Product Image
            </label>
            <div className="p-6 text-center transition-colors duration-200 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-500">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover w-32 h-32 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="font-medium text-red-600 hover:text-red-800"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-4xl">📷</div>
                  <p className="text-gray-600">Click to upload product image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full mt-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          {/* Availability and Offer */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isAvailable"
                checked={isAvailable}
                onChange={(e) => {
                  console.log("Availability changed:", e.target.checked);
                  setIsAvailable(e.target.checked);
                }}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isAvailable" className="text-sm font-semibold text-gray-700">
                Product is available in stock
                <span className="ml-2 text-xs text-gray-500">
                  (Currently: {isAvailable ? "Available" : "Not Available"})
                </span>
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="onOffer"
                checked={onOffer}
                onChange={(e) => {
                  console.log("Offer status changed:", e.target.checked);
                  setonOffer(e.target.checked);
                }}
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="onOffer" className="text-sm font-semibold text-gray-700">
                Product is on special offer
                <span className="ml-2 text-xs text-gray-500">
                  (Currently: {onOffer ? "On Offer" : "Regular Price"})
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex pt-6 space-x-4">
            <button
              type="submit"
              disabled={loading || connectionError}
              className="flex items-center justify-center flex-1 px-6 py-3 space-x-2 font-medium text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                  <span>Adding Product...</span>
                </>
              ) : (
                <>
                  <span>➕</span>
                  <span>Add Product</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/list")}
              className="px-6 py-3 font-medium text-gray-700 transition-all duration-200 border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
