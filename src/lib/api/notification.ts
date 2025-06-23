// import axios from "axios";

// export async function sendFcmTokenToServer(fcmToken: string) {
//   try {
//     const res = await axios.post(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/fcm-token`,
//       {
//         fcmToken: fcmToken, // ✅ 정확한 키로 JSON 객체 전송
//       },
//       {
//         headers: {
//           "Content-Type": "application/json", // ✅ 헤더 명시 (axios는 자동 설정되지만 명시해도 안전)
//         },
//         withCredentials: true,
//       }
//     );
//     console.log("✅ 전송 성공:", res.data);
//   } catch (err) {
//     console.error("💥 FCM 토큰 서버 전송 실패:", err);
//   }
// }
