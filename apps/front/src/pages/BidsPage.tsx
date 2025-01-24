import { Link } from "react-router-dom"

interface Bid {
  id: number
  auctionId: number
  productName: string
  bidAmount: number
  bidTime: string
  status: "winning" | "outbid" | "won"
}

export default function BidsPage() {
  const bids: Bid[] = [
    {
      id: 1,
      auctionId: 101,
      productName: "Product 1",
      bidAmount: 150,
      bidTime: "2024-02-28 14:30",
      status: "winning",
    },
    {
      id: 2,
      auctionId: 102,
      productName: "Product 2",
      bidAmount: 250,
      bidTime: "2024-02-29 10:15",
      status: "outbid",
    },
    {
      id: 3,
      auctionId: 103,
      productName: "Product 3",
      bidAmount: 300,
      bidTime: "2024-02-30 09:45",
      status: "won",
    },
  ]

  const getStatusColor = (status: Bid["status"]) => {
    switch (status) {
      case "winning":
        return "bg-green-100 text-green-800"
      case "outbid":
        return "bg-red-100 text-red-800"
      case "won":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Bids</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bid Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bid Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bids.map((bid) => (
              <tr key={bid.id}>
                <td className="px-6 py-4 whitespace-nowrap">{bid.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap">${bid.bidAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bid.bidTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      bid.status,
                    )}`}
                  >
                    {bid.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/auctions/${bid.auctionId}`} className="text-blue-600 hover:text-blue-900">
                    View Auction
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

