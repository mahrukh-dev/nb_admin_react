import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailable, setFilterAvailable] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      alert("✅ Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("❌ Failed to delete product");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterAvailable === "all" ||
      (filterAvailable === "available" && product.isAvailable) ||
      (filterAvailable === "unavailable" && !product.isAvailable);
    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterAvailable]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-16 h-16 mb-4 border-b-4 border-indigo-600 rounded-full animate-spin"></div>
        <p className="font-medium text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">
          Product Inventory
        </h1>
        <p className="text-lg text-gray-600">
          Manage your products efficiently
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="p-6 bg-white shadow-lg rounded-2xl">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-xl text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <select
              value={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.value)}
              className="px-4 py-3 pr-8 text-gray-900 bg-white border border-gray-300 appearance-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">
                All Products ({products.length})
              </option>
              <option value="available">
                In Stock (
                {products.filter((p) => p.isAvailable).length}
                )
              </option>
              <option value="unavailable">
                Out of Stock (
                {products.filter((p) => !p.isAvailable).length}
                )
              </option>
            </select>
          </div>

          <Link
            to="/add"
            className="flex items-center px-6 py-3 space-x-2 font-medium text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <span>➕</span>
            <span>Add New Product</span>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white shadow-lg rounded-2xl">
          <div className="mb-6 opacity-50 text-8xl">📦</div>
          <h3 className="mb-3 text-2xl font-bold text-gray-900">
            {products.length === 0
              ? "No products found"
              : "No products match your search"}
          </h3>
          <p className="mb-8 text-lg text-gray-600">
            {products.length === 0
              ? "Get started by adding your first product to the inventory"
              : "Try adjusting your search criteria or check different filters"}
          </p>
          {products.length === 0 && (
            <Link
              to="/add"
              className="inline-flex items-center px-8 py-4 space-x-2 font-medium text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700"
            >
              <span>➕</span>
              <span>Add Your First Product</span>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-6 mt-8 bg-white shadow-lg rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      const isCurrentPage = pageNumber === currentPage;
                      
                      // Show first page, last page, current page, and pages around current page
                      const showPage = 
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        Math.abs(pageNumber - currentPage) <= 1;

                      if (!showPage) {
                        // Show ellipsis for gaps
                        if (pageNumber === 2 && currentPage > 4) {
                          return <span key={pageNumber} className="px-2 text-gray-500">...</span>;
                        }
                        if (pageNumber === totalPages - 1 && currentPage < totalPages - 3) {
                          return <span key={pageNumber} className="px-2 text-gray-500">...</span>;
                        }
                        return null;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            isCurrentPage
                              ? 'bg-indigo-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
