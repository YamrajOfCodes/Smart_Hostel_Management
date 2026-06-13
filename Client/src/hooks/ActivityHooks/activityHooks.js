// hooks/ActivityHooks/activityHooks.js

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  subscribePush,
  unsubscribePush,
} from "../../types/Activity/activityAPI";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) => char.charCodeAt(0))
  );
}

// ─────────────────────────────────────────────────────────────
// Subscribe to Push Notifications
// ─────────────────────────────────────────────────────────────
export const usePushSubscription = () => {
  const { mutate: saveSubscription } = useMutation({
    mutationFn: subscribePush,
    onSuccess: () => {
      toast.success("Push notifications enabled");
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to enable push notifications"
      );
    },
  });

  const registerPush = async () => {
    try {
      if (!("serviceWorker" in navigator)) {
        console.log("Service Workers not supported");
        return;
      }

      if (!("PushManager" in window)) {
        console.log("Push notifications not supported");
        return;
      }

      let registration = await navigator.serviceWorker.getRegistration();

      if (!registration) {
        registration = await navigator.serviceWorker.register("/sw.js");
      }

      await navigator.serviceWorker.ready;

      const existingSubscription =
        await registration.pushManager.getSubscription();

      // 👇 CHANGED PART
      if (existingSubscription) {
        console.log("Already subscribed");

        // Send existing subscription to backend
        saveSubscription(existingSubscription.toJSON());

        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        toast.error("Notification permission denied");
        return;
      }

      const subscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BN0BrST1zI0o9aPAEztkecY8QXiB-_XyAq8Bw3iXhEEYn5wdEAoxuaSTGgUW2Yv_BeIly6-x_Zq9d76d4lEKsFw"
          ),
        });

      console.log("New subscription:", subscription);

      saveSubscription(subscription.toJSON());
    } catch (error) {
      console.error("Push registration failed:", error);
      toast.error("Failed to register push notifications");
    }
  };

  return { registerPush };
};