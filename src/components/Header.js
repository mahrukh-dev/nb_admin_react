import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-indigo-600 font-bold text-xl">NB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide">
                  Nadir Brothers
                </h1>
                <p className="text-indigo-200 text-sm">Product Management</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-2">
            <Link
              to="/list"
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/list') || isActive('/')
                  ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                  : 'text-white hover:bg-white hover:bg-opacity-20 hover:scale-105'
              }`}
            >
              <span className="text-lg">👁️</span>
              <span>View Products</span>
            </Link>
            <Link
              to="/add"
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/add')
                  ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                  : 'text-white hover:bg-white hover:bg-opacity-20 hover:scale-105'
              }`}
            >
              <span className="text-lg">➕</span>
              <span>Add Product</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
