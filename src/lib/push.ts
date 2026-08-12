import webPush from "web-push";

// User-provided custom VAPID keypair for AdorePark Web Push
const publicVapidKey =
  process.env.VAPID_PUBLIC_KEY ||
  "BCKERKKugNgY7v6t7-44HG13v4rofSNi8bAdcZxMWwv_lg86kXegVHvvTPJe0AkHkuBz_rNgJKpne6T5yG7Q1I4";

const privateVapidKey =
  process.env.VAPID_PRIVATE_KEY || "OMQSKuz7BdODyKPEIRCknhQhTRRzvJZZsNR_hY3qnLM";

webPush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:security@adorepark.in",
  publicVapidKey,
  privateVapidKey
);

export async function sendWebPushNotification(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: { title: string; body: string; url?: string; icon?: string }
) {
  try {
    const pushPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || "/icons/icon-192.png",
      data: { url: payload.url || "/dashboard" },
    });

    await webPush.sendNotification(subscription, pushPayload);
    return { success: true };
  } catch (error) {
    console.error("Web Push send failure:", error);
    return { success: false, error };
  }
}

export { publicVapidKey };
