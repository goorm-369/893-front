import { Bid } from "@/types/productData";

interface BidHistoryProps {
  bidData: Bid[];
  cancelData: Bid[];
}

export default function BidHistory({ bidData, cancelData }: BidHistoryProps) {
  
  const renderTable = (data: Bid[], title: string, isCancelled: boolean) => (
    <div>
      <h2 className={`pr-4 mb-2 text-lg text-end ${isCancelled ? 'bg-cancel' : 'bg-detailbid'}`}>
        {title}
      </h2>
      <table className="w-full mt-2 text-sm text-center border-t">
        <thead className="text-gray-600 border-b">
          <tr>
            <th className="px-1 py-2">순위</th>
            <th className="px-1 py-2">이메일</th>
            <th className="px-1 py-2">입찰가</th>
            <th className="px-1 py-2">시간</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td className="px-1 py-2">{idx + 1}</td>
              <td className="px-1 py-2">{item.bidderEmail}</td>
              <td className="px-1 py-2">₩{item.bidPrice.toLocaleString()}</td>
              <td className="px-1 py-2">{item.createdAt.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="max-w-620px p-4 mx-auto border rounded-lg shadow-sm">
      {renderTable(bidData, "입찰 내역", false)}
      {renderTable(cancelData, "입찰 취소", true)}
    </div>
  );
}
