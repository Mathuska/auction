import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          AuctionHub
        </Link>
        <div className="space-x-4">
          <Link to="/dashboard" className="hover:text-blue-200">
            Dashboard
          </Link>
          <Link to="/products" className="hover:text-blue-200">
            Products
          </Link>
          <Link to="/auctions" className="hover:text-blue-200">
            Auctions
          </Link>
          <Link to="/bids" className="hover:text-blue-200">
            Bids
          </Link>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              localStorage.removeItem("authToken");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
