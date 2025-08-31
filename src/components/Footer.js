export default function Footer() {
  return (
    <footer className="mt-auto text-white bg-gray-800">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center mb-4 space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full">
                <span className="text-sm font-bold text-white">NB</span>
              </div>
              <span className="text-xl font-semibold">Nadir Brothers</span>
            </div>
            <p className="text-gray-300">
              Your trusted partner for quality products and exceptional service.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Info</h3>
            <ul className="space-y-2 text-gray-300">
              <li>📞 Phone: 051-5533395</li>
              <li>📍 Location: Shop no: 11 , Kashif plaza,</li>
              <li>   Nankari Bazar, Near Fowara Chowk, Rawalpindi</li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 transition-colors hover:text-white">
                📘 Facebook
              </a>
              <a href="#" className="text-gray-300 transition-colors hover:text-white">
                📷 Instagram
              </a>
              <a href="#" className="text-gray-300 transition-colors hover:text-white">
                🐦 Twitter
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-6 mt-8 text-center text-gray-400 border-t border-gray-700">
          <p>&copy; 2025 Nadir Brothers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
