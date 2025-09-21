import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import ProductForm from "../components/ProductForm";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Backend URL from env, fallback to localhost
  const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      const product = res.data;

      setInitialData({
        ...product,
        manufacturingDate: product.manufacturingDate
          ? product.manufacturingDate.split("T")[0]
          : "",
        expiryDate: product.expiryDate
          ? product.expiryDate.split("T")[0]
          : "",
        category: product.category?._id || "",
        imagePreview: product.image
          ? `${backendURL}/uploads/${product.image}`
          : null, // dynamic backend URL
      });
    } catch (err) {
      console.error(err);
      navigate("/list");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (formData) => {
    try {
      await API.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/list");
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  if (loading)
    return <div className="mt-16 text-center">Loading product data...</div>;
  if (!initialData)
    return <div className="mt-16 text-center">Product not found</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="mb-4 text-4xl font-bold text-center">Edit Product</h1>
      <p className="mb-8 text-center text-gray-600">
        Update the product details
      </p>
      <ProductForm
        initialData={initialData}
        onSubmit={handleEdit}
        submitLabel="Update Product"
      />
    </div>
  );
}
