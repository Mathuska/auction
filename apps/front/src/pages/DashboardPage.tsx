import React from "react";
import { Link } from "react-router-dom";

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">My Products</h2>
          <p className="mb-4">Manage your products here.</p>
          <Link
            to="/products"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Products
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">My Auctions</h2>
          <p className="mb-4">Manage your auctions here.</p>
          <Link
            to="/auctions"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Auctions
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">My Bids</h2>
          <p className="mb-4">View your active bids here.</p>
          <Link
            to="/bids"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Bids
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
