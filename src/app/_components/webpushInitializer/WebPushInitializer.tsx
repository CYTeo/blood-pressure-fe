"use client";

import { useEffect } from "react";

import { subscribeWebPush } from "@/services/api/webpush";

const WebPushInitializer = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.getSubscription();

      // Only attempt to subscribe if we don't have one and permission is ALREADY granted.
      // If permission is 'default', we should NOT call subscribe() here as it will be blocked.
      if (!subscription && Notification.permission === 'granted') {
        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });

        await subscribeWebPush({ subscription: newSubscription });
      }
    } catch (error) {
      console.error("Web Push initialization failed:", error);
    }
  };

  return null;
};

export default WebPushInitializer;
