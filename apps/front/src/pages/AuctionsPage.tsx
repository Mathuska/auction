import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import axiosInstance from "../api/axios";
import type { Auction } from "../types/auction";

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await axiosInstance.get("/auction");
      setAuctions(response.data);
    } catch (err) {
      setError("Failed to fetch auctions. Please try again later.");
      throw err;
    }
  };

  const handleCloseAuction = async (auctionId: string) => {
    try {
      await axiosInstance.post(`/auction/close/${auctionId}`);
      setSuccessMessage("Auction closed successfully.");
      fetchAuctions();
    } catch (err) {
      setError("Failed to close auction. Please try again.");
      throw err;
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Not set";
    return moment(date).format("MMMM Do YYYY, h:mm:ss a");
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Auctions</h1>
        <Link
          to="/auctions/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Auction
        </Link>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Starting Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ending Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auctions.map((auction) => (
              <tr key={auction.id}>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link to={`/auctions/${auction.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                    {auction.id}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(auction.start_time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(auction.end_time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${auction.starting_price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${auction.ending_price || null}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(auction.status)}`}
                  >
                    {auction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {auction.status === "open" && (
                    <button
                      onClick={() => handleCloseAuction(auction.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Close Auction
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
