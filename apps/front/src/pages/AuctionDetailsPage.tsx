/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import moment from "moment"
import axiosInstance from "../api/axios"
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid"

type SortColumn = "amount" | "createdAt"
type SortDirection = "asc" | "desc"

export default function AuctionDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [auction, setAuction] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [bidAmount, setBidAmount] = useState<number>(0)
  const [bidError, setBidError] = useState<string | null>(null)
  const [bidSuccess, setBidSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortColumn, setSortColumn] = useState<SortColumn>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  useEffect(() => {
    fetchAuctionDetails()
  }, [id])

  const fetchAuctionDetails = async () => {
    try {
      const response = await axiosInstance.get(`/auction/${id}`)
      setAuction(response.data)
      const currentHighestBid = response.data.bids?.[0]?.bid.amount
      setBidAmount(currentHighestBid ? currentHighestBid + 1 : response.data.starting_price)
    } catch (err) {
      setError("Failed to fetch auction details")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault()
    setBidError(null)
    setBidSuccess(null)

    if (!auction) return

    if (bidAmount <= auction.starting_price) {
      setBidError(`Bid must be higher than starting price: $${auction.starting_price}`)
      return
    }

    const highestBid = auction.bids?.[0]?.bid.amount
    if (highestBid && bidAmount <= highestBid) {
      setBidError(`Bid must be higher than current highest bid: $${highestBid}`)
      return
    }

    const bidData = {
      auction_id: auction.id,
      amount: bidAmount,
    }

    try {
      await axiosInstance.post("/bid", bidData)
      setBidSuccess("Bid placed successfully!")
      fetchAuctionDetails()
    } catch (err: any) {
      setBidError(err.response?.data?.message || "Failed to place bid. Please try again.")
    }
  }

  const sortBids = (bids: any) => {
    return [...bids].sort((a, b) => {
      if (sortColumn === "amount") {
        return sortDirection === "asc" ? a.bid.amount - b.bid.amount : b.bid.amount - a.bid.amount
      } else {
        return sortDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
  }

  const handleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error || !auction) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">{error || "Auction not found"}</h2>
      </div>
    )
  }

  const sortedBids = sortBids(auction.bids || [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Auction Information - Right Side */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Auction Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-sm ${
                    auction.status === "open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {auction.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Time</p>
                <p className="font-medium">{moment(auction.start_time).format("MMMM Do YYYY, h:mm:ss a")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Time</p>
                <p className="font-medium">{moment(auction.end_time).format("MMMM Do YYYY, h:mm:ss a")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Starting Price</p>
                <p className="font-medium">${auction.starting_price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Highest Bid</p>
                <p className="font-medium">${auction.bids?.[0]?.bid.amount || auction.starting_price}</p>
              </div>

              {/* Place Bid Form */}
              {auction.status === "open" && (
                <form onSubmit={handlePlaceBid} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">
                      Your Bid Amount
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="bidAmount"
                        id="bidAmount"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        min={auction.starting_price}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {bidError && <div className="text-sm text-red-600">{bidError}</div>}

                  {bidSuccess && <div className="text-sm text-green-600">{bidSuccess}</div>}

                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Place Bid
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bids Table - Center */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Bids History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bidder
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      Amount
                      {sortColumn === "amount" &&
                        (sortDirection === "asc" ? (
                          <ChevronUpIcon className="w-4 h-4 inline-block ml-1" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4 inline-block ml-1" />
                        ))}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      Time
                      {sortColumn === "createdAt" &&
                        (sortDirection === "asc" ? (
                          <ChevronUpIcon className="w-4 h-4 inline-block ml-1" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4 inline-block ml-1" />
                        ))}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBids.map((bid) => (
                    <tr key={bid.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {bid.user ? `${bid.user.first_name} ${bid.user.last_name}` : "Anonymous"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">${bid.bid.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {moment(bid.bid.createdAt).format("MMM Do YYYY, h:mm:ss a")}
                      </td>
                    </tr>
                  ))}
                  {(!auction.bids || auction.bids.length === 0) && (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        No bids yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Product Information - Bottom */}
        <div className="lg:col-span-3 order-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Product Information</h2>
            {auction.product ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium">{auction.product.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{auction.product.product_type}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Product information not available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

