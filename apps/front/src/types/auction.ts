export interface OpenAuctionDto {
  product_id: string;
  end_time: string;
}

export interface Auction {
  id: string;
  product_id: string;
  start_time: string;
  end_time: string;
  starting_price: number;
  ending_price: number;
  status: "pending" | "open" | "closed";
}
