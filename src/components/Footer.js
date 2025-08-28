export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">NB</span>
              </div>
              <span className="text-xl font-semibold">Nadir Brothers</span>
            </div>
            <p className="text-gray-300">
              Your trusted partner for quality products and exceptional service.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-300">
              <li>📞 Phone: +1 (555) 123-4567</li>
              <li>📧 Email: info@nadirbrothers.com</li>
              <li>📍 Location: Your City, State</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                📘 Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                📷 Instagram
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                🐦 Twitter
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 Nadir Brothers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
