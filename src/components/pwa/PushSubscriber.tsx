"use client";

import { useEffect } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushSubscriber() {
  useEffect(() => {
    async function initPush() {
      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        return;
      }

      try {
        const reg = await navigator.serviceWorker.ready;
        let sub = await reg.pushManager.getSubscription();

        if (!sub) {
          const publicVapidKey =
            "BCKERKKugNgY7v6t7-44HG13v4rofSNi8bAdcZxMWwv_lg86kXegVHvvTPJe0AkHkuBz_rNgJKpne6T5yG7Q1I4";
          const convertedKey = urlBase64ToUint8Array(publicVapidKey);

          if (Notification.permission === "default") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") return;
          } else if (Notification.permission !== "granted") {
            return;
          }

          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedKey,
          });
        }

        if (sub) {
          const subJson = sub.toJSON();
          await fetch("/api/notifications/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              endpoint: subJson.endpoint,
              keys: subJson.keys,
              deviceName: navigator.userAgent.includes("Mobile") ? "Mobile Browser" : "Desktop Browser",
            }),
          });
        }
      } catch (err) {
        console.warn("[PUSH SUBSCRIBER NOTICE]: Push registration skipped or not granted:", err);
      }
    }

    initPush();
  }, []);

  return null;
}
