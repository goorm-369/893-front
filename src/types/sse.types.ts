import { Bid } from "./productData";
import { Status } from "./userData";

export interface SSEAuctionStatus {
  auctionId: number;
  status: Status;
  timestamp: string;
}

export interface SSEBidResult {
  message: string;
  data: {
    canCancelBid: boolean;
    bid: Bid;
  };
}