import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import type { OpenAuctionDto } from "../types/auction";
import moment from "moment";

interface Product {
  id: string;
  description: string;
}

export default function CreateAuctionPage() {
  const [formData, setFormData] = useState<OpenAuctionDto>({
    product_id: "",
    end_time: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/product");
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
      throw err;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "starting_price" ||
        name === "ending_price" ||
        name === "product_id"
          ? value
          : name === "start_time" || name === "end_time"
            ? moment(value).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
            : value,
    }));
  };
  console.log(formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auction/open", formData);
      console.log(response);
      setSuccessMessage("Auction created successfully!");
      setTimeout(() => navigate("/auctions"), 2000);
    } catch (err) {
      setError("Failed to create auction. Please try again.");
      throw err;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Create New Auction</h2>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="product_id"
              className="block text-sm font-medium text-gray-700"
            >
              Product
            </label>
            <select
              id="product_id"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                  className="color-black"
                >
                  {product.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="end_time"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="datetime-local"
              id="end_time"
              name="end_time"
              value={moment(formData.end_time).format("YYYY-MM-DDTHH:mm")}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/auctions")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
