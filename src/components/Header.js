import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Eye, Folder, Plus, ShoppingBag } from "lucide-react"; // use lucid-react icons

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = token && token !== "null" && token !== "undefined" && token.trim() !== "";

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // redirect to login page
  };

  return (
    <header className="shadow-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
      <div className="px-2 mx-auto max-w-7xl sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Section */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-lg sm:w-12 sm:h-12">
                <span className="text-sm font-bold text-indigo-600 sm:text-xl">NB</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-wide text-white sm:text-2xl">
                  Nadir Brothers
                </h1>
                <p className="text-xs text-indigo-200 sm:text-sm">Product Management</p>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-sm font-bold text-white">NB Admin</h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1 sm:space-x-2">
            {isLoggedIn ? (
              <>
                <Link
                  to="/list"
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    isActive("/list") ? "bg-white text-indigo-600 shadow-lg" : "text-white hover:bg-white hover:bg-opacity-20 hover:scale-105"
                  }`}
                >
                  <Eye className="w-5 h-5" />
                  <span className="hidden sm:block">View Products</span>
                  <span className="block sm:hidden">View</span>
                </Link>

                <Link
                  to="/categories"
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    isActive("/categories") ? "bg-white text-indigo-600 shadow-lg" : "text-white hover:bg-white hover:bg-opacity-20 hover:scale-105"
                  }`}
                >
                  <Folder className="w-5 h-5" />
                  <span className="hidden sm:block">Categories</span>
                  <span className="block sm:hidden">Cat</span>
                </Link>

                <Link
                  to="/orders"
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    isActive("/orders") ? "bg-white text-indigo-600 shadow-lg" : "text-white hover:bg-white hover:bg-opacity-20 hover:scale-105"
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="hidden sm:block">Orders</span>
                  <span className="block sm:hidden">Orders</span>
                </Link>

                <Link
                  to="/add"
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    isActive("/add") ? "bg-white text-indigo-600 shadow-lg" : "text-white hover:bg-white hover:bg-opacity-20 hover:scale-105"
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:block">Add Product</span>
                  <span className="block sm:hidden">Add</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-2 py-2 text-xs font-medium text-white bg-red-500 rounded-lg sm:px-3 sm:text-sm hover:bg-red-600"
                >
                  <LogOut className="w-4 h-4 mr-1 sm:w-5 sm:h-5" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/"
                className="flex items-center px-2 py-2 space-x-1 text-xs font-medium text-white rounded-lg sm:px-6 sm:py-3 sm:text-sm hover:bg-white hover:bg-opacity-20 hover:scale-105"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Login</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
