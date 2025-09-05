import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import EditProduct from "./pages/EditProduct";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />

        <main className="flex-1 w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Routes>
            {/* Default route should show Login first */}
            <Route path="/" element={<Login />} />

            {/* Protected admin route */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <ProductList />
                </PrivateRoute>
              }
            />

            {/* Other routes (also protected) */}
            <Route
              path="/add"
              element={
                <PrivateRoute>
                  <AddProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/list"
              element={
                <PrivateRoute>
                  <ProductList />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <PrivateRoute>
                  <EditProduct />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
