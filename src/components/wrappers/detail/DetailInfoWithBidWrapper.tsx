import { getBidData, getProductData } from "@/lib/api/auction";
import { cookies } from "next/headers";
import DetailInfoWithBid from "@/components/detail/DetailInfoWithBid";
import { AuctionBidData } from "@/types/productData";

export default async function DetailInfoWithBidWrapper({ auctionId }: { auctionId: number }) {
  const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken')?.value;
	const isLoggedIn = accessToken ? true : false;
  const cookieHeader = accessToken ? `accessToken=${accessToken}` : '';

  const [initialBidData, productData] = await Promise.all([
		getBidData(auctionId),
		getProductData(auctionId, cookieHeader),
	]);

  if (!productData) return null;
  
  return (
    <div>
      <DetailInfoWithBid isLoggedIn={isLoggedIn} initialBidData={initialBidData as AuctionBidData} product={productData} />
    </div>
  )
}