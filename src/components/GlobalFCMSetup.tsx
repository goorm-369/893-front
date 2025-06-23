// "use client";

// import { useEffect } from "react";
// import { requestPermissionAndGetToken } from "@/lib/firebase-messaging";
// import { sendFcmTokenToServer } from "@/lib/api/notification";

// export default function GlobalFCMSetup() {
//   useEffect(() => {
//     async function init() {
//       const token = await requestPermissionAndGetToken();
//       if (token) {
//         console.log("📨 FCM 토큰 발급됨:", token);
//         await sendFcmTokenToServer(token);
//       } else {
//         console.warn("❌ FCM 토큰이 없거나 권한이 거부됨");
//       }
//     }

//     init();
//   }, []);

//   return null; // 렌더링 없이 side effect만 수행
// }
