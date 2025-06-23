// // components/TestFCM.tsx
// "use client";
// import toast from "react-hot-toast";

// import { useEffect } from "react";
// import { requestPermissionAndGetToken } from "@/lib/firebase-messaging";

// export default function TestFCM() {
//   useEffect(() => {
//     async function fetchFCMToken() {
//       const token = await requestPermissionAndGetToken();
//       if (token) {
//         console.log("📦 FCM Token:", token);
//         toast.success("FCM 토큰이 콘솔에 출력되었습니다.");
//       } else {
//         console.warn("❌ FCM 토큰을 가져오지 못했습니다.");
//         toast.error("FCM 토큰을 가져오지 못했습니다.");
//       }
//     }

//     fetchFCMToken();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold">FCM 토큰 테스트 중...</h1>
//       <p>브라우저에서 알림 권한을 허용하고 콘솔을 확인하세요.</p>
//     </div>
//   );
// }
