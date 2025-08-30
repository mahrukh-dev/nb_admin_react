import { Link } from "react-router-dom";

export default function ProductCard({ product, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onDelete(product._id, product.name);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-xl">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-3xl mb-1">📦</div>
              <p className="text-xs">No Image</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-lg ${
            product.isAvailable 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {product.isAvailable ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
            {product.description}
          </p>
        )}
        

        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            to={`/edit/${product._id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm font-medium"
          >
            ✏️ Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm font-medium"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
