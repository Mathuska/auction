import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-4xl font-bold text-white mb-8">
        Welcome to AuctionHub
      </h1>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-white text-blue-500 px-4 py-2 rounded-md font-semibold hover:bg-blue-100"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-blue-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
