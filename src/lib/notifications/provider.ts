/**
 * Abstract Notification Delivery System for AdorePark
 * Designed for zero-cost operation (In-App + WhatsApp wa.me links) and extensible
 * for future SMS / WhatsApp Business API / WebPush providers.
 */

export interface NotificationPayload {
  recipientId: string;
  recipientPhone: string;
  recipientName: string;
  vehiclePlate: string;
  location: string;
  incidentId: string;
  reportedAt: Date;
}

export interface NotificationResult {
  success: boolean;
  providerName: string;
  whatsappUrl?: string;
  message?: string;
}

export interface INotificationProvider {
  name: string;
  sendNotification(payload: NotificationPayload): Promise<NotificationResult>;
}

/**
 * 1. In-App Notification Provider (Stores alert in MongoDB notifications collection)
 */
export class InAppNotificationProvider implements INotificationProvider {
  name = "InAppProvider";

  async sendNotification(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      const { Notification } = await import("@/models/Notification");
      const { connectToDatabase } = await import("@/lib/mongodb");
      await connectToDatabase();

      await Notification.create({
        recipientId: payload.recipientId,
        type: "move_request",
        title: `Your vehicle ${payload.vehiclePlate} may be blocking another resident`,
        message: `Location: ${payload.location}. Please check or move your vehicle.`,
        incidentId: payload.incidentId,
        isRead: false,
      });

      return { success: true, providerName: this.name };
    } catch (err: any) {
      return { success: false, providerName: this.name, message: err.message };
    }
  }
}

/**
 * 2. WhatsApp Free wa.me Link Provider
 * Generates pre-formatted zero-cost WhatsApp message link for direct resident-to-resident / guard nudges.
 */
export class WhatsAppLinkProvider implements INotificationProvider {
  name = "WhatsAppLinkProvider";

  async sendNotification(payload: NotificationPayload): Promise<NotificationResult> {
    let cleanPhone = payload.recipientPhone.replace(/[^0-9]/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }

    const encodedText = encodeURIComponent(
      `Hello ${payload.recipientName}, your vehicle *${payload.vehiclePlate}* may be blocking another resident at *${payload.location}* in Adore Grand. Requesting you to kindly move or check it. Thank you!`
    );

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    return {
      success: true,
      providerName: this.name,
      whatsappUrl,
    };
  }
}

/**
 * Multi-Channel Dispatcher Strategy
 */
export class NotificationService {
  private providers: INotificationProvider[] = [
    new InAppNotificationProvider(),
    new WhatsAppLinkProvider(),
  ];

  async dispatchMoveRequest(payload: NotificationPayload): Promise<{
    inAppSuccess: boolean;
    whatsappUrl?: string;
  }> {
    let whatsappUrl: string | undefined;

    for (const provider of this.providers) {
      const res = await provider.sendNotification(payload);
      if (res.whatsappUrl) {
        whatsappUrl = res.whatsappUrl;
      }
    }

    return {
      inAppSuccess: true,
      whatsappUrl,
    };
  }
}

export const notificationService = new NotificationService();
