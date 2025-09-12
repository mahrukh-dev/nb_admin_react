import { Link } from "react-router-dom";

export default function ProductCard({ product, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onDelete(product._id, product.name);
    }
  };

  return (
    <div className="transition-all duration-300 transform bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-2">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-xl">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-40 transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-400">
              <div className="mb-1 text-3xl">📦</div>
              <p className="text-xs">No Image</p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-lg ${
              product.available ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {product.available ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Offer Badge */}
        {product.onOffer && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded-full shadow-lg">
              🔥 On Offer
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-1">
          {product.name}
        </h3>

        {product.description && (
          <p className="h-10 mb-3 text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price */}
        {product.price && (
          <div className="mb-3">
            <span className="text-2xl font-bold text-indigo-600">
              Rs. {Number(product.price).toLocaleString()}
            </span>
            {product.onOffer && (
              <span className="px-2 py-1 ml-2 text-xs text-orange-800 bg-orange-100 rounded-full">
                Special Offer
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            to={`/edit/${product._id}`}
            className="flex-1 px-3 py-2 text-sm font-medium text-center text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ✏️ Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex-1 px-3 py-2 text-sm font-medium text-white transition-all duration-200 bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
