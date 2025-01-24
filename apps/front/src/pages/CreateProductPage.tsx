import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

interface CreateProductForm {
  description: string;
  product_type: string;
  start_price: number;
}

export default function CreateProductPage() {
  const [formData, setFormData] = useState<CreateProductForm>({
    description: "",
    product_type: "",
    start_price: 0,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "start_price" ? Number.parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/product/create", formData);
      navigate("/products");
    } catch (err) {
      setError("Failed to create product. Please try again.");
      throw err;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Create New Product</h2>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="product_type"
              className="block text-sm font-medium text-gray-700"
            >
              Product Type
            </label>
            <input
              type="text"
              id="product_type"
              name="product_type"
              value={formData.product_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="start_price"
              className="block text-sm font-medium text-gray-700"
            >
              Starting Price
            </label>
            <input
              type="number"
              id="start_price"
              name="start_price"
              value={formData.start_price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
