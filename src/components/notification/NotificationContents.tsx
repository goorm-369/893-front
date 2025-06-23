// import { EllipsisVertical, Dot } from "lucide-react";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import Image from "next/image";

// // 부모로부터 전달받는 props 타입
// type NotificationProps = {
//   id: number;
//   image: string;
//   title: string;
//   date: string;
//   category: string;
//   content: string;
//   auctionId?: number;
//   isRead?: boolean;
//   setDimmed: (dimmed: boolean) => void; // 부모에게 dim 상태 전달
//   markAsRead: (id: number) => void; // 읽음 처리 콜백
//   onRequestOptions: () => void; // 옵션 버튼 눌렀을 때 부모에게 알림
// };

// export default function NotificationContents({
//   id,
//   image,
//   title,
//   date,
//   category,
//   content,
//   auctionId,
//   isRead = true,
//   setDimmed,
//   markAsRead,
//   onRequestOptions,
// }: NotificationProps) {
//   const router = useRouter();
//   const [showOptions, setShowOptions] = useState(false); // 알림 우측 옵션 버튼 상태

//   // 옵션이 열리면 부모에게 dim 요청
//   useEffect(() => {
//     setDimmed(showOptions);
//   }, [showOptions, setDimmed]);

//   // 알림 클릭 시: 읽음 처리 + 상세 페이지 이동
//   const handleClick = async () => {
//     try {
//       // console.log("🧾 클릭한 알림 ID:", id);
//       // console.log("📦 auctionId 확인:", auctionId);

//       if (!isRead) {
//         await fetch(`/api/notification/read/${id}`, { method: "POST" });
//         markAsRead(id); // 읽음 상태로 변경
//       }

//       // 경매 상세 페이지로 이동
//       if (auctionId) router.push(`/auction/${auctionId}`);
//     } catch (err) {
//       console.error("알림 클릭 실패:", err);
//       toast.error("알림 클릭 처리에 실패했습니다.");
//     }
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className={`flex flex-col p-4 w-[349px] h-[107px] rounded-xl shadow-sm border border-alarmborder cursor-pointer relative transition-opacity ${
//         isRead ? "opacity-40" : "bg-white"
//       }`}
//     >
//       <div className="flex flex-row items-center justify-between w-full">
//         {/* 알림 썸네일 이미지 */}
//         <Image
//           src={image}
//           alt=""
//           width={26}
//           height={26}
//           className="w-[26px] h-[26px] rounded-2xl object-cover"
//         />

//         <div className="flex-1">
//           <div className="flex items-center justify-between">
//             <div className="flex flex-row">
//               {/* 알림 제목 */}
//               <h2 className="text-[15px] font-bold text-[#1E1E23] pl-2 truncate">
//                 {title.length > 10 ? `${title.slice(0, 10)}...` : title}
//               </h2>

//               {/* 구분 점과 날짜/카테고리 표시 */}
//               <Dot className="text-alarmdot" />
//               <div className="text-[13px] text-alarmkeyword flex items-center">
//                 {date}
//                 <Dot className="text-alarmdot" />
//                 {category}
//               </div>
//             </div>

//             {/* 우측 옵션(점 세 개) 버튼 */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation(); // 클릭 이벤트 상위 전파 막기
//                 setShowOptions(true); // 옵션 모달 상태 true
//                 onRequestOptions(); // 부모에게 알림 (삭제 모달 띄움)
//               }}
//               className="text-alarmkeyword hover:opacity-60"
//             >
//               <EllipsisVertical size={20} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 알림 내용 */}
//       <div className="text-[14px] text-[#303038] font-normal mt-[12px]">
//         {content}
//       </div>
//     </div>
//   );
// }
