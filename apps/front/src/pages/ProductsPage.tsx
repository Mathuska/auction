import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

interface Product {
  id: string;
  description: string;
  product_type: string;
  start_price: number;
  status: "pending" | "verified" | "rejected";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user } = useAuth();

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
  const handleRejectProduct = async (productId: string) => {
    try {
      const response = await axiosInstance.post(`/product/reject/${productId}`);
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        fetchProducts();
      }
    } catch (err) {
      setError("Failed to reject product. Please try again.");
      throw err;
    }
  };

  const handleVerifyProduct = async (productId: string) => {
    try {
      const response = await axiosInstance.post(`/product/verify/${productId}`);
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        fetchProducts();
      }
    } catch (err) {
      setError("Failed to verify product. Please try again.");
      throw err;
    }
  };

  const isAdminOrEmployee =
    user && (user.role === "admin" || user.role === "employee");

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          to="/products/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Product
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
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Starting Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {isAdminOrEmployee && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.product_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${product.start_price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === "verified"
                        ? "bg-green-100 text-green-800"
                        : product.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <>
                    <button
                      onClick={() => handleVerifyProduct(product.id)}
                      className="text-green-600 hover:text-green-900 mr-2"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleRejectProduct(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
