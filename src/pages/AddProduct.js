import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import API from "../api";

export default function AddProduct() {
  const navigate = useNavigate();

  const handleAdd = async (formData) => {
    const res = await API.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    navigate("/list");
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="mb-4 text-4xl font-bold text-center">Add New Product</h1>
      <p className="mb-8 text-center text-gray-600">Fill the form to add a new product</p>
      <ProductForm onSubmit={handleAdd} submitLabel="Add Product" />
    </div>
  );
}
