import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CreateProductPage from "./pages/CreateProductPage";
import AuctionsPage from "./pages/AuctionsPage";
import CreateAuctionPage from "./pages/CreateAuctionPage";
import BidsPage from "./pages/BidsPage";
import { AuthProvider } from "./contexts/AuthContext";
import AuctionDetailsPage from "./pages/AuctionDetailsPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/create" element={<CreateProductPage />} />
            <Route path="/auctions" element={<AuctionsPage />} />
            <Route path="/auctions/:id" element={<AuctionDetailsPage />} />
            <Route path="/auctions/create" element={<CreateAuctionPage />} />
            <Route path="/bids" element={<BidsPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
