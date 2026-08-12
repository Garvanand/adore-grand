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
  } catch (error: any) {
    // Clean up expired or revoked browser endpoints automatically (HTTP 410 Gone / 404 Not Found)
    if (error?.statusCode === 410 || error?.statusCode === 404) {
      try {
        const { PushSubscription } = await import("@/models/PushSubscription");
        const { connectToDatabase } = await import("@/lib/mongodb");
        await connectToDatabase();
        await PushSubscription.deleteOne({ endpoint: subscription.endpoint });
      } catch (delErr) {
        console.warn("Failed to prune expired push subscription:", delErr);
      }
    }
    console.error("Web Push send failure:", error?.message || error);
    return { success: false, error };
  }
}

/**
 * Dispatch real-time browser push notifications to all registered device endpoints for a user
 */
export async function dispatchPushNotificationToUser(
  userId: string | undefined | null,
  payload: { title: string; body: string; url?: string; icon?: string }
) {
  try {
    if (!userId) return;
    const { PushSubscription } = await import("@/models/PushSubscription");
    const { connectToDatabase } = await import("@/lib/mongodb");
    await connectToDatabase();

    const subscriptions = await PushSubscription.find({ userId }).lean();
    if (!subscriptions || subscriptions.length === 0) return;

    await Promise.allSettled(
      subscriptions.map((sub: any) =>
        sendWebPushNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload
        )
      )
    );
  } catch (err) {
    console.error("Failed to dispatch Web Push to user:", err);
  }
}

export { publicVapidKey };
