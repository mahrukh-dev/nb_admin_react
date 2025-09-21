"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../api"
import ProductCard from "../components/ProductCard"

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAvailable, setFilterAvailable] = useState("all")
  const [filterOffer, setFilterOffer] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all") // new category filter
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 20

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products")
      setProducts(res.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories")
      setCategories(res.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  // Delete product
  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`)
      setProducts(products.filter((p) => p._id !== id))
      alert("✅ Product deleted successfully")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("❌ Failed to delete product")
    }
  }

  // Filtered products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const isProductAvailable = product.isAvailable !== undefined ? product.isAvailable : product.available

    const isProductOnOffer = product.isOnOffer !== undefined ? product.isOnOffer : product.onOffer

    const matchesAvailable =
      filterAvailable === "all" ||
      (filterAvailable === "available" && isProductAvailable) ||
      (filterAvailable === "unavailable" && !isProductAvailable)

    const matchesOffer =
      filterOffer === "all" ||
      (filterOffer === "onOffer" && isProductOnOffer) ||
      (filterOffer === "notOnOffer" && !isProductOnOffer)

    const matchesCategory =
      filterCategory === "all" ||
      (product.category &&
        ((typeof product.category === "object" && product.category._id === filterCategory) ||
          product.category === filterCategory))

    return matchesSearch && matchesAvailable && matchesOffer && matchesCategory
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [searchTerm, filterAvailable, filterOffer, filterCategory])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-16 h-16 mb-4 border-b-4 border-indigo-600 rounded-full animate-spin"></div>
        <p className="font-medium text-gray-600">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">Product Inventory</h1>
        <p className="text-lg text-gray-600">Manage your products efficiently</p>
      </div>

      {/* Search & Filters */}
      <div className="p-6 bg-white shadow-lg rounded-2xl">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-xl text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Availability */}
          <div className="relative">
            <select
              value={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.value)}
              className="px-4 py-3 pr-8 text-gray-900 bg-white border border-gray-300 appearance-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Products ({products.length})</option>
              <option value="available">
                In Stock ({products.filter((p) => (p.isAvailable !== undefined ? p.isAvailable : p.available)).length})
              </option>
              <option value="unavailable">
                Out of Stock (
                {products.filter((p) => !(p.isAvailable !== undefined ? p.isAvailable : p.available)).length})
              </option>
            </select>
          </div>

          {/* Offer */}
          <div className="relative">
            <select
              value={filterOffer}
              onChange={(e) => setFilterOffer(e.target.value)}
              className="px-4 py-3 pr-8 text-gray-900 bg-white border border-gray-300 appearance-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Offers ({products.length})</option>
              <option value="onOffer">
                On Offer ({products.filter((p) => (p.isOnOffer !== undefined ? p.isOnOffer : p.onOffer)).length})
              </option>
              <option value="notOnOffer">
                Not on Offer ({products.filter((p) => !(p.isOnOffer !== undefined ? p.isOnOffer : p.onOffer)).length})
              </option>
            </select>
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 pr-8 text-gray-900 bg-white border border-gray-300 appearance-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add Product */}
          <Link
            to="/add"
            className="flex items-center px-6 py-3 space-x-2 font-medium text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700"
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

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white shadow-lg rounded-2xl">
          <div className="mb-6 opacity-50 text-8xl">📦</div>
          <h3 className="mb-3 text-2xl font-bold text-gray-900">
            {products.length === 0 ? "No products found" : "No products match your filters"}
          </h3>
          <p className="mb-8 text-lg text-gray-600">
            {products.length === 0
              ? "Get started by adding your first product."
              : "Try adjusting your filters or search."}
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} onDelete={handleDelete} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 mt-8 bg-white shadow-lg rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}{" "}
                  products
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1
                      const isCurrentPage = pageNumber === currentPage
                      const showPage =
                        pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - currentPage) <= 1

                      if (!showPage) {
                        if (pageNumber === 2 && currentPage > 4)
                          return (
                            <span key={pageNumber} className="px-2 text-gray-500">
                              ...
                            </span>
                          )
                        if (pageNumber === totalPages - 1 && currentPage < totalPages - 3)
                          return (
                            <span key={pageNumber} className="px-2 text-gray-500">
                              ...
                            </span>
                          )
                        return null
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => {
                            setCurrentPage(pageNumber)
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            isCurrentPage ? "bg-indigo-600 text-white" : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
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
  )
}
