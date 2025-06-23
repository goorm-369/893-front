// import { initializeApp } from "firebase/app";
// import {
//   getMessaging,
//   getToken,
//   onMessage,
//   isSupported,
// } from "firebase/messaging";

// // ✅ Firebase 앱 초기화
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
// };

// const app = initializeApp(firebaseConfig);

// // ✅ messaging 인스턴스를 안전하게 비동기 반환
// let messagingInstance: ReturnType<typeof getMessaging> | null = null;

// export const getMessagingInstance = async () => {
//   if (typeof window === "undefined") return null;

//   const supported = await isSupported();
//   if (!supported) {
//     console.warn("⚠️ FCM Messaging은 이 브라우저에서 지원되지 않음");
//     return null;
//   }

//   if (!messagingInstance) {
//     messagingInstance = getMessaging(app);
//   }

//   return messagingInstance;
// };

// // ✅ 토큰 요청 함수
// export const requestPermissionAndGetToken = async () => {
//   const messaging = await getMessagingInstance();
//   if (!messaging) return null;

//   try {
//     const token = await getToken(messaging, {
//       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
//     });
//     return token;
//   } catch (err) {
//     console.error("💥 FCM 토큰 가져오기 실패:", err);
//     return null;
//   }
// };

// // ✅ 실시간 메시지 수신 핸들러
// export const onMessageListener = async () => {
//   const messaging = await getMessagingInstance();
//   return new Promise((resolve) => {
//     if (messaging) {
//       onMessage(messaging, (payload) => {
//         resolve(payload);
//       });
//     }
//   });
// };
